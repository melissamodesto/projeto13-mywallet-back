import { ObjectId } from "mongodb";
import db from "../database/db.js";

export async function getStatements(req, res) {
  const { user } = req.locals;

  try {
    const statements = await db
      .collection("statements")
      .find({ userId: user._id })
      .toArray();

    res.send(statements);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}

export async function postStatement(req, res) {
  const { user } = req.locals;
  const { description, value, type } = req.body;

  const trimmedDescription = description?.trim();

  const valueNumber = parseFloat(value).toFixed(2);

  if (valueNumber <= 0) {
    return res.status(400).send("Value must be greater than 0");
  }

  const descriptionContent =
    trimmedDescription?.length > 0 ? trimmedDescription : "Sem descrição";

  const newEntry = {
    description: descriptionContent,
    value: valueNumber,
    type,
    userId: user._id,
  };

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
  const { user } = req.locals;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid id");
  }

  try {
    const statement = await db
      .collection("statements")
      .findOne({ _id: new ObjectId(id) });

    if (!statement) {
      return res.status(404).send("Statement not found");
    }

    const userIdFromStatement = statement.userId.toString();
    const userIdFromToken = user._id.toString();

    if (userIdFromStatement !== userIdFromToken) {
      return res.status(401).send("Unauthorized");
    }
    try {
      const result = await db
        .collection("statements")
        .deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount > 0) {
        return res.status(200).send("Sucessfully deleted");
      }
    } catch (error) {
      return res.status(500).send("Couldn't delete statement");
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
  const { user } = req.locals;

  const trimmedDescription = description?.trim();

  const valueNumber = parseFloat(value).toFixed(2);

  if (valueNumber === "" || valueNumber <= 0) {
    return res.status(400).send("Value must be greater than 0");
  }

  const descriptionContent =
    trimmedDescription?.length > 0 ? trimmedDescription : "Sem descrição";

  const editEntry = {
    description: descriptionContent,
    value: valueNumber,
    type,
  };

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid id");
  }

  try {
    const statement = await db
      .collection("statements")
      .findOne({ _id: new ObjectId(id) });

    if (!statement) {
      return res.status(404).send("Statement not found");
    }

    const userIdFromStatement = statement.userId.toString();
    const userIdFromToken = user._id.toString();

    if (userIdFromStatement !== userIdFromToken) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const result = await db
        .collection("statements")
        .updateOne({ _id: new ObjectId(id) }, { $set: editEntry });

      if (result.modifiedCount > 0) {
        return res.status(200).send("Sucessfully edited");
      }
    } catch (error) {
      return res.status(500).send("Couldn't edit statement");
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Couldn't edit statement from database");
  }
}