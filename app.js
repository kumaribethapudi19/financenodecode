const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const databasePath = path.join(__dirname, "uploadedfiledetails.db");

const app = express();

app.use(express.json());
app.use(cors());
let database = null;
const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/users/", async (request, response) => {
  const getUserQuery = `
    SELECT
      *
    FROM
      user
    ORDER BY
      userId;`;
  const userArray = await db.all(getUsersQuery);
  response.send(userArray);
});

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `SELECT * FROM login_credentials WHERE username = '${username}'`;
  const dbUser = await database.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid User");
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      response.send("Login Success!");
    } else {
      response.status(400);
      response.send("Invalid Password");
    }
  }
});

app.get("/users/:id/", async (request, response) => {
  const { id } = request.params;
  const getUserQuery = `
    SELECT
      *
    FROM
      user
    WHERE
      id = ${id};`;
  const user1 = await database.get(getUserQuery);
  response.send(user1);
});

app.post("/users/", async (request, response) => {
  const userDetails = request.body;
  const { userId, id, title, body } = userDetails;
  const addUserQuery = `
    INSERT INTO
      user (userId,id,title,body)
    VALUES
      (
        ${userId},
         ${Id},
         '${title}',
        '${body}'
      );`;

  const dbResponse = await database.run(addBookQuery);
  const id1 = dbResponse.lastID;
  response.send({ id: id1 });
});

app.put("/users/:id/", async (request, response) => {
  const { id } = request.params;
  const userDetails = request.body;
  const { userId, id, title, body } = userDetails;
  const updateUserQuery = `
    UPDATE
      user
    SET

      userId=${userId},
      id=${id},
      title='${title}',
      body='${body}'

    WHERE
      id = ${id};`;
  await db.run(updateUserQuery);
  response.send("User Updated Successfully");
});

module.exports = app;
