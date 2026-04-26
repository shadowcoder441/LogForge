import { useEffect, useState } from "react";

function App() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("ALL");

  // Fetch logs
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

  // 🔥 OPTIONAL: auto-generate logs (for demo)
  useEffect(() => {
    const autoLogs = setInterval(() => {
      fetch("https://logforge.onrender.com/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          service: "system",
          message: "Auto heartbeat",
          level: "INFO"
        })
      });
    }, 10000);

    return () => clearInterval(autoLogs);
  }, []);

  // Filter logs
  const filteredLogs =
    filter === "ALL" ? logs : logs.filter(log => log.level === filter);

  const getColor = (level) => {
    if (level === "ERROR") return "#ff4d4f";
    if (level === "WARN") return "#faad14";
    return "#52c41a";
  };

  // 🔥 Manual log generator (BEST for interview demo)
  const generateLog = () => {
    const sampleLogs = [
      { service: "auth", message: "User login success", level: "INFO" },
      { service: "payment", message: "Transaction failed", level: "ERROR" },
      { service: "order", message: "Order placed", level: "INFO" },
      { service: "auth", message: "Suspicious activity", level: "WARN" }
    ];

    const random = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];

    fetch("https://logforge.onrender.com/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(random)
    });
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Segoe UI",
        background: "#eef2f7",
        minHeight: "100vh"
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>🚀 LogForge Dashboard</h1>

      {/* 🔥 Generate log button */}
      <button
        onClick={generateLog}
        style={{
          marginBottom: "20px",
          padding: "10px 15px",
          background: "#1890ff",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Generate Log
      </button>

      {/* Filters */}
      <div style={{ marginBottom: "20px" }}>
        {["ALL", "INFO", "WARN", "ERROR"].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              marginRight: "10px",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              background: filter === type ? "#1890ff" : "#d9d9d9",
              color: filter === type ? "#fff" : "#000"
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <p style={{ marginBottom: "15px" }}>
        Showing <b>{filteredLogs.length}</b> logs
      </p>

      {filteredLogs.length === 0 ? (
        <p>No logs yet...</p>
      ) : (
        filteredLogs.map((log, index) => (
          <div
            key={index}
            style={{
              background: "#fff",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{log.service}</strong>
              <span
                style={{
                  background: getColor(log.level),
                  color: "#fff",
                  padding: "3px 8px",
                  borderRadius: "5px",
                  fontSize: "12px"
                }}
              >
                {log.level}
              </span>
            </div>

            <p style={{ marginTop: "8px" }}>{log.message}</p>

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