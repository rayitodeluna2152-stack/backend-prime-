const Stripe = require('stripe');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();

app.use(cors());
app.use(express.json());

// ------------------ IA GROQ ------------------
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// ------------------ FUNCIÓN PARA CREAR PROFESORES ------------------
async function generarRespuesta(systemPrompt, mensaje) {
    const completion = await groq.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: mensaje }
        ]
    });

    return completion.choices[0].message.content;   // ⭐ CORREGIDO
}

// ------------------ IA GENERAL ------------------
app.post("/api/ia", async (req, res) => {
    try {
        const { mensaje } = req.body;

        const texto = await generarRespuesta(
            "Eres la IA oficial de Road To Prime. Explicas claro, directo, motivas al usuario y puedes crear resúmenes, esquemas, explicaciones, planificaciones de estudio y pasos detallados.",
            mensaje
        );

        res.json({ respuesta: texto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en IA" });
    }
});

// ------------------ IA POR MATERIAS ------------------

app.post("/api/ia/matematicas", async (req, res) => {
    try {
        const texto = await generarRespuesta(
            "Eres un profesor experto en Matemáticas de Bachillerato. Explicas paso a paso, haces ejercicios, resúmenes y esquemas.",
            req.body.mensaje
        );
        res.json({ respuesta: texto });
    } catch (e) { res.status(500).json({ error: "Error en IA de matemáticas" }); }
});

app.post("/api/ia/lengua", async (req, res) => {
    try {
        const texto = await generarRespuesta(
            "Eres un profesor experto en Lengua y Literatura. Explicas sintaxis, comentarios de texto, figuras literarias y resúmenes.",
            req.body.mensaje
        );
        res.json({ respuesta: texto });
    } catch (e) { res.status(500).json({ error: "Error en IA de lengua" }); }
});

app.post("/api/ia/geografia", async (req, res) => {
    try {
        const texto = await generarRespuesta(
            "Eres un profesor experto en Geografía. Explicas mapas, clima, relieve, población, economía y haces resúmenes perfectos.",
            req.body.mensaje
        );
        res.json({ respuesta: texto });
    } catch (e) { res.status(500).json({ error: "Error en IA de geografía" }); }
});

app.post("/api/ia/historia", async (req, res) => {
    try {
        const texto = await generarRespuesta(
            "Eres un profesor experto en Historia. Haces cronologías, causas y consecuencias, resúmenes y explicaciones tipo Selectividad.",
            req.body.mensaje
        );
        res.json({ respuesta: texto });
    } catch (e) { res.status(500).json({ error: "Error en IA de historia" }); }
});

app.post("/api/ia/productividad", async (req, res) => {
    try {
        const texto = await generarRespuesta(
            "Eres un coach experto en productividad. Enseñas técnicas de estudio, organización, hábitos, rutinas y motivación.",
            req.body.mensaje
        );
        res.json({ respuesta: texto });
    } catch (e) { res.status(500).json({ error: "Error en IA de productividad" }); }
});

app.post("/api/ia/economia", async (req, res) => {
    try {
        const texto = await generarRespuesta(
            "Eres un profesor experto en Economía. Explicas macroeconomía, microeconomía, mercados, empresas, finanzas y resúmenes.",
            req.body.mensaje
        );
        res.json({ respuesta: texto });
    } catch (e) { res.status(500).json({ error: "Error en IA de economía" }); }
});

app.post("/api/ia/ingles", async (req, res) => {
    try {
        const texto = await generarRespuesta(
            "Eres un profesor experto en Inglés. Explicas gramática, vocabulario, writing y corriges errores.",
            req.body.mensaje
        );
        res.json({ respuesta: texto });
    } catch (e) { res.status(500).json({ error: "Error en IA de inglés" }); }
});

app.post("/api/ia/tecnologia", async (req, res) => {
    try {
        const texto = await generarRespuesta(
            "Eres un profesor experto en Tecnología. Explicas informática, programación, redes, hardware y conceptos técnicos.",
            req.body.mensaje
        );
        res.json({ respuesta: texto });
    } catch (e) { res.status(500).json({ error: "Error en IA de tecnología" }); }
});

app.post("/api/ia/filosofia", async (req, res) => {
    try {
        const texto = await generarRespuesta(
            "Eres un profesor experto en Filosofía. Explicas autores, teorías, corrientes, resúmenes y comparaciones.",
            req.body.mensaje
        );
        res.json({ respuesta: texto });
    } catch (e) { res.status(500).json({ error: "Error en IA de filosofía" }); }
});

app.post("/api/ia/quimica", async (req, res) => {
    try {
        const texto = await generarRespuesta(
            "Eres un profesor experto en Química. Explicas formulación, reacciones, estequiometría y resúmenes claros.",
            req.body.mensaje
        );
        res.json({ respuesta: texto });
    } catch (e) { res.status(500).json({ error: "Error en IA de química" }); }
});

app.post("/api/ia/fisica", async (req, res) => {
    try {
        const texto = await generarRespuesta(
            "Eres un profesor experto en Física. Explicas problemas, fórmulas, conceptos y haces esquemas.",
            req.body.mensaje
        );
        res.json({ respuesta: texto });
    } catch (e) { res.status(500).json({ error: "Error en IA de física" }); }
});

app.post("/api/ia/biologia", async (req, res) => {
    try {
        const texto = await generarRespuesta(
            "Eres un profesor experto en Biología. Explicas genética, células, anatomía, evolución y haces resúmenes.",
            req.body.mensaje
        );
        res.json({ respuesta: texto });
    } catch (e) { res.status(500).json({ error: "Error en IA de biología" }); }
});

// ------------------ PUERTO PARA RAILWAY ------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Backend funcionando en el puerto " + PORT);
});
