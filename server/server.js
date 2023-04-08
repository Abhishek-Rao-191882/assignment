import cookieParser from "cookie-parser";
import cors from "cors";
import csrf from "csurf";
import express from "express";
import mongoose from "mongoose";
require("dotenv").config();
const csrfProtection = csrf({ cookie: true });
const app = express();

//conecto db
mongoose
  .connect(
    "mongodb+srv://mukmrjup:LrJ3csxodcz4T1op@cluster0.xhqjile.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("*** DB CONNECTED ✔️ ***"))
  .catch((error) => console.log(`*** DB CONNECTION ERROR ❌ => ${error}***`));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const router = require("./routes");
app.use("/api", router);

//middleware csrf
app.use(csrfProtection);

//endpoint csrf
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

//port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`*** SERVER IS RUNNING ON PORT ${PORT} ***`);
});
