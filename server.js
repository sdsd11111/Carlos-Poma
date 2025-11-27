import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handler } from './api/send-email.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());
app.use(express.static('.'));

// Ruta para el formulario
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'contacto.html'));
});

// Ruta para la API de envío de correos
app.post('/api/send-email', async (req, res) => {
    try {
        await handler(req, res);
    } catch (error) {
        console.error('Error en la ruta de la API:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
