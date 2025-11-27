import nodemailer from 'nodemailer';

// Función para validar el correo electrónico
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Función para escapar HTML
const escapeHtml = (text) => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Función para enviar respuesta JSON consistente
const sendJsonResponse = (res, status, data) => {
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).json({
    success: status >= 200 && status < 300,
    ...data
  });
};

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-V, Authorization'
  );

  // Manejar solicitudes de preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo permitir método POST
  if (req.method !== 'POST') {
    return sendJsonResponse(res, 405, { 
      error: 'Método no permitido',
      method: req.method 
    });
  }

  try {
    // Validar que el body es un JSON válido
    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (e) {
        console.error('Error al parsear JSON:', e);
        return sendJsonResponse(res, 400, { 
          error: 'Formato de solicitud inválido' 
        });
      }
    }

    const { name, email, phone, message } = req.body;

    console.log('Datos recibidos:', { name, email, phone, message: message ? '***' : 'vacío' });

    // Validación de campos requeridos
    if (!name || !email || !message) {
      return sendJsonResponse(res, 400, { 
        error: 'Por favor complete todos los campos requeridos',
        missing: {
          name: !name,
          email: !email,
          message: !message
        }
      });
    }

    // Validar formato de correo electrónico
    if (!isValidEmail(email)) {
      return sendJsonResponse(res, 400, { 
        error: 'Por favor ingrese un correo electrónico válido' 
      });
    }

    // Validar variables de entorno
    const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('Variables de entorno faltantes:', missingVars);
      return sendJsonResponse(res, 500, { 
        error: 'Error de configuración del servidor',
        missingEnvVars: missingVars
      });
    }

    // Configuración del transporte SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS.replace(/^'|'$/g, '')
      },
      tls: {
        // Solo para desarrollo, en producción es mejor usar un certificado válido
        rejectUnauthorized: process.env.NODE_ENV !== 'production'
      },
      debug: true, // Habilitar depuración
      logger: true // Registrar información detallada
    });

    // Verificar la conexión SMTP
    try {
      await transporter.verify();
      console.log('Conexión SMTP verificada correctamente');
    } catch (smtpError) {
      console.error('Error al verificar la conexión SMTP:', smtpError);
      return sendJsonResponse(res, 500, { 
        error: 'No se pudo conectar al servidor de correo',
        details: process.env.NODE_ENV === 'development' ? smtpError.message : undefined
      });
    }

    // Configuración del correo (con escape de HTML para prevenir XSS)
    const mailOptions = {
      from: `"Formulario de Contacto" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO || process.env.SMTP_USER,
      replyTo: `"${escapeHtml(name)}" <${escapeHtml(email)}>`,
      subject: `Nuevo mensaje de contacto de ${escapeHtml(name)}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>Teléfono:</strong> ${escapeHtml(phone)}</p>` : ''}
        <p><strong>Mensaje:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Enviado desde el formulario de contacto de Sastrería Carlos Poma</p>
      `,
      text: `Nuevo mensaje de contacto
        
        Nombre: ${name}
        Email: ${email}
        ${phone ? `Teléfono: ${phone}\n` : ''}
        Mensaje:
        ${message}
        
        ---
        Enviado desde el formulario de contacto de Sastrería Carlos Poma
      `
    };

    console.log('Enviando correo con opciones:', {
      ...mailOptions,
      text: mailOptions.text ? '***' : undefined
    });

    // Enviar correo
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Correo enviado:', info.messageId);
      
      return sendJsonResponse(res, 200, { 
        message: 'Mensaje enviado correctamente',
        messageId: info.messageId
      });
    } catch (sendError) {
      console.error('Error al enviar el correo:', sendError);
      throw sendError; // Será manejado por el catch general
    }
    
  } catch (error) {
    console.error('Error en el manejador de envío de correo:', error);
    
    // Mensaje de error más amigable para el usuario
    let errorMessage = 'Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.';
    
    // Detectar errores comunes
    if (error.code === 'ECONNECTION') {
      errorMessage = 'No se pudo conectar al servidor de correo. Por favor, inténtalo más tarde.';
    } else if (error.code === 'EAUTH') {
      errorMessage = 'Error de autenticación con el servidor de correo. Por favor, contacta al administrador.';
    } else if (error.responseCode === 550) {
      errorMessage = 'No se pudo entregar el correo. Por favor, verifica la dirección de correo electrónico.';
    }
    
    return sendJsonResponse(res, 500, { 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Para compatibilidad con Vercel Serverless Functions
export { handler };
