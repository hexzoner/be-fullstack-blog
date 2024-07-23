import express from "express";
import pg from "pg";
import cors from "cors";
const { Client } = pg;

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/posts", async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;

    const client = new Client({
      connectionString: process.env.PG_URI,
    });
    await client.connect();
    const results = await client.query("SELECT * FROM posts LIMIT $1 OFFSET $2;", [limit, offset]);
    await client.end();

    // console.log(results.rowCount);
    res.json(results.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.post("/posts", async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.get("/posts/:id", async (req, res) => {
  
  try {
  const id=req.params.id;

  const client = new Client({
    connectionString: process.env.PG_URI,
  });
  await client.connect();
  const results = await client.query("SELECT * FROM posts WHERE id=$1;", [
    id
  ]);
  console.log(results.rowCount) 

  await client.end();
  if (results.rowCount=0) 
     res.status(404).json({ error: "User not found" })
  else
  res.json(results.rows[0]);
} catch (error) {
  res.status(500).json(error.message);
}
});

app.put("/posts/:id", (req, res) => res.json({ message: "PUT a post by id" }));

app.delete("/posts/:id", (req, res) => res.json({ message: "DELETE a post by id" }));

app.listen(port, () => console.log(`Server is running on port ${port}`));
