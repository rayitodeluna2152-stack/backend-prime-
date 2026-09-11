// redeploy
const Stripe = require('stripe');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));   // ⭐ NECESARIO

// ------------------ IA GROQ ------------------
const groq = new Groq({
    apiKey: process.env.GROQ_KEY
});

// ------------------ IA GENERAL ------------------
app.post("/api/ia", async (req, res) => {
    try {
        const { mensaje } = req.body;

        const respuesta = await groq.chat.completions.create({
            model: "llama3-8b-8192",   // ⭐ MODELO NUEVO
            messages: [
                { 
                    role: "system", 
                    content: "Eres la IA oficial de Road To Prime. Explicas claro, directo, motivas al usuario y puedes crear resúmenes, esquemas, explicaciones, planificaciones de estudio y pasos detallados." 
                },
                { role: "user", content: mensaje }
            ]
        });

        res.json({ respuesta: respuesta.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en IA" });
    }
});

// ------------------ IA POR MATERIAS ------------------

function crearRutaIA(ruta, prompt) {
    app.post(ruta, async (req, res) => {
        try {
            const { mensaje } = req.body;

            const respuesta = await groq.chat.completions.create({
                model: "llama3-8b-8192",   // ⭐ MODELO NUEVO
                messages: [
                    { role: "system", content: prompt },
                    { role: "user", content: mensaje }
                ]
            });

            res.json({ respuesta: respuesta.choices[0].message.content });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: `Error en ${ruta}` });
        }
    });
}

crearRutaIA("/api/ia/matematicas", "Eres un profesor experto en Matemáticas de Bachillerato. Haces resúmenes, esquemas, explicaciones paso a paso, ejercicios, correcciones y planificaciones de estudio.");
crearRutaIA("/api/ia/historia", "Eres un profesor experto en Historia. Haces resúmenes perfectos, esquemas, cronologías, causas y consecuencias, explicaciones tipo Selectividad.");
crearRutaIA("/api/ia/lengua", "Eres un profesor experto en Lengua y Literatura. Haces resúmenes, esquemas, análisis sintácticos, comentarios de texto, figuras literarias.");
crearRutaIA("/api/ia/fisica", "Eres un profesor experto en Física. Explicas fórmulas, problemas, conceptos, haces resúmenes, esquemas y planificaciones de estudio.");
crearRutaIA("/api/ia/quimica", "Eres un profesor experto en Química. Explicas formulación, reacciones, estequiometría, haces resúmenes y esquemas.");
crearRutaIA("/api/ia/ingles", "Eres un profesor experto en Inglés. Explicas gramática, vocabulario, writing, haces resúmenes y esquemas.");

// ------------------ RUTA DE PAGO ------------------
app.post("/crear-pago", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [
                {
                    price: "price_1U90nFFHtQxvFihYsZf6ExoF",
                    quantity: 1
                }
            ],
            success_url: "https://TU-FRONTEND.vercel.app/success.html",
            cancel_url: "https://TU-FRONTEND.vercel.app/cancel.html"
        });

        res.json({ url: session.url });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error creando pago" });
    }
});

// ------------------ PUERTO PARA RAILWAY ------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Backend funcionando en el puerto " + PORT);
});
