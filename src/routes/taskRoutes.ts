import express from 'express';
import taskController from '../controllers/taskController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// POST `/task` - Create a new task
router.post('/task', authMiddleware, taskController.createTask);

// GET `/task/:id` - Retrieve a task by its ID
router.get('/task/:id', authMiddleware, taskController.getTaskById);

// PUT `/task/:id` - Update a specific task
router.put('/task/:id', authMiddleware, taskController.updateTask);

// DELETE `/task/:id` - Delete a specific task
router.delete('/task/:id', authMiddleware, taskController.deleteTask);

// GET `/tasks` - Retrieve all tasks
// router.get('/tasks', authMiddleware, taskController.getAllTasks);


router.get('/tasks', (req, res, next) => {
    if (req.query.assignedTo) {
      // Apply authMiddleware for tasks with assignedTo query
      return authMiddleware(req, res, () => taskController.getTasksByAssignee(req, res));
    } else if (req.query.category) {
      // Apply authMiddleware for tasks with category query
      return authMiddleware(req, res, () => taskController.getTasksByCategory(req, res));
    }
    // If no query parameter is provided, fall through to the next route handler
    next();
  });
  
  // GET `/tasks` without query parameters - Route where authMiddleware is not applied
  router.get('/tasks',authMiddleware, taskController.getAllTasks);

export default router;
