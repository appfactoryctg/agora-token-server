const express = require('express');
const cors = require('cors');
const { ChatTokenBuilder } = require('agora-access-token');

const app = express();
app.use(cors());

// Configuración (obligatorio)
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
const APP_KEY = process.env.APP_KEY;

// Endpoint de prueba
app.get('/test', (req, res) => {
  res.json({ status: 'API funcionando', APP_ID, APP_KEY });
});

// Endpoint para tokens
app.get('/get-token', (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) throw new Error("Se requiere 'userId'");

    const token = ChatTokenBuilder.buildUserToken(
      APP_ID,
      APP_CERTIFICATE,
      userId,
      Math.floor(Date.now() / 1000) + 3600 // Expira en 1 hora
    );

    res.json({ token, appKey: APP_KEY });
  } catch (e) {
    console.error('Error en /get-token:', e);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor activo en puerto ${PORT}`);
  console.log(`APP_ID: ${APP_ID?.substring(0, 3)}...`); // Log parcial por seguridad
});
