const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = 5000;
const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = "1m";

app.use(
  cors({
    origin: "http://localhost:3000", // 프론트 주소
    credentials: true, // ⭐ 쿠키 허용 필수
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

const users = [
  {
    id: 1,
    email: "yugil3150@gmail.com", //추후 DB 데이터로 변경필요
    role: "user",
  },
];

// =====================
// 로그인
// =====================
app.post("/google/login", (req, res) => {
  const { email } = req.body;

  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: TOKEN_EXPIRATION }
  );

  // 🔥 HttpOnly Cookie 설정
  return res
    .status(200)
    .cookie("accessToken", token, {
      httpOnly: true,
      secure: false, // 배포 시 true
      sameSite: "strict",
      maxAge: 60 * 1000,
    })
    .json({
      message: "Login success",
    });
});
// =====================
// 인증 미들웨어
// =====================
const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    // ❌ 토큰 만료 / 변조
    if (err) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    // ✅ 인증 성공
    req.user = decoded;
    next();
  });
};

// =====================
// 로그인 상태 확인
// =====================
app.get("/auth/me", authenticateToken, (req, res) => {
  return res.status(200).json({
    isAuthenticated: true,
    user: req.user,
  });
});

// =====================
// 보호된 API
// =====================
app.get("/protected", authenticateToken, (req, res) => {
  return res.status(200).json({
    message: "This is protected content",
  });
});

// =====================
// 로그아웃
// =====================
app.post("/logout", (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "strict",
  });

  return res.status(204).end();
});

// =====================
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
