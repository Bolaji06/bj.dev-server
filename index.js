import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";

import project from "./src/routes/project.js";
import admin from "./src/routes/admin.js";
import email from "./src/routes/email.js";
import auth from "./src/routes/auth.js";
import user from "./src/routes/user.js";
import experience from "./src/routes/experience.js";
import profile from "./src/routes/profile.js";
import bug from "./src/routes/bug.js";

const app = express();

app.use(express.json());
const allowedOrigins = ["http://localhost:3000", "https://bjdev.vercel.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(
  cookieSession({
    name: "bj.dev-session",
    secret: process.env.COOKIE_SECRET,
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_SECRET],
    secure: true, // change this to true in production
    signed: true,
  })
);

app.use("/api/project", project);
app.use("/api/admin", admin);
app.use("/api/send-email", email);
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/experience", experience);
app.use("/api/profile", profile);
app.use("/api/buster", bug);

app.listen(7000, () => {
  console.log("server starting at 7000");
});
