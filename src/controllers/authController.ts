import { Request, Response } from 'express';
import { User } from '../entities/User';
import jwt from 'jsonwebtoken';
import AppDataSource from '../db/data-source';

const userRepository = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = new User();
    user.username = username;
    user.password = password; // Remember to hash the password
    await userRepository.save(user);
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await userRepository.findOne({ where: { username: username } });

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Verify the password (implement your own password hashing)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};
