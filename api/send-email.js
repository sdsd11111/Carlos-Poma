import nodemailer from 'nodemailer';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { name, email, phone, message } = req.body;

  // Validación de campos requeridos
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Por favor complete todos los campos requeridos' });
  }

  // Configuración del transporte SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS.replace(/^'|'$/g, '') // Eliminar comillas si existen
    },
    tls: {
      rejectUnauthorized: false // Solo para desarrollo, en producción usa un certificado válido
    }
  });

  // Configuración del correo
  const mailOptions = {
    from: `"Formulario de Contacto" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,
    subject: `Nuevo mensaje de contacto de ${name}`,
    html: `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
      <p><strong>Mensaje:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `
  };

  try {
    // Enviar correo
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return res.status(500).json({ 
      error: 'Error al enviar el mensaje. Por favor, intente nuevamente más tarde.'
    });
  }
}

export { handler };
