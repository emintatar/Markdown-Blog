const express = require("express");
const router = express.Router();
const Article = require("../models/article");
const path = require("path");

router.get("/new", (req, res) => {
  res.render("new", { article: new Article() });
});

router.get("/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const article = await Article.findOne({ slug: slug }).exec();

    if (!article) {
      res.redirect("/");
    } else {
      res.render("show", { article: article });
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const article = await Article.findById(id).exec();
  res.render("edit", { article: article });
});

router.post("/", async (req, res) => {
  try {
    const article = new Article({
      title: req.body.title,
      description: req.body.description,
      markdown: req.body.markdown,
    });
    await article.save().then(() => {
      res.redirect(`/articles/${article.slug}`);
    });
  } catch (error) {
    console.log(error);
    res.redirect("new", { article: article });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Article.findByIdAndDelete(id);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const article = await Article.findByIdAndUpdate(
    id,
    {
      title: req.body.title,
      description: req.body.description,
      markdown: req.body.markdown,
    },
    { new: true }
  );

  try {
    await article.save().then(() => {
      res.redirect(`/articles/${article.slug}`);
    });
  } catch (error) {
    console.log(error);
    res.redirect("edit", { article: article });
  }
});

module.exports = router;
