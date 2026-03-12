require('dotenv').config(); // 1. Primero cargamos las variables del .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importamos la función para obtener la categoría desde IA
const { getCategoryFromIA } = require('./services/aiService'); 
const Task = require('./models/Task');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a la base de datos de Marisa'))
  .catch(err => console.error('❌ Error de conexión:', err));

// --- RUTAS ---

// 1. Obtener todas las tareas
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Crear una nueva tarea con IA
app.post('/api/tasks', async (req, res) => {
  const { title, dueDate, dueTime } = req.body; // Recibimos los nuevos datos
  try {
    const category = await getCategoryFromIA(title);
    
    const newTask = new Task({ 
      title, 
      category,
      dueDate,
      dueTime
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 3. Editar una tarea por ID (incluyendo re-categorización si el título cambia)
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { title, dueDate, dueTime } = req.body;
    // Buscamos de nuevo la categoría si el título cambió
    const category = await getCategoryFromIA(title); 
    
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, dueDate, dueTime, category },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// 4. Marcar una tarea como completada o no
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    
    const updatedTask = await Task.findByIdAndUpdate(
      id, 
      { completed }, 
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar estado" });
  }
});
// 5 Eliminar una tarea por ID
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Iniciamos el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});