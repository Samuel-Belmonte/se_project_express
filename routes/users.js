const router = require("express").Router();

//curl http://localhost:3001/users
router.get("/", () => console.log("GET users"));

//curl http://localhost:3001/users/123
router.get("/:userId", () => console.log("GET users by Id"));

//curl -X POST http://localhost:3001/users
router.post("/", () => console.log("POST users"));

module.exports = router;
