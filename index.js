import express, { json } from "express";
import cors from "cors";
import { signUpUser, signInUser } from "./controllers/auth.controller.js";
import chalk from "chalk";

const app = express();

app.use(cors());
app.use(json());

//Routes

app.post('/sign-in', signInUser) //Sign in route 

app.post('/sign-up', signUpUser) //Sign up route

app.listen(5000, () => (console.log(chalk.bgYellow.red("Server is running on port 5000")))); //Server is running on port 5000