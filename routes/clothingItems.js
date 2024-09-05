const router = require("express").Router();

//curl http://localhost:3001/items
router.get("/", () => console.log("GET all clothing items"));

//curl -X POST http://localhost:3001/items
router.post("/", () => console.log("POST new item"));

//curl -X DELETE http://localhost:3001/items/:itemId
router.delete("/:itemId", () => console.log("DELETE an item by Id"));

//curl -X PUT http://localhost:3001/:itemId/likes
router.put("/:itemId/likes", () => console.log("Like by an item by Id"));

//curl -X DELETE http://localhost:3001/:itemId/likes
router.delete("/:itemId/likes", () => console.log("Dislike by an item by Id"));

module.exports = router;
