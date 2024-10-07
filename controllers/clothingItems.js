const Item = require("../models/clothingItems");

const {
  defaultError,
  castError,
  documentNotFoundError,
  forbiddenError,
} = require("../utils/error");

// Get /items - returns all clothing items - getItem
const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      // change 500 so it isn't hard coded
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

// POST /items - creates a new item createItem
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  // name, weather, imageUrl, and owner from schema
  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(castError).send({ message: "Invalid data" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

// DELETE /items/:itemId - deletes an item by _id deleteItem
const deleteItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  Item.findById(itemId)
    .orFail()
    .then((item) => {
      const ownerId = item.owner.toString();

      if (userId !== ownerId) {
        return res
          .status(forbiddenError)
          .send({ message: "You don't have permission to delete this item" });
      }
      Item.findByIdAndDelete(req.params.itemId)
        // for item with id that doesn't exist (before .then())
        .orFail()
        .then((item) => res.status(200).send(item))
        .catch((err) => {
          console.error(err);
          // delete an item with an _id that does not exist in the database
          if (err.name === "DocumentNotFoundError") {
            return res
              .status(documentNotFoundError)
              .send({ message: err.message });
          }
          if (err.name === "CastError") {
            return res.status(castError).send({ message: "Invalid data" });
          }
          // delete a user with an _id that does not exist in the database
          return res
            .status(defaultError)
            .send({ message: "An error has occurred on the server" });
        });
    });
};

// PUT /items/:itemId/likes - like an item - likeItem
const likeItem = (req, res) => {
  const { itemId } = req.params;
  Item.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(documentNotFoundError).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(castError).send({ message: "Invalid data" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

// DELETE /items/:itemId/likes - unlike an item - dislikeItem
const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  Item.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(documentNotFoundError).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(castError).send({ message: "Invalid data" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
