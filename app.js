require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const { body, validationResult } = require("express-validator");
const userRoutes = require("./routes/user.routes")

connectDB();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes)

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const newUser = await User.create({
    username,
    email,
    password,
  });
  res.send(newUser);
});

app.listen(3000, () => {
  console.log("server is listening");
});
