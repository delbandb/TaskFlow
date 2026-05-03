import { useEffect, useState } from "react";
import type { Task, CreateTaskDTO } from "../types/Task";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  changeTaskStatus,
} from "../api/taskApi";

const COLUMN_CONFIG = {
  PENDIENTE: { label: "Pendiente", color: "#6366f1", bg: "#1e1b4b" },
  EN_PROGRESO: { label: "En Progreso", color: "#f59e0b", bg: "#1c1a0e" },
  COMPLETADO: { label: "Completado", color: "#10b981", bg: "#052e16" },
};

const PRIORIDAD_CONFIG = {
  ALTA: { color: "#f87171", bg: "#2d1515", label: "Alta" },
  MEDIA: { color: "#fbbf24", bg: "#2d2515", label: "Media" },
  BAJA: { color: "#34d399", bg: "#152d1e", label: "Baja" },
};

const EMPTY_FORM: CreateTaskDTO = {
  titulo: "",
  descripcion: "",
  estado: "PENDIENTE",
  prioridad: "MEDIA",
};

interface DashboardProps {
  onLogout: () => void;
  username: string;
}

function Dashboard({ onLogout, username }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState<CreateTaskDTO>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroPrioridad, setFiltroPrioridad] = useState<
    "TODAS" | Task["prioridad"]
  >("TODAS");

  useEffect(() => {
    getTasks()
      .then((data) => {
        setTasks(data);
        setError("");
      })
      .catch(() => {
        setError("No se pudieron cargar tus tareas. Revisa tu conexión o vuelve a iniciar sesión.");
      })
      .finally(() => setLoading(false));
  }, []);

  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async () => {
    if (!form.titulo.trim() || saving) return;

    setSaving(true);
    setError("");

    try {
      if (editingTask) {
        const actualizada = await updateTask(editingTask.id, form);
        setTasks((prev) =>
          prev.map((task) => (task.id === editingTask.id ? actualizada : task)),
        );
      } else {
        const nueva = await createTask(form);
        setTasks((prev) => [...prev, nueva]);
      }
      closeForm();
    } catch {
      setError(editingTask ? "No se pudo actualizar la tarea." : "No se pudo crear la tarea.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setForm({
      titulo: task.titulo,
      descripcion: task.descripcion,
      estado: task.estado,
      prioridad: task.prioridad,
      venceEn: task.venceEn,
    });
    setShowForm(true);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    setError("");
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch {
      setError("No se pudo borrar la tarea.");
    }
  };

  const handleStatusChange = async (id: number, estado: Task["estado"]) => {
    setError("");
    try {
      const actualizada = await changeTaskStatus(id, estado);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? actualizada : task)),
      );
    } catch {
      setError("No se pudo cambiar el estado de la tarea.");
    }
  };

  const tareasFiltradas = tasks.filter((task) => {
    const coincideBusqueda = task.titulo
      .toLowerCase()
      .includes(filtroBusqueda.toLowerCase());
    const coincidePrioridad =
      filtroPrioridad === "TODAS" || task.prioridad === filtroPrioridad;
    return coincideBusqueda && coincidePrioridad;
  });

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "#6366f1",
          fontSize: "1.2rem",
        }}
      >
        Cargando tareas...
      </div>
    );

  const completadoStyle = `
    @keyframes completadoBrillo {
      0% { box-shadow: 0 0 0 #10b981; border-color: #10b981; }
      50% { box-shadow: 0 0 18px #10b981; border-color: #10b981; }
      100% { box-shadow: 0 0 6px #10b981; border-color: #10b981; }
    }
  `;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{completadoStyle}</style>

      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          background: "#0a0a18",
          borderBottom: "1px solid #1e1e3a",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
            }}
          >
            ✓
          </div>
          <span
            style={{
              fontSize: "1.3rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #6366f1, #a855f7, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            TaskFlow
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.85rem",
                fontWeight: "700",
                color: "white",
              }}
            >
              {username.charAt(0).toUpperCase()}
            </div>
            <span style={{ color: "#c7d2fe", fontSize: "0.9rem", fontWeight: "500" }}>
              {username}
            </span>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: "none",
              color: "#64748b",
              border: "1px solid #2d2d5a",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div
        style={{
          flex: 1,
          padding: "2rem",
          maxWidth: "1300px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
            gap: "1rem",
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: "600", color: "#c7d2fe" }}>
              Mis Tareas
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.2rem" }}>
              {tasks.length} tarea{tasks.length !== 1 ? "s" : ""} en total
            </p>
          </div>
          <button
            onClick={() => {
              if (showForm) {
                closeForm();
              } else {
                setShowForm(true);
                setError("");
              }
            }}
            style={{
              background: showForm ? "#1e1e3a" : "linear-gradient(135deg, #6366f1, #a855f7)",
              color: "white",
              border: "none",
              padding: "0.65rem 1.4rem",
              borderRadius: "10px",
              fontSize: "0.95rem",
              fontWeight: "600",
              boxShadow: showForm ? "none" : "0 4px 15px rgba(99,102,241,0.4)",
              cursor: "pointer",
            }}
          >
            {showForm ? "Cancelar" : "+ Nueva tarea"}
          </button>
        </div>

        {error && (
          <div
            role="alert"
            style={{
              background: "#2d1515",
              border: "1px solid #7f1d1d",
              color: "#fecaca",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: "0.8rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <input
            placeholder="Buscar tarea..."
            value={filtroBusqueda}
            onChange={(event) => setFiltroBusqueda(event.target.value)}
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "0.6rem 1rem",
              background: "#13132a",
              border: "1px solid #2d2d5a",
              borderRadius: "8px",
              color: "#e2e8f0",
              fontSize: "0.9rem",
              outline: "none",
            }}
          />
          {(["TODAS", "ALTA", "MEDIA", "BAJA"] as const).map((prioridad) => (
            <button
              key={prioridad}
              onClick={() => setFiltroPrioridad(prioridad)}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                background:
                  filtroPrioridad === prioridad
                    ? prioridad === "ALTA"
                      ? "#f87171"
                      : prioridad === "MEDIA"
                        ? "#fbbf24"
                        : prioridad === "BAJA"
                          ? "#34d399"
                          : "#6366f1"
                    : "#13132a",
                color: filtroPrioridad === prioridad ? "#0d0d1a" : "#64748b",
              }}
            >
              {prioridad === "TODAS" ? "Todas" : PRIORIDAD_CONFIG[prioridad].label}
            </button>
          ))}
        </div>

        {showForm && (
          <div
            style={{
              background: "#13132a",
              border: "1px solid #2d2d5a",
              borderRadius: "16px",
              padding: "1.5rem",
              marginBottom: "2rem",
              boxShadow: "0 8px 32px rgba(99,102,241,0.15)",
            }}
          >
            <h2 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1rem", color: "#a5b4fc" }}>
              {editingTask ? "Editar tarea" : "Nueva tarea"}
            </h2>
            <input
              placeholder="Título *"
              value={form.titulo}
              onChange={(event) => setForm({ ...form, titulo: event.target.value })}
              style={{
                width: "100%",
                padding: "0.7rem 1rem",
                marginBottom: "0.8rem",
                background: "#0d0d1a",
                border: "1px solid #2d2d5a",
                borderRadius: "8px",
                color: "#e2e8f0",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <textarea
              placeholder="Descripción (opcional)"
              value={form.descripcion}
              onChange={(event) => setForm({ ...form, descripcion: event.target.value })}
              style={{
                width: "100%",
                padding: "0.7rem 1rem",
                marginBottom: "0.8rem",
                background: "#0d0d1a",
                border: "1px solid #2d2d5a",
                borderRadius: "8px",
                color: "#e2e8f0",
                fontSize: "0.95rem",
                outline: "none",
                minHeight: "80px",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
              <input
                type="date"
                value={form.venceEn ? form.venceEn.split("T")[0] : ""}
                onChange={(event) =>
                  setForm({ ...form, venceEn: event.target.value || undefined })
                }
                style={{
                  padding: "0.7rem 1rem",
                  background: "#0d0d1a",
                  border: "1px solid #2d2d5a",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                  fontSize: "0.95rem",
                  outline: "none",
                  colorScheme: "dark",
                }}
              />
              <select
                value={form.prioridad}
                onChange={(event) =>
                  setForm({
                    ...form,
                    prioridad: event.target.value as Task["prioridad"],
                  })
                }
                style={{
                  padding: "0.65rem 1rem",
                  background: "#0d0d1a",
                  border: "1px solid #2d2d5a",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                  fontSize: "0.9rem",
                }}
              >
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
              </select>
              <button
                onClick={handleSubmit}
                disabled={saving}
                style={{
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  color: "white",
                  border: "none",
                  padding: "0.65rem 1.5rem",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
                  opacity: saving ? 0.65 : 1,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "Guardando..." : editingTask ? "Guardar cambios" : "Crear tarea"}
              </button>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "1.2rem" }}>
          {(Object.keys(COLUMN_CONFIG) as Task["estado"][]).map((estado) => {
            const col = COLUMN_CONFIG[estado];
            const tareas = tareasFiltradas.filter((task) => task.estado === estado);

            return (
              <div
                key={estado}
                style={{
                  flex: 1,
                  background: "#0f0f20",
                  borderRadius: "16px",
                  padding: "1rem",
                  border: `1px solid ${col.color}33`,
                  minHeight: "450px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                    padding: "0.5rem 0.75rem",
                    background: col.bg,
                    borderRadius: "8px",
                    borderLeft: `3px solid ${col.color}`,
                  }}
                >
                  <span style={{ fontWeight: "600", fontSize: "0.9rem", color: col.color }}>
                    {col.label}
                  </span>
                  <span
                    style={{
                      background: col.color + "22",
                      color: col.color,
                      borderRadius: "999px",
                      padding: "0.1rem 0.6rem",
                      fontSize: "0.8rem",
                      fontWeight: "700",
                    }}
                  >
                    {tareas.length}
                  </span>
                </div>

                {tareas.map((task) => {
                  const prio = PRIORIDAD_CONFIG[task.prioridad];
                  const vence = task.venceEn ? new Date(task.venceEn) : null;
                  const diasRestantes = vence
                    ? Math.ceil((vence.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    : null;

                  return (
                    <div
                      key={task.id}
                      style={{
                        background: "#13132a",
                        borderRadius: "10px",
                        padding: "0.85rem",
                        marginBottom: "0.6rem",
                        border: "1px solid #1e1e3a",
                        borderLeft: `3px solid ${prio.color}`,
                        animation: task.estado === "COMPLETADO" ? "completadoBrillo 1.5s ease-in-out" : "none",
                        position: "relative",
                      }}
                    >
                      {task.estado === "COMPLETADO" && (
                        <span
                          style={{
                            position: "absolute",
                            top: "0.5rem",
                            right: "0.5rem",
                            color: "#10b981",
                            fontSize: "1rem",
                            fontWeight: "700",
                          }}
                        >
                          ✓
                        </span>
                      )}
                      <h3 style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.3rem", color: "#e2e8f0" }}>
                        {task.titulo}
                      </h3>
                      {task.descripcion && (
                        <p style={{ fontSize: "0.78rem", color: "#64748b", marginBottom: "0.6rem", lineHeight: "1.4" }}>
                          {task.descripcion}
                        </p>
                      )}
                      {vence && diasRestantes !== null && (
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: diasRestantes <= 0 ? "#f87171" : diasRestantes <= 3 ? "#fbbf24" : "#64748b",
                            marginBottom: "0.5rem",
                            fontWeight: diasRestantes <= 3 ? "600" : "400",
                          }}
                        >
                          {diasRestantes <= 0
                            ? "Vencida"
                            : diasRestantes === 1
                              ? "Vence mañana"
                              : vence.toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                        </p>
                      )}
                      <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: "600",
                            background: prio.bg,
                            color: prio.color,
                            padding: "0.2rem 0.6rem",
                            borderRadius: "999px",
                          }}
                        >
                          {prio.label}
                        </span>
                        <select
                          value={task.estado}
                          onChange={(event) =>
                            handleStatusChange(task.id, event.target.value as Task["estado"])
                          }
                          style={{
                            fontSize: "0.72rem",
                            padding: "0.2rem 0.4rem",
                            background: "#0d0d1a",
                            border: "1px solid #2d2d5a",
                            borderRadius: "6px",
                            color: "#94a3b8",
                            cursor: "pointer",
                          }}
                        >
                          <option value="PENDIENTE">Pendiente</option>
                          <option value="EN_PROGRESO">En Progreso</option>
                          <option value="COMPLETADO">Completado</option>
                        </select>
                        <button
                          onClick={() => handleEdit(task)}
                          style={{
                            fontSize: "0.7rem",
                            background: "none",
                            border: "1px solid #2d3d5a",
                            color: "#6366f1",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          style={{
                            fontSize: "0.7rem",
                            background: "none",
                            border: "1px solid #3d1515",
                            color: "#f87171",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          Borrar
                        </button>
                      </div>
                    </div>
                  );
                })}

                {tareas.length === 0 && (
                  <p style={{ color: "#2d2d5a", fontSize: "0.82rem", textAlign: "center", marginTop: "3rem" }}>
                    Sin tareas aquí
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <footer style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: "500", color: "#64748b" }}>
          Keep hustling
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;
