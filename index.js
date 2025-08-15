import express from 'express';
import cors from 'cors';
import { ChatTokenBuilder } from 'agora-access-token';

const app = express();
app.use(cors());

// Configuración desde variables de entorno
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
const APP_KEY = process.env.APP_KEY;

// Endpoint que genera automáticamente usuario + token
app.get('/generate-agora-token', (req, res) => {
  try {
    // 1. Generar userId aleatorio (ej: "user_a1b2c3")
    const userId = `user_${Math.random().toString(36).substring(2, 8)}`;
    
    // 2. Configurar expiración (1 hora)
    const expireTime = Math.floor(Date.now() / 1000) + 3600;

    // 3. Generar token
    const token = ChatTokenBuilder.buildUserToken(
      APP_ID,
      APP_CERTIFICATE,
      userId,
      expireTime
    );

    // 4. Enviar respuesta
    res.json({
      success: true,
      userId: userId,
      token: token,
      appKey: APP_KEY,
      expiresAt: expireTime
    });

  } catch (e) {
    console.error('Error generating token:', e);
    res.status(500).json({ 
      success: false,
      error: "Internal server error" 
    });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
