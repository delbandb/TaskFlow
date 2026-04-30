import { useEffect, useState } from "react";
import type { Task, CreateTaskDTO } from "../types/Task";
import {
  getTasks,
  createTask,
  deleteTask,
  changeTaskStatus,
} from "../api/taskApi";

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateTaskDTO>({
    titulo: "",
    descripcion: "",
    estado: "PENDIENTE",
    prioridad: "MEDIA",
  });

  useEffect(() => {
    getTasks()
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!form.titulo.trim()) return;
    const nueva = await createTask(form);
    setTasks((prev) => [...prev, nueva]);
    setForm({
      titulo: "",
      descripcion: "",
      estado: "PENDIENTE",
      prioridad: "MEDIA",
    });
    setShowForm(false);
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleStatusChange = async (id: number, estado: Task["estado"]) => {
    const actualizada = await changeTaskStatus(id, estado);
    setTasks((prev) => prev.map((t) => (t.id === id ? actualizada : t)));
  };

  if (loading) return <p style={{ padding: "2rem" }}>Cargando tareas...</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.8rem" }}>TaskFlow</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: "#4f46e5",
            color: "white",
            border: "none",
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          {showForm ? "Cancelar" : "+ Nueva tarea"}
        </button>
      </div>

      {showForm && (
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            marginBottom: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Nueva tarea</h2>
          <input
            placeholder="Título *"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            style={{
              width: "100%",
              padding: "0.6rem",
              marginBottom: "0.8rem",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "1rem",
              boxSizing: "border-box",
            }}
          />
          <textarea
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            style={{
              width: "100%",
              padding: "0.6rem",
              marginBottom: "0.8rem",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "1rem",
              boxSizing: "border-box",
              minHeight: "80px",
            }}
          />
          <select
            value={form.prioridad}
            onChange={(e) =>
              setForm({
                ...form,
                prioridad: e.target.value as Task["prioridad"],
              })
            }
            style={{
              padding: "0.6rem",
              marginBottom: "0.8rem",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "1rem",
              marginRight: "1rem",
            }}
          >
            <option value="BAJA">🟢 Baja</option>
            <option value="MEDIA">🟡 Media</option>
            <option value="ALTA">🔴 Alta</option>
          </select>
          <button
            onClick={handleCreate}
            style={{
              background: "#4f46e5",
              color: "white",
              border: "none",
              padding: "0.6rem 1.5rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Crear tarea
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: "1rem" }}>
        {(["PENDIENTE", "EN_PROGRESO", "COMPLETADO"] as Task["estado"][]).map(
          (estado) => (
            <div
              key={estado}
              style={{
                flex: 1,
                background: "white",
                borderRadius: "12px",
                padding: "1rem",
                minHeight: "400px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <h2 style={{ marginBottom: "1rem", fontSize: "1rem" }}>
                {estado === "PENDIENTE" && "📋 Pendiente"}
                {estado === "EN_PROGRESO" && "⚡ En Progreso"}
                {estado === "COMPLETADO" && "✅ Completado"}
                <span
                  style={{
                    marginLeft: "0.5rem",
                    color: "#999",
                    fontSize: "0.85rem",
                  }}
                >
                  ({tasks.filter((t) => t.estado === estado).length})
                </span>
              </h2>

              {tasks
                .filter((t) => t.estado === estado)
                .map((task) => (
                  <div
                    key={task.id}
                    style={{
                      background: "#f8f9fa",
                      borderRadius: "8px",
                      padding: "0.75rem",
                      marginBottom: "0.5rem",
                      borderLeft: `4px solid ${task.prioridad === "ALTA" ? "#e74c3c" : task.prioridad === "MEDIA" ? "#f39c12" : "#2ecc71"}`,
                    }}
                  >
                    <h3
                      style={{ fontSize: "0.95rem", marginBottom: "0.25rem" }}
                    >
                      {task.titulo}
                    </h3>
                    {task.descripcion && (
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "#666",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {task.descripcion}
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.7rem",
                          background:
                            task.prioridad === "ALTA"
                              ? "#fde8e8"
                              : task.prioridad === "MEDIA"
                                ? "#fef3e2"
                                : "#e8f8f0",
                          color:
                            task.prioridad === "ALTA"
                              ? "#e74c3c"
                              : task.prioridad === "MEDIA"
                                ? "#f39c12"
                                : "#2ecc71",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                        }}
                      >
                        {task.prioridad}
                      </span>
                      <select
                        value={task.estado}
                        onChange={(e) =>
                          handleStatusChange(
                            task.id,
                            e.target.value as Task["estado"],
                          )
                        }
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.2rem",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="EN_PROGRESO">En Progreso</option>
                        <option value="COMPLETADO">Completado</option>
                      </select>
                      <button
                        onClick={() => handleDelete(task.id)}
                        style={{
                          fontSize: "0.75rem",
                          background: "none",
                          border: "1px solid #fca5a5",
                          color: "#e74c3c",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Borrar
                      </button>
                    </div>
                  </div>
                ))}

              {tasks.filter((t) => t.estado === estado).length === 0 && (
                <p
                  style={{
                    color: "#bbb",
                    fontSize: "0.85rem",
                    textAlign: "center",
                    marginTop: "2rem",
                  }}
                >
                  No hay tareas aquí
                </p>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default Dashboard;
