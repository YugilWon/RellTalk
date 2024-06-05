const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;
const SECRET_KEY = "testkey";
const TOKEN_EXPIRATION = "1m";

app.use(cors());
app.use(bodyParser.json());

const users = [
  {
    id: 1,
    email: "yugil3150@gmail.com",
    role: "user",
  },
];

app.post("/google/login", (req, res) => {
  const { email } = req.body;

  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, {
    expiresIn: TOKEN_EXPIRATION,
  });

  res.json({ token });
});

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get("/protected", authenticateToken, (req, res) => {
  res.send("This is protected content");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
