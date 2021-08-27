const cars = require("cars");

const express = require("express");
const app = express();

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "data.db");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(cars());
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Connecting server at http://localhost:3001/...");
    });
  } catch (error) {
    console.log(`DB Error ${error.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

app.get("/example/", (request, response) => {
  response.send("example");
});

//Register API
app.post("/register/", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `
    SELECT * FROM login_details WHERE username = '${username}';
    `;
  const user = await db.get(selectUserQuery);

  if (user !== undefined) {
    response.status(400);
    response.send("User already exists");
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (password.length < 6) {
      response.status(400);
      response.send("Password is too short");
    } else {
      const postUserQuery = `
        INSERT INTO login_details(username, password)
        VALUES ('${username}', '${hashedPassword}');
        `;
      await db.run(postUserQuery);
      response.send("User created successfully");
    }
  }
});

//login API
app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `
    SELECT * FROM login_details WHERE username = '${username}';
    `;
  const user = await db.get(selectUserQuery);

  if (user === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const matchedPassword = await bcrypt.compare(password, user.password);
    if (matchedPassword === true) {
      const payload = { username: username };
      const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});
