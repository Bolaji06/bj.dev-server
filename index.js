import "dotenv/config";

import express from "express";
import cors from 'cors'

import project from "../api/src/routes/project.js"
import admin from "../api/src/routes/admin.js"
import email from "../api/src/routes/email.js"

const app = express();

app.use(express.json());
const allowedOrigins = ["http://localhost:3000"];

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

app.get('/', (req, res) => {
    return res.json({ success: true, message: 'welcome to bj.dev, everything you need to know about me'})
})

app.use('/api/project', project);
app.use('/api/admin', admin);
app.use('/api/send-email', email);


app.listen(7000, () => {
  console.log("server starting at 7000");
});
