// Importaciones (CommonJS)
const express = require('express');
const cors = require('cors');
const { ChatTokenBuilder } = require('agora-access-token');

// Configuración inicial
const app = express();
app.use(cors());

// Variables de entorno (configurar en Render)
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
const APP_KEY = process.env.APP_KEY;

// Endpoint principal: GET /get-agora-token?userId=...
app.get('/get-agora-token', (req, res) => {
  try {
    const userId = req.query.userId;
    
    // Validación
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        error: "El parámetro 'userId' es requerido" 
      });
    }

    // Generar token (expira en 1 hora)
    const expireTime = Math.floor(Date.now() / 1000) + 3600;
    const token = ChatTokenBuilder.buildUserToken(
      APP_ID,
      APP_CERTIFICATE,
      userId,
      expireTime
    );

    // Respuesta
    res.json({
      success: true,
      userId: userId,  // Devuelve el mismo userId recibido
      token: token,
      appKey: APP_KEY,
      expiresAt: expireTime
    });

  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({ 
      success: false,
      error: "Error al generar el token" 
    });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});
