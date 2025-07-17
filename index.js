const fs = require('fs-extra')
const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");
const multer = require('multer');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

let posts = [
    {
        image: "/asset/Goku foto.jpg",
        id: uuidv4(),
        user: "Goku",
        content: "I love coding",
    },
    {
        image: "/asset/WhatsApp Image 2024-11-22 at 20.46.03_1bd378a5.jpg",
        id: uuidv4(),
        user: "Vegeta",
        content: "Hard work is the key to success",
    }
];

app.get('/posts', (req, res) => {
    res.render("index.ejs", { posts: posts });
});

app.get('/posts/new', (req, res) => {
    res.render("new.ejs");
});

app.post('/posts', upload.single('image'), (req, res) => {
    let { user, content } = req.body;
    let id = uuidv4();
    let image = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.jpg';
    posts.push({ id, user, content, image });
    res.redirect('/posts');
});

app.get("/posts/:id", (req, res) => {
    const { id } = req.params;
    const post = posts.find(p => p.id === id);
    res.render("show.ejs", { post });
});

app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find(p => p.id === id);
    res.render("edit.ejs", { post });
});

app.patch("/posts/:id", (req, res) => {
    let { id } = req.params;
    let newContent = req.body.content;
    let post = posts.find(p => p.id === id);
    post.content = newContent;
    res.redirect("/posts");
});

app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter(p => p.id !== id);
    res.redirect('/posts');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});