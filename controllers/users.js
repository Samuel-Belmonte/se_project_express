const User = require("../models/users");

const {
  defaultError,
  castError,
  documentNotFoundError,
} = require("../utils/error");

// GET /users - returns all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      // change 500 so it isn't hard coded
      return res.status(defaultError).send({ message: err.message });
    });
};

// POST /users - creates a new user
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  // name and avatar from schema
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(castError).send({ message: err.message });
      }
      return res.status(defaultError).send({ message: err.message });
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
        return res.status(castError).send({ message: err.message });
      }
      // get a user with an _id that does not exist in the database
      return res.status(defaultError).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser };
