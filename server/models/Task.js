const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, default: 'General' }, 
  completed: { type: Boolean, default: false },
  dueDate: { type: String }, // Guardaremos la fecha como string "YYYY-MM-DD"
  dueTime: { type: String }, // Guardaremos la hora como string "HH:mm"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);