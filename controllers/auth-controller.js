import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const createAccount = async (req, res) => {
  const { name, email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).send("Invalid email format");
  }

  const encrypted = bcrypt.hashSync(password);

  try {
    await knex("users").insert({ name, email, password: encrypted });
    res.status(201).send("Account created successfully");
  } catch (e) {
    switch (e.code) {
      case "ER_DUP_ENTRY":
        res.status(400).send("The user with this email already exist");
        break;
      case "ER_DATA_TOO_LONG":
        res.status(400).send("username too long (max 20 chars)");
        break;
      default:
        res.status(500).send("something went wrong");
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await knex("users").where({ email }).first();

    if (!user) {
      return res.status(400).send("User does not exist");
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).send("Password incorrect");
    }

    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);

    res.json({ token });
  } catch (e) {
    res.status(401).send("login failed");
  }
};

export { createAccount, login };
