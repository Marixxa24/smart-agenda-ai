import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    const taskData = { title, dueDate, dueTime };
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/tasks/${editingId}`,
          taskData,
        );
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/tasks", taskData);
      }
      setTitle("");
      setDueDate("");
      setDueTime("");
      fetchTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setDueDate(task.dueDate || "");
    setDueTime(task.dueTime || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    setConfirmId(null);
    fetchTasks();
  };

  const toggleComplete = async (id, status) => {
    try {
      const newStatus = !status;
      await axios.patch(`http://localhost:5000/api/tasks/${id}`, {
        completed: newStatus,
      });
      if (newStatus) {
        setTimeout(() => setConfirmId(id), 300);
      } else {
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 text-slate-700 p-4 md:p-10 font-sans selection:bg-pink-200/50">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400 pb-2">
            Smart Agenda AI
          </h1>
          <p className="text-pink-200 font-medium mt-2 flex items-center gap-2">
            🩷 Marisa Chaile
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* FORMULARIO */}
          <aside className="md:col-span-4 lg:col-span-3">
            <div className="sticky top-10 bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-pink-100 shadow-xl shadow-pink-100/50">
              <h2 className="text-xl font-bold mb-6 text-slate-600 flex items-center gap-3">
                <span className="p-2 bg-pink-100 rounded-lg text-pink-400 text-sm">
                  ✍️
                </span>
                {editingId ? "Editar Nota" : "Nueva Nota"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-pink-300 font-bold ml-1">
                    Descripción
                  </label>
                  <textarea
                    className="w-full p-4 rounded-2xl bg-pink-50/60 border border-pink-100 focus:ring-2 focus:ring-pink-300 outline-none transition-all text-slate-600 placeholder:text-pink-200 resize-none"
                    rows="3"
                    placeholder="Ej: Repasar diagramas de flujo para el parcial..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-pink-300 font-bold ml-1">
                      Fecha límite
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 rounded-xl bg-pink-50/60 border border-pink-100 text-slate-500 outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-pink-300 font-bold ml-1">
                      Hora
                    </label>
                    <input
                      type="time"
                      className="w-full p-3 rounded-xl bg-pink-50/60 border border-pink-100 text-slate-500 outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                      value={dueTime}
                      onChange={(e) => setDueTime(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  className={`w-full py-4 rounded-2xl font-bold transition-all transform active:scale-95 text-white shadow-lg ${
                    editingId
                      ? "bg-linear-to-r from-purple-400 to-pink-400 shadow-purple-200"
                      : "bg-linear-to-r from-pink-400 to-rose-400 shadow-pink-200"
                  }`}
                >
                  {loading
                    ? "Procesando..."
                    : editingId
                      ? "Guardar Cambios"
                      : "Crear Tarea"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setTitle("");
                      setDueDate("");
                      setDueTime("");
                    }}
                    className="w-full py-2 text-pink-300 text-sm hover:text-pink-500 transition-colors"
                  >
                    Cancelar edición
                  </button>
                )}
              </form>
            </div>
          </aside>

          {/* TAREAS */}
          <main className="md:col-span-8 lg:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              {tasks.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white/50 rounded-[2.5rem] border-2 border-dashed border-pink-100">
                  <p className="text-pink-300 font-medium">
                    No hay notas todavía. ¡Creá una a la izquierda! 🌸
                  </p>
                </div>
              )}

              {tasks
                .sort((a, b) => a.completed - b.completed)
                .map((task) => (
                  <div
                    key={task._id}
                    className={`group relative p-6 rounded-4xl border transition-all duration-500 flex flex-col justify-between ${
                      task.completed
                        ? "bg-white/40 border-pink-50 opacity-50 scale-[0.98]"
                        : "bg-white/70 backdrop-blur-sm border-pink-100 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-100/60"
                    }`}
                  >
                    {/* Mini-modal inline al completar */}
                    {confirmId === task._id && (
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-4xl flex flex-col items-center justify-center gap-4 z-10 p-6">
                        <span className="text-3xl">👏</span>
                        <p className="text-slate-500 font-semibold text-center text-sm leading-snug">
                          ¡Logrado! ¿Querés quitar esta nota de la agenda?
                        </p>
                        <div className="flex gap-3 w-full">
                          <button
                            onClick={() => deleteTask(task._id)}
                            className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-pink-400 to-rose-400 text-white text-sm font-bold shadow-md shadow-pink-100 active:scale-95 transition-all"
                          >
                            Sí, quitar
                          </button>
                          <button
                            onClick={() => {
                              setConfirmId(null);
                              fetchTasks();
                            }}
                            className="flex-1 py-2.5 rounded-xl bg-pink-50 border border-pink-100 text-pink-400 text-sm font-bold active:scale-95 transition-all"
                          >
                            Dejar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Top */}
                    <div className="flex justify-between items-start mb-6">
                      <span
                        className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-tighter border ${
                          task.completed
                            ? "bg-slate-50 text-slate-300 border-slate-100"
                            : "bg-pink-50 text-pink-400 border-pink-100"
                        }`}
                      >
                        ✨ {task.category}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(task)}
                          className="p-2 hover:bg-pink-50 rounded-lg transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Título */}
                    <h3
                      className={`text-xl font-bold leading-tight mb-4 ${task.completed ? "line-through text-slate-300" : "text-slate-600"}`}
                    >
                      {task.title}
                    </h3>

                    {/* Footer */}
                    <div className="mt-auto pt-6 border-t border-pink-50 flex justify-between items-end">
                      <div className="flex flex-col gap-1">
                        {task.dueDate && (
                          <span className="text-[10px] text-pink-300 flex items-center gap-1 font-bold">
                            📅 {task.dueDate}
                          </span>
                        )}
                        {task.dueTime && (
                          <span className="text-[10px] text-pink-300 flex items-center gap-1 font-bold">
                            ⏰ {task.dueTime}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => toggleComplete(task._id, task.completed)}
                        className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${
                          task.completed
                            ? "bg-linear-to-br from-pink-400 to-rose-400 border-transparent shadow-md shadow-pink-200"
                            : "border-pink-200 hover:border-pink-400"
                        }`}
                      >
                        {task.completed && (
                          <span className="text-white font-bold text-sm">
                            ✓
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
