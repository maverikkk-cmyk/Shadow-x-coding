import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(localStorage.getItem("token"));

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");

  const [sub, setSub] = useState(null);

  /* ---------------- LOGIN ---------------- */
  const login = async () => {
    const res = await axios.post(API + "/login", {
      username,
      password,
    });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    }
  };

  /* ---------------- LOAD SUBSCRIPTION ---------------- */
  const loadSub = async () => {
    const res = await axios.get(API + "/me/subscription", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setSub(res.data);
  };

  /* ---------------- AI CALL ---------------- */
  const askAI = async () => {
    const res = await axios.post(
      API + "/ai",
      { prompt },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    setReply(res.data.reply || res.data.error);
  };

  /* ---------------- UPGRADE ---------------- */
  const upgrade = async () => {
    await axios.post(
      API + "/upgrade",
      { plan: "pro" },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    alert("Upgraded 🚀");
    loadSub();
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  useEffect(() => {
    if (token) loadSub();
  }, [token]);

  /* ---------------- LOGIN UI ---------------- */
  if (!token) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <h2>⚡ ShadowX Login</h2>

          <input
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button style={styles.btn} onClick={login}>
            Login
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- DASHBOARD ---------------- */
  return (
    <div style={styles.layout}>
      
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2>⚡ ShadowX</h2>

        <button onClick={loadSub} style={styles.sideBtn}>
          Subscription
        </button>

        <button onClick={upgrade} style={styles.sideBtn}>
          Upgrade Pro 💎
        </button>

        <button onClick={logout} style={{ ...styles.sideBtn, background: "#ff3b3b" }}>
          Logout
        </button>

        {sub && (
          <div style={styles.subBox}>
            <p>Plan: {sub.plan}</p>
            <p>Used: {sub.used}/{sub.ai_limit}</p>
          </div>
        )}
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        <div style={styles.card}>
          <h2>🤖 AI Assistant</h2>

          <input
            placeholder="Ask anything..."
            onChange={(e) => setPrompt(e.target.value)}
            style={styles.input}
          />

          <button style={styles.btn} onClick={askAI}>
            Send
          </button>

          <div style={styles.result}>{reply}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  layout: {
    display: "flex",
    height: "100vh",
    background: "linear-gradient(135deg,#0b0f1a,#111827)",
    color: "white",
    fontFamily: "Arial",
  },

  sidebar: {
    width: "240px",
    padding: "20px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  main: {
    flex: 1,
    padding: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.06)",
    padding: "20px",
    borderRadius: "15px",
    backdropFilter: "blur(12px)",
    boxShadow: "0 0 30px rgba(0,255,204,0.1)",
  },

  input: {
    padding: "10px",
    marginTop: "8px",
    width: "100%",
    borderRadius: "10px",
    border: "none",
    outline: "none",
  },

  btn: {
    padding: "10px",
    marginTop: "10px",
    background: "#00ffcc",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  sideBtn: {
    padding: "10px",
    background: "#1f2937",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#0b0f1a",
  },

  result: {
    marginTop: "10px",
    padding: "10px",
    background: "rgba(0,0,0,0.3)",
    borderRadius: "10px",
  },

  subBox: {
    marginTop: "10px",
    padding: "10px",
    background: "rgba(0,255,204,0.1)",
    borderRadius: "10px",
    fontSize: "12px",
  },
};
