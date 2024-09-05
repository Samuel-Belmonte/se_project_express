const Item = require("../models/clothingItems");

//Get /items - returns all clothing items - getItem
const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      //change 500 so it isn't hard coded
      return res.status(500).send({ message: err.message });
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
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
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
        return res.status(404).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      //delete a user with an _id that does not exist in the database
      return res.status(500).send({ message: err.message });
    });
};

//PUT /items/:itemId/likes - like an item - likeItem
//DELETE /items/:itemId/likes - unlike an item - dislikeItem

module.exports = { getItems, createItem, deleteItem };
