import express from 'express';
import cors from 'cors';
import agoraAccessToken from 'agora-access-token';
const { ChatTokenBuilder } = agoraAccessToken;

const app = express();
app.use(cors());

// Configuración desde variables de entorno
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
const APP_KEY = process.env.APP_KEY;

// Endpoint
app.get('/get-agora-chat-token', (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "Se requiere 'userId'" });
    }

    const expireTime = Math.floor(Date.now() / 1000) + 3600;
    const token = ChatTokenBuilder.buildUserToken(
      APP_ID,
      APP_CERTIFICATE,
      userId,
      expireTime
    );

    res.json({
      token: token,
      appKey: APP_KEY,
      expiresAt: expireTime
    });

  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({ error: "Error al generar token" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
