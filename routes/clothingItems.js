const router = require("express").Router();

//curl http://localhost:3001/items
router.get("/", () => console.log("GET all clothing items"));

//curl -X POST http://localhost:3001/items
router.post("/", () => console.log("POST new item"));

//curl -X DELETE http://localhost:3001/items/123
router.delete("/:itemId", () => console.log("DELETE an item by Id"));

module.exports = router;
