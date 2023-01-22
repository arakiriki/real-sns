const express = require("express");
const app = express();
const PORT = 5000;
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

mongoose.set('strictQuery', true);

//データベース接続
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DBと接続中。。。");
  })
  .catch((err) => {
    console.log(err);
  })


//ミドルウェア
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);

app.get("/", (req, res) => {
  res.send("hello express");
})



app.listen( PORT, () => console.log("サーバーを起動しました。") );
