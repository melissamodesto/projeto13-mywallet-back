import express, { json } from "express";
import cors from "cors";

import chalk from "chalk";
import authRouter from "./routes/authRouter.js";
import statementsRouter from "./routes/statementsRouter.js";

const app = express();

app.use(cors());
app.use(json());

//Routes

app.post(authRouter) //Sign in route 

app.post(statementsRouter) //Sign up route

app.listen(5000, () => (console.log(chalk.bgYellow.red("Server is running on port 5000")))); //Server is running on port 5000