import express, { json } from "express";
import { cors } from "cors";
import Joi from "joi";

const app = express();

app.use(cors());
app.use(json());

//Routes

app.post('/Sign-in', signInUser) //Sign in route 

app.post('/Sign-up', signUpUser) //Sign up route

app.listen(5000, () => console.log("Server is running on port 5000")); //Server is running on port 5000