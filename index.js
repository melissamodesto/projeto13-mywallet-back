import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import authRouter from "./routes/authRouter.js";
import statementsRouter from "./routes/statementsRouter.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(json());

//Routes

app.use(authRouter); //Auth router

app.use(statementsRouter);  //Statements router

app.get("/", (req, res) => {
  res.send("Online");
}); // Online route

app.listen(5000, () =>
  console.log(chalk.bgYellow.red("Server is running on port 5000"))
); //Server is running on port 5000
