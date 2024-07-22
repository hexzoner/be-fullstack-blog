import express from "express";
import pg from "pg";
const { Client } = pg;

const app = express();
const port = 3000;

app.use(express.json());
app.get("/posts", async (req, res) => {
  const client = new Client({
    connectionString: process.env.PG_URI,
  });
  await client.connect();
  const results = await client.query("SELECT * FROM posts;");
  await client.end();

  res.json(results.rows);
});

app.post("/posts", async (req, res) => {
  //   console.log(req.body);
  const parsedBody = req.body;

  const client = new Client({
    connectionString: process.env.PG_URI,
  });
  await client.connect();
  const results = await client.query("INSERT INTO posts (author, title, cover, content, date) VALUES ($1, $2, $3, $4, $5) RETURNING *;", [
    parsedBody.author,
    parsedBody.title,
    parsedBody.cover,
    parsedBody.content,
    parsedBody.date,
  ]);
  await client.end();

  res.json(results.rows[0]);
});

app.get("/posts/:id", (req, res) => res.json({ message: "GET a post by id" }));

app.put("/posts/:id", (req, res) => res.json({ message: "PUT a post by id" }));

app.delete("/posts/:id", (req, res) => res.json({ message: "DELETE a post by id" }));

app.listen(port, () => console.log(`Server is running on port ${port}`));
