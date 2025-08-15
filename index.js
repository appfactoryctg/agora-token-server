import express from "express";
import cors from "cors";
import { ChatTokenBuilder } from "agora-access-token";

const app = express();
app.use(cors());

// Variables REQUERIDAS (configúralas en Render)
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
const APP_KEY = process.env.APP_KEY; // Nueva variable para Chat SDK

// Endpoint ESPECÍFICO para Chat SDK
app.get("/get-agora-chat-token", (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "Se requiere userId" });

    const token = ChatTokenBuilder.buildUserToken(
      APP_ID,
      APP_CERTIFICATE,
      userId,
      Math.floor(Date.now() / 1000) + 3600 // 1 hora de expiración
    );

    return res.json({ 
      token: token,
      appKey: APP_KEY // Necesario para inicializar el SDK en FlutterFlow
    });
  } catch (e) {
    console.error("Error generando token:", e);
    return res.status(500).json({ error: "Error al generar token" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor listo en puerto ${PORT}`);
});
