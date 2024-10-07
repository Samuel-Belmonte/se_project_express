const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/users");

const {
  defaultError,
  castError,
  documentNotFoundError,
  duplicationError,
  unauthorizedError,
} = require("../utils/error");

const { JWT_SECRET } = require("../utils/config");

// POST /users - creates a new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      // name and avatar from schema
      User.create({ name, avatar, email, password: hash })
    )
    .then(() => res.status(201).send({ name, avatar, email }))
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res
          .status(duplicationError)
          .send({ message: "User with this email doesn't exist" });
      }
      if (err.name === "ValidationError") {
        return res.status(castError).send({ message: "Invalid data" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occured on the server" });
    });
};

// GET /users/:userId - returns a user by _id
const getUser = (req, res) => {
  const { userId } = req.user._id;
  User.findById(userId)
    // for user with id that doesn't exist (before .then())
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      // get a user with an _id that does not exist in the database
      if (err.name === "DocumentNotFoundError") {
        return res.status(documentNotFoundError).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(castError).send({ message: "Invalid data" });
      }
      // get a user with an _id that does not exist in the database
      return res
        .status(defaultError)
        .send({ message: "An error has occured on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || password) {
    return res
      .status(castError)
      .send({ message: "Must enter email and password" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // send token to the client
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        res
          .status(unauthorizedError)
          .send({ message: "Incorrect email or password" });
      }
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res
          .status(documentNotFoundError)
          .send({ message: "User not found" });
      }

      return res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(castError).send({ message: "Invalid data" });
      }
      res
        .status(defaultError)
        .send({ message: "An error has occured on the server" });
    });
};

module.exports = { getUsers, createUser, getUser, login, updateUser };
