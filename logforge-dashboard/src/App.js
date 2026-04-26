import { useEffect, useState } from "react";

function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = () => {
      fetch("https://logforge.onrender.com/logs/recent")
        .then(res => res.json())
        .then(data => {
          console.log("Fetched logs:", data);
          setLogs(data);
        })
        .catch(err => console.error("Fetch error:", err));
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", background: "#f5f5f5" }}>
      <h1>🚀 LogForge Dashboard</h1>

      <p>Total logs: {logs.length}</p>

      {logs.length === 0 ? (
        <p>No logs yet...</p>
      ) : (
        logs.map((log, index) => {
          // 🔥 FIX: parse if string
          const parsed = typeof log === "string" ? JSON.parse(log) : log;

          return (
            <div
              key={index}
              style={{
                background: "#fff",
                borderLeft: `5px solid ${
                  parsed.level === "ERROR"
                    ? "red"
                    : parsed.level === "WARN"
                    ? "orange"
                    : "green"
                }`,
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
              }}
            >
              <strong>{parsed.service}</strong> | <b>{parsed.level}</b>
              <br />
              {parsed.message}
            </div>
          );
        })
      )}
    </div>
  );
}

export default App;