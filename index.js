const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "shadowx_secret";

// REGISTER (test ke liye)
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  db.run(
    "INSERT INTO users(username,password) VALUES(?,?)",
    [username, password]
  );

  res.json({ msg: "user created" });
});

// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, user) => {
      if (!user) return res.json({ error: "invalid login" });

      const token = jwt.sign({ username }, SECRET);

      res.json({ token });
    }
  );
});

app.listen(process.env.PORT || 3000);
