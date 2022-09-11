import bcrypt from "bcrypt";
import Joi from "joi";
import { passwordStrength } from "check-password-strength";
import { v4 as uuid } from "uuid";

import db from "../database/db.js";

const newUserSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-ZãÃÇ-Üá-ú ]*$/i)
    .min(3)
    .max(30)
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^\S{6,20}$/)
    .min(8)
    .max(30)
    .required(),
});

export async function signUpUser(req, res) {
  const { name, email, password } = req.body;

  try {
    newUserSchema.validate(req.body, { abortEarly: false });
  } catch (error) {
    res.status(400).send(error.details.map((err) => err.message));
  }

  try {
    const user = await db.collection("users").findOne({ email });

    if (user) {
      return res.status(409).send("User already exists");
    }
  } catch (error) {}

  const strength = passwordStrength(password).value;

  if (strength === "weak" || strength === "very weak") {
    return res.status(406).send("Password is too weak");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = {
      name,
      email,
      password: hashedPassword,
      id: uuid(),
    };

    const result = await db.collection("users").insertOne(newUser);

    res.status(201).send(result);
  } catch (error) {}
}

export async function signInUser(req, res) {
  const { email, password } = req.body;

  try {
    loginSchema.validate(req.body, { abortEarly: false });
  } catch (error) {
    return res.status(400).send(error.details.map((err) => err.message));
  }

  try {
    const user = await db.collection("users").findOne({ email });
    const validPassword = await bcrypt.compare(password, user.password);

    if (!user) {
      return res.status(400).send("User not found");
    }

    if (!validPassword) {
      return res.status(400).send("Invalid password");
    }

    const token = uuid();

    try {
      await db.collection("sessions").insertOne({ token, userId: user._id });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Couldn't add session to database");
    }
  } catch (error) {
    return res.sendStatus(401);
  }

  res.status(200).send("Logged in");
}
