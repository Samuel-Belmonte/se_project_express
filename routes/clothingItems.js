const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// curl http://localhost:3001/items
router.get("/", getItems);

// curl -X POST http://localhost:3001/items
router.post("/", createItem);

// curl -X DELETE http://localhost:3001/items/:itemId
router.delete("/:itemId", deleteItem);

// curl -X PUT http://localhost:3001/:itemId/likes
router.put("/:itemId/likes", likeItem);

// curl -X DELETE http://localhost:3001/:itemId/likes
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
