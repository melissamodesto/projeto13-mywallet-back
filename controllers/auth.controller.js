import bcrypt from "bcrypt";
import { passwordStrength } from "check-password-strength";
import { v4 as uuid } from "uuid";

import db from "../database/db.js";

export async function signUpUser(req, res) {
  const { name, email, password } = req.body;

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

    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).send(result);
  } catch (error) {
    res.send(req.body);
    console.log(error);
  }
}

export async function signInUser(req, res) {
  const { email, password } = req.body;

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
      return res.status(200).send({ token });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Couldn't add session to database");
    }
  } catch (error) {
    return res.status(401).send("Invalid email or password");
  }

  res.status(200).send("Logged in");
}
