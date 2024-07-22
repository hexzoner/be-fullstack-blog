import express from "express";

const app = express();
const port = 3000;

app.get("/posts", (req, res) => res.json({ message: "GET all posts" }));

app.post("/posts", (req, res) => res.json({ message: "POST a new post" }));

app.get("/posts/:id", (req, res) => res.json({ message: "GET a post by id" }));

app.put("/posts/:id", (req, res) => res.json({ message: "PUT a post by id" }));

app.delete("/posts/:id", (req, res) => res.json({ message: "DELETE a post by id" }));

app.listen(port, () => console.log(`Server is running on port ${port}`));
