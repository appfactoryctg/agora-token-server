import express from "express";
import cors from "cors";
import { ChatTokenBuilder } from "agora-access-token";

const app = express();
app.use(cors());

// Se leerán desde variables de entorno en Railway (NO pongas tus claves aquí)
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

if (!APP_ID || !APP_CERTIFICATE) {
  console.warn("⚠️ Falta APP_ID o APP_CERTIFICATE (se configurarán en Railway).");
}

// GET /get-agora-token?userId=TU_ID
app.get("/get-agora-token", (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "Falta userId" });

    const expireTimeInSeconds = 3600; // 1 hora
    const now = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = now + expireTimeInSeconds;

    const token = ChatTokenBuilder.buildUserToken(
      APP_ID,
      APP_CERTIFICATE,
      userId,
      privilegeExpiredTs
    );

    return res.json({ token, expiresAt: privilegeExpiredTs });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error generando token" });
  }
});

// Railway asigna PORT por variable de entorno
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
