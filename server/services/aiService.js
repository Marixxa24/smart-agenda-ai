const { GoogleGenerativeAI } = require("@google/generative-ai");

// Cargamos la API Key desde el .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getCategoryFromIA = async (taskTitle) => {
  try {
    // Usamos 'gemini-1.5-flash-latest' o 'gemini-1.0-pro'
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    
    const prompt = `Analiza esta tarea: "${taskTitle}". 
    Responde solo con una palabra que sea su categoría (ejemplo: Estudio, Compras, Trabajo, Hogar, Salud). 
    Si no sabes, responde General.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Limpiamos la respuesta de puntos o espacios extras
    return text.replace(/[^\w]/gi, ''); 
  } catch (error) {
    console.error("Error detallado de Gemini:", error);
    return "General";
  }
};

module.exports = { getCategoryFromIA };