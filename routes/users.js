const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");

//curl http://localhost:3001/users
router.get("/", getUsers);

//curl http://localhost:3001/users/:userId
router.get("/:userId", getUser);

//curl -X POST http://localhost:3001/users
router.post("/", createUser);

module.exports = router;
