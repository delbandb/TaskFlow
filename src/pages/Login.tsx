import { useState } from "react";

interface Props {
  onLogin: (token: string) => void;
}

function Login({ onLogin }: Props) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim() || loading) {
      setError("Usuario y contraseña son obligatorios.");
      return;
    }

    setLoading(true);
    setError("");

    const endpoint = isRegister
      ? "http://localhost:8080/api/auth/register"
      : "http://localhost:8080/api/auth/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError(
          isRegister ? "Ese usuario ya existe." : "Usuario o contraseña incorrectos.",
        );
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      onLogin(data.token);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0d0d1a",
        padding: "1rem",
      }}
    >
      <span
        style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          background: "linear-gradient(135deg, #6366f1, #a855f7, #06b6d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "2rem",
        }}
      >
        TaskFlow
      </span>

      <div
        style={{
          background: "#13132a",
          border: "1px solid #2d2d5a",
          borderRadius: "16px",
          padding: "2rem",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 8px 32px rgba(99,102,241,0.15)",
        }}
      >
        <h2
          style={{
            color: "#a5b4fc",
            fontWeight: "600",
            marginBottom: "1.5rem",
            fontSize: "1.2rem",
          }}
        >
          {isRegister ? "Crear cuenta" : "Iniciar sesión"}
        </h2>

        <input
          placeholder="Usuario"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
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
        <input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
          style={{
            width: "100%",
            padding: "0.7rem 1rem",
            marginBottom: "1rem",
            background: "#0d0d1a",
            border: "1px solid #2d2d5a",
            borderRadius: "8px",
            color: "#e2e8f0",
            fontSize: "0.95rem",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        {error && (
          <p
            role="alert"
            style={{
              color: "#f87171",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Cargando..." : isRegister ? "Registrarse" : "Entrar"}
        </button>

        <p
          style={{
            color: "#64748b",
            fontSize: "0.85rem",
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <span
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            style={{ color: "#6366f1", cursor: "pointer", fontWeight: "600" }}
          >
            {isRegister ? "Inicia sesión" : "Regístrate"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
