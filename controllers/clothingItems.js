const Item = require("../models/clothingItems");

const {
  defaultError,
  castError,
  documentNotFoundError,
} = require("../utils/error");

//Get /items - returns all clothing items - getItem
const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      //change 500 so it isn't hard coded
      return res.status(defaultError).send({ message: err.message });
    });
};

//POST /items - creates a new item createItem
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  //name, weather, imageUrl, and owner from schema
  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(castError).send({ message: err.message });
      }
      return res.status(defaultError).send({ message: err.message });
    });
};

//DELETE /items/:itemId - deletes an item by _id deleteItem
const deleteItem = (req, res) => {
  Item.findByIdAndDelete(req.params.itemId)
    //for item with id that doesn't exist (before .then())
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      //delete an item with an _id that does not exist in the database
      if (err.name === "DocumentNotFoundError") {
        return res.status(documentNotFoundError).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(castError).send({ message: err.message });
      }
      //delete a user with an _id that does not exist in the database
      return res.status(defaultError).send({ message: err.message });
    });
};

//PUT /items/:itemId/likes - like an item - likeItem
const likeItem = (req, res) => {
  const { userId } = req.params.itemId;
  Item.findByIdAndUpdate(
    userId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(documentNotFoundError).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(castError).send({ message: err.message });
      }
      return res.status(defaultError).send({ message: err.message });
    });
};

//DELETE /items/:itemId/likes - unlike an item - dislikeItem
const dislikeItem = (req, res) => {
  const { userId } = req.params.itemId;
  Item.findByIdAndUpdate(
    userId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(documentNotFoundError).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(castError).send({ message: err.message });
      }
      return res.status(defaultError).send({ message: err.message });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
