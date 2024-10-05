const User = require("../models/users");
const bcrypt = require("bcryptjs");

const {
  defaultError,
  castError,
  documentNotFoundError,
  duplicationError,
  unauthorizedError,
} = require("../utils/error");

const JWT_SECRET = require("../utils/config");

// GET /users - returns all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      // change 500 so it isn't hard coded
      return res
        .status(defaultError)
        .send({ message: "An error has occured on the server" });
    });
};

// POST /users - creates a new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      // name and avatar from schema
      User.create({ name, avatar, email, password: hash })
    )
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === 11000) {
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
  const { userId } = req.params;
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

  return User.findByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      //send token to the client
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(unauthorizedError)
        .send({ message: "Incorrect email or password" });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  ).then((updateUser) => {
    if (!updateUser) {
      return res.status(documentNotFoundError).send({ message: "User not found" });
    }

    return res.send(updateUser);
  }).catch((err)=> {
    if (err.name === "ValidationError"){
      return res.status(castError).send({message: "Invalid data"})
    }
    res.status(defaultError).send({message: "An error has occured on the server")
  })
};

module.exports = { getUsers, createUser, getUser, login, updateUser };
