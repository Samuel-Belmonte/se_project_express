const router = require("express").Router();

const usersRouter = require("./users");
const itemsRouter = require("./clothingItems");

const { documentNotFoundError } = require("../utils/error");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.post("/signin", login);
router.post("signup", createUser);
router.use("/users", usersRouter);
router.use("/items", itemsRouter);

router.use(auth);

router.use((req, res) => {
  res.status(documentNotFoundError).send({ message: "Router not found" });
});

module.exports = router;
