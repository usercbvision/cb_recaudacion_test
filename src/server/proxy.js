// server/proxy.js - Servidor proxy que se ejecutará junto con React
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Habilitar CORS para todas las rutas
app.use(cors());

// Configuración
const API_URL = 'http://10.194.5.185/cbrecaudaciones/valores-pendientes/';
const API_KEY = '9c5bfd0e-acde-4b1c-b3a1-de97e76d08a7';

// Ruta para probar si el servidor está funcionando
app.get('/test', (req, res) => {
    res.json({ status: 'ok', message: 'El servidor proxy está funcionando correctamente' });
});

// Ruta directa que hace la misma petición que en curl pero desde el servidor
app.get('/direct/:cedula', async (req, res) => {
    const cedula = req.params.cedula;
    console.log(`[Proxy] Consultando directamente para cédula: ${cedula}`);

    try {
        // Esta petición simula exactamente el curl que funciona
        const response = await axios({
            method: 'GET',
            url: `${API_URL}${cedula}`,
            headers: {
                'api-key': API_KEY
            }
        });

        console.log(`[Proxy] Respuesta exitosa: ${response.status}`);
        res.json(response.data);
    } catch (error) {
        console.error(`[Proxy] Error en petición directa: ${error.message}`);

        if (error.response) {
            res.status(error.response.status).json({
                error: `Error ${error.response.status}`,
                message: error.response.data,
                details: 'Error desde el servidor API'
            });
        } else {
            res.status(500).json({
                error: 'Error de conexión',
                message: error.message,
                details: 'Error al conectar con el servidor API'
            });
        }
    }
});

// Configuración del proxy modificada para asegurar el envío correcto del header
app.use('/api', createProxyMiddleware({
    target: 'http://10.194.5.185',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/cbrecaudaciones/valores-pendientes'
    },
    onProxyReq: (proxyReq, req, res) => {
        // Eliminar el header existente para evitar duplicados
        proxyReq.removeHeader('api-key');

        // Agregar el header api-key exactamente como en el curl
        proxyReq.setHeader('api-key', API_KEY);

        console.log(`[Proxy] Headers enviados: ${JSON.stringify(proxyReq.getHeaders())}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`[Proxy] Respuesta del proxy: ${proxyRes.statusCode}`);

        // Si hay un error 401, mostrar más detalles
        if (proxyRes.statusCode === 401) {
            console.error('[Proxy] Error 401: Acceso no autorizado - Clave API inválida');
        }
    },
    onError: (err, req, res) => {
        console.error(`[Proxy] Error en proxy: ${err}`);
        res.status(500).json({
            error: 'Error en el proxy',
            message: err.message,
            suggestion: 'Intenta usar la ruta /direct/:cedula como alternativa'
        });
    }
}));

// Mostrar todos los headers en una solicitud de prueba
app.get('/test-headers', (req, res) => {
    res.json({
        headers: req.headers,
        message: 'Estos son los headers que recibo'
    });
});

// Puerto para el servidor
const PORT = process.env.PROXY_PORT || 3001;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`==== SERVIDOR PROXY INICIADO ====`);
    console.log(`Escuchando en http://localhost:${PORT}`);
    console.log(`Atendiendo peticiones para la aplicación React`);
});