const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB");

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

const defaultpost1 = new Post({
  title: "Welcome to my blog",
  content: "Hello its Burak welcome to my Blog site.",
});
const defaultpost2 = new Post({
  title: "Welcome to my blog",
  content: "Have enjoy!",
});

const defaultposts = [defaultpost1, defaultpost2];

app.get("/", (req, res) => {
  Post.find({}, (err, foundpost) => {
    if (foundpost.length === 0) {
      Post.insertMany(defaultposts, (err) => {
        if (err) {
          console.log(err);
        }
        res.redirect("/");
      });
    } else {
      res.render("home", { Post: foundpost });
    }
  });
});

app.get("/articles/newpost", (req, res) => {
  res.render("newpost");
});

app.post("/articles/newpost", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
  });
  post.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const postid = req.body.deletebutton;
  Post.findByIdAndRemove({ _id: postid }, (err) => {
    console.log("Succesfully deleted");
  });
  res.redirect("/");
});

app.post("/articles/edit", (req, res) => {
  const postid = req.body.editbutton;
  Post.findOne({ _id: postid }, (err, foundpost) => {
    res.render("edit", { Post: foundpost });
  });
});

app.post("/articles/edittedpost", (req, res) => {
  const postid = req.body.savebutton;
  const title = req.body.title;
  const content = req.body.content;

  Post.findOneAndUpdate(
    { _id: postid },
    { title: title, content: content },
    { new: true },
    (err, data) => {
      if (!err) {
        console.log(data);
      }
    }
  );
  res.redirect("/");
});

app.get("/articles/:postid", (req, res) => {
  const requestedid = req.params.postid;

  Post.findOne({ _id: requestedid }, (err, foundpost) => {
    res.render("post", { Post: foundpost });
  });
});
app.listen(3000, () => {
  console.log("Connected on port 3000");
});
