const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const bp = require("body-parser");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
const dbPath = path.join(__dirname, "arrayData.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(port, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
app.post("/questions/", async (request, response) => {
    const { id, question, options, correct } = request.body;
    const getQuestions = `
    INSERT INTO
      project (id, question, options, correct)
    VALUES
      ('${id}', '${question}', '${options}','${correct}');`;
    await db.run(getQuestions);
    response.send("qustion Successfully Added");
  }); 
  app.get("/questions/", async (request, response) => {
    const getAllQuestions = `
      SELECT
        *
      FROM
        project;`;
    const questionsArray = await db.all(getAllQuestions);
    response.send(questionsArray);
  }); 
