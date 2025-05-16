// server.js - Servidor proxy simple para evitar CORS
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Configuración del servidor
const app = express();
app.use(cors());

// Configuración de la API
const API_URL = 'http://10.194.5.185/cbrecaudaciones/valores-pendientes/';
const API_KEY = '9c5bfd0e-acde-4b1c-b3a1-de97e76d08a7';

// Ruta principal para consultar cédulas
app.get('/api/:cedula', async (req, res) => {
    const cedula = req.params.cedula;
    console.log(`[Server] Consultando valores para cédula: ${cedula}`);

    try {
        // Realizar la petición a la API
        const response = await axios({
            method: 'GET',
            url: `${API_URL}${cedula}`,
            headers: {
                'api-key': API_KEY
            }
        });

        // Enviar la respuesta al cliente
        console.log(`[Server] Respuesta exitosa para cédula: ${cedula}`);
        res.json(response.data);

    } catch (error) {
        console.error(`[Server] Error al consultar cédula ${cedula}:`, error.message);

        // Manejar diferentes tipos de errores
        if (error.response) {
            // El servidor respondió con un código de error
            res.status(error.response.status).json(error.response.data);
        } else {
            // Error de red u otros
            res.status(500).json({
                error: true,
                message: 'Error al realizar la consulta',
                details: error.message
            });
        }
    }
});

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/test', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor proxy funcionando correctamente' });
});

// Puerto
const PORT = process.env.PORT || 3001;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor proxy ejecutándose en: http://localhost:${PORT}`);
    console.log(`Para consultar cédulas: http://localhost:${PORT}/api/NUMERO_CEDULA`);
});