import { useEffect, useState } from "react";

function App() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetchLogs = () => {
      fetch("https://logforge.onrender.com/logs/recent")
        .then(res => res.json())
        .then(data => {
          const parsedLogs = data.map(log =>
            typeof log === "string" ? JSON.parse(log) : log
          );
          setLogs(parsedLogs);
        })
        .catch(err => console.error("Fetch error:", err));
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);

    return () => clearInterval(interval);
  }, []);

  // 🔥 Filter logic
  const filteredLogs =
    filter === "ALL" ? logs : logs.filter(log => log.level === filter);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", background: "#f5f5f5" }}>
      <h1>🚀 LogForge Dashboard</h1>

      <p>Total logs: {filteredLogs.length}</p>

      {/* 🔥 FILTER BUTTONS */}
      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => setFilter("ALL")}>All</button>{" "}
        <button onClick={() => setFilter("INFO")}>Info</button>{" "}
        <button onClick={() => setFilter("WARN")}>Warn</button>{" "}
        <button onClick={() => setFilter("ERROR")}>Error</button>
      </div>

      {filteredLogs.length === 0 ? (
        <p>No logs yet...</p>
      ) : (
        filteredLogs.map((log, index) => (
          <div
            key={index}
            style={{
              background: "#fff",
              borderLeft: `5px solid ${
                log.level === "ERROR"
                  ? "red"
                  : log.level === "WARN"
                  ? "orange"
                  : "green"
              }`,
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
          >
            <strong>{log.service}</strong> | <b>{log.level}</b>
            <br />
            {log.message}
            <br />
            <small style={{ color: "gray" }}>
              {new Date().toLocaleTimeString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

export default App;