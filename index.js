import express from 'express';
import cors from 'cors';
import agoraAccessToken from 'agora-access-token'; // Cambio clave aquí

const { ChatTokenBuilder } = agoraAccessToken; // Destructuración después del import

const app = express();
app.use(cors());

// Configuración
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
const APP_KEY = process.env.APP_KEY;

// Endpoint para tokens
app.get('/get-agora-chat-token', (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const expireTime = Math.floor(Date.now() / 1000) + 3600;
    const token = ChatTokenBuilder.buildUserToken(
      APP_ID,
      APP_CERTIFICATE,
      userId,
      expireTime
    );

    return res.json({
      token: token,
      appKey: APP_KEY,
      expiresAt: expireTime
    });
  } catch (e) {
    console.error('Token generation error:', e);
    return res.status(500).json({ error: "Token generation failed" });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
