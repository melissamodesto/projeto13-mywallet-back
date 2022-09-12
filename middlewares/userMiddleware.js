import db from "../database/db.js";

export async function validateSession(req, res) {
  const { authorization } = req.headers;

  const regex = authorization?.match(/Bearer (.*)/);

  if (!regex) {
    return res.status(401).send("Pass authorization token in request header");
  }

  const token = authorization.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send("Pass authorization token in request header");
  }

  const session = await db.collection("sessions").findOne({ token });

  if (!session) {
    return res.status(401).send("Invalid token");
  }

  const user = await db.collection("users").findOne({ _id: session.userId });

  if (!user) {
    return res
      .status(401)
      .send("Could not find user related to this session token");
  }

  delete user.password;
}
