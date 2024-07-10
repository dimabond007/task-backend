const express = require("express");
const { getTasksByUser, updateTodo, createTask, reorderTasks, deleteTask, pinTask, updateTask, changedTask } = require("../controllers/task.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/",verifyToken, getTasksByUser);
router.post("/",verifyToken,createTask);
router.patch("/:id",verifyToken, updateTask);
router.delete('/:id',verifyToken,deleteTask);
router.put('/reorder', verifyToken, reorderTasks);
router.put("/:id",verifyToken,changedTask);
router.put("/:id/pin", verifyToken, pinTask);



router.put("/:id/todo/:todoId",verifyToken, updateTodo);

// router.put("/todo",verifyToken, updateTodo);

module.exports = router;