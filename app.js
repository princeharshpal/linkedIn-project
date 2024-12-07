const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");
const connectDb = require("./config/db");
const userRouter = require("./routes/users");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();


app.get("/", (req, res) => {
  res.render("pages/start");
});

app.use("/users", userRouter);

app.listen(3000, () => {
  console.log("server is listening");
});
