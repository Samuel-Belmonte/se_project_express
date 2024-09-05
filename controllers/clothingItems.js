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
const createitem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  //name and avatar from schema
  User.create({ name, weather, imageUrl, owner })
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
//PUT /items/:itemId/likes - like an item - likeItem
//DELETE /items/:itemId/likes - unlike an item - dislikeItem

module.exports = { getItems };
