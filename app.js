require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const User = require("./models/user.model");
const userRoutes = require("./routes/user.routes");
const path = require("path");
const cookieParser = require("cookie-parser");

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/users", userRoutes);

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
