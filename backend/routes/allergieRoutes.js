const express = require("express");
const router = express.Router();

const allergieController = require("../controllers/allergieController");

router.get("/", allergieController.getAll);
router.get("/:id", allergieController.getById);
router.post("/", allergieController.create);
router.put("/:id", allergieController.update);
router.delete("/:id", allergieController.delete);

module.exports = router;