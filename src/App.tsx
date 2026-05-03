import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function parseUsername(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || "Usuario";
  } catch {
    return "Usuario";
  }
}

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const username = token ? parseUsername(token) : "";

  const handleLogin = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} username={username} />;
}

export default App;
