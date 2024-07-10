// task.controller.js
const Task = require('../models/Task.model');

async function updateTodo(req,res){
    try {
        const taskId = req.params.id;
        const todoId = req.params.todoId;
        console.log(taskId);
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const todo = task.todoList.id(todoId);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        todo.isComplete = req.body.isComplete;
        await task.save();

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating todo', error });
    }
}

async function changedTask(req, res) {
  const taskId = req.params.id;
  console.log(taskId);
  try {
    const task = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
}

async function updateTask(req,res) {
  const taskId = req.params.id;
  console.log(taskId);
  try {
    const task = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
}

async function getTasksByUser(req, res) {
    try {
        const userId = req.userId; // Используем req.userId, который добавляется в middleware
        const tasks = await Task.find({ user: userId }).sort({ order: 1 });

        if (!tasks.length) {
            return res.status(404).json({ message: 'Tasks not found' });
        }

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
}

async function createTask(req,res){

        console.log("Creating")
        const userId = req.userId; 

        const task = new Task({
            title: req.body.title,
            description: req.body.description,
            user: userId,
            todoList: req.body.todoList,
            order: req.body.order || 122,  // Если order не передан, устанавливаем его как последний в списке
        });
        await task.save();

        res.status(201).json(task);
   
}

async function deleteTask(req, res) {
    const taskId = req.params.id;
    try {
      await Task.findByIdAndDelete(taskId);
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task', error });
    }
}

async function pinTask(req, res) {
    try {
      const taskId = req.params.id;
      const task = await Task.findById(taskId);
  
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
  
      task.isPinned = !task.isPinned;
      await task.save();
  
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while pinning the task" });
    }
  }
  

async function reorderTasks(req, res) {
    const { tasks } = req.body;
    const bulkOps = tasks.map((task, index) => ({
      updateOne: {
        filter: { _id: task._id },
        update: { order: index }
      }
    }));
  
    try {
      await Task.bulkWrite(bulkOps);
      res.status(200).json({ message: 'Tasks reordered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error reordering tasks', error });
    }
  }

module.exports = { getTasksByUser,updateTodo,createTask,reorderTasks,deleteTask,pinTask,updateTask,changedTask};
