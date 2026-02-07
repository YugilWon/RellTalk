// const express = require("express");
// const jwt = require("jsonwebtoken");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// require("dotenv").config();

// const app = express();
// const PORT = 5000;
// const SECRET_KEY = process.env.JWT_SECRET;
// const TOKEN_EXPIRATION = "1m";

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );
// app.use(bodyParser.json());
// app.use(cookieParser());

// const users = [
//   {
//     id: 1,
//     email: "yugil3150@gmail.com",
//     role: "user",
//   },
// ];

// app.post("/google/login", (req, res) => {
//   const { email } = req.body;

//   const user = users.find((user) => user.email === email);
//   if (!user) {
//     return res.status(401).send("Unauthorized");
//   }

//   const token = jwt.sign(
//     { id: user.id, email: user.email, role: user.role },
//     SECRET_KEY,
//     { expiresIn: TOKEN_EXPIRATION }
//   );

//   return res
//     .status(200)
//     .cookie("accessToken", token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "strict",
//       maxAge: 60 * 1000,
//     })
//     .json({
//       message: "Login success",
//     });
// });

// const authenticateToken = (req, res, next) => {
//   const token = req.cookies.accessToken;

//   if (!token) {
//     return res.status(401).json({
//       message: "Authentication required",
//     });
//   }

//   jwt.verify(token, SECRET_KEY, (err, decoded) => {

//     if (err) {
//       return res.status(401).json({
//         message: "Invalid or expired token",
//       });
//     }

//     req.user = decoded;
//     next();
//   });
// };

// app.get("/auth/me", authenticateToken, (req, res) => {
//   return res.status(200).json({
//     isAuthenticated: true,
//     user: req.user,
//   });
// });

// app.get("/protected", authenticateToken, (req, res) => {
//   return res.status(200).json({
//     message: "This is protected content",
//   });
// });

// app.post("/logout", (req, res) => {
//   res.clearCookie("accessToken", {
//     httpOnly: true,
//     sameSite: "strict",
//   });

//   return res.status(204).end();
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
