const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const {v4:uuidv4} = require("uuid");
const methodOverride = require("method-override");




app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

let posts = [
    {
        id: uuidv4(),
        user:"Ammad",
        content:"I love coding",
    },
    {
        id  : uuidv4(),
        user    : "Ali", 
        content :"Hard work is the key to success",
    },
    {
        id  : uuidv4(),
        user    :"Ahmed",
        content :"I am a web developer",
    }
];

app.get('/posts', (req, res) => { 
    res.render("index.ejs", {posts: posts});
});
app.get('/posts/new', (req, res) => {
    res.render("new.ejs");
});
app.post('/posts', (req, res) => {  
    let {user,content} = req.body;
    let id = uuidv4();
    posts.push({id,user,content});
    res.redirect('/posts');
});

app.get("/posts/:id", (req,res) => {
    const {id} = req.params;
    const post = posts.find(p => p.id === id);
    res.render("show.ejs", {post});
})


app.get("/posts/:id/edit", (req,res) => { 
    let { id } = req.params;
    let post = posts.find(p => p.id === id);
    res.render("edit.ejs", {post});
});
app.patch("/posts/:id", (req,res) => {
    let { id } = req.params;
    let newContent = req.body.content;
    let post = posts.find(p => p.id === id);
    post.content = newContent;
    res.redirect("/posts");
})

app.delete("/posts/:id", (req,res) => { 
    let { id } = req.params;
    posts = posts.filter(p => p.id !== id);
    res.redirect("/posts");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});