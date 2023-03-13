const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();
const port = 5000;
const hostname = "127.0.0.1";
const articleRouter = require("./routes/articles");
const Article = require("./models/article");

mongoose
  .connect(`mongodb://${hostname}/markdowndb`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" }).exec();
  res.render("index", { articles: articles });
});

app.use(express.urlencoded({ extended: false }));

app.use(methodOverride("_method"));

app.use("/articles", articleRouter);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
