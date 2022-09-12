import { ObjectId } from "mongodb";
import db from "../database/db.js";

export async function getStatements(req, res) {
  const { user } = req.locals;

  const statements = await db
    .collection("statements")
    .find({ userId: user._id })
    .toArray();

  console.log(statements);

  res.send(statements);
}

export async function postStatement(req, res) {
  const { user } = req.locals;
  const { description, value, type } = req.body;

  const newEntry = { description, value, type, date, userId: user._id };

  try {
    const result = await db.collection("statements").insertOne(newEntry);

    res.status(201).send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Couldn't add statement to database");
  }
}

export async function deleteStatement(req, res) {
  const { id } = req.params;

  try {
    const result = await db
      .collection("statements")
      .deleteOne({ _id: ObjectId(id), userId: user._id });

    if (result.deletedCount === 0) {
      return res.status(404).send("Statement not found");
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Couldn't delete statement from database");
  }
}

export async function putStatement(req, res) {
  const { id } = req.params;
  const { description, value, type } = req.body;

  try {
    const result = await db
      .collection("statements")
      .updateOne(
        { _id: ObjectId(id), userId: user._id },
        { $set: { description, value, type } }
      );

    if (result.modifiedCount === 0) {
      return res.status(404).send("Statement not found");
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Couldn't update statement in database");
  }
}
