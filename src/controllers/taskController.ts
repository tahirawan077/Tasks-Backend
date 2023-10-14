import { Request, Response } from 'express';
import AppDataSource from '../db/data-source';
import { Task } from '../entities/Task';

const taskRepository = AppDataSource.getRepository(Task);

const taskController = {
  createTask: async (req: Request, res: Response) => {
    try {
      const newTask = taskRepository.create(req.body);
      const savedTask = await taskRepository.save(newTask);
      res.status(201).json(savedTask);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getTaskById: async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      const task = await taskRepository.findOne({ where: { id: taskId } });

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
      } else {
        res.json(task);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateTask: async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      const taskToUpdate = await taskRepository.findOne({ where: { id: taskId } });

      if (!taskToUpdate) {
        res.status(404).json({ error: 'Task not found' });
      } else {
        const updatedTask = taskRepository.merge(taskToUpdate, req.body);
        const savedTask = await taskRepository.save(updatedTask);
        res.json(savedTask);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteTask: async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      const taskToDelete = await taskRepository.findOne({ where: { id: taskId } });

      if (!taskToDelete) {
        res.status(404).json({ error: 'Task not found' });
      } else {
        await taskRepository.remove(taskToDelete);
        res.sendStatus(204);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getAllTasks: async (req: Request, res: Response) => {
    try {
      const tasks = await taskRepository.find({
        take: parseInt(req.query.limit as string, 10) || 10, // Number of records to retrieve
        skip: parseInt(req.query.offset as string, 10) || 0, // Offset to skip records
        order: {
          id: 'DESC'
        },
      });
      console.log("tasks", tasks);
      res.json(tasks);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getTasksByAssignee: async (req: Request, res: Response) => {
    try {
      const assignedTo = req.query.assignedTo as string;
      const tasks = await taskRepository.find({ where: { assignedTo: assignedTo } });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getTasksByCategory: async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string;
      const tasks = await taskRepository.find({ where: { category: category } });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

export default taskController;
