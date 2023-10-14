import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define a custom type that extends Request
interface AuthenticatedRequest extends Request {
  userId?: number; // Add the 'userId' property
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  // console.log("req.headers.authorization", req.headers.authorization)
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      // console.log('decoded', decoded)
      // console.log('error', err)
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Cast `decoded` to an object with a `userId` property
    const decodedObject: { userId: number } = decoded as any;

    // Set the user ID in the request
    req.userId = decodedObject.userId;

    next();
  });
};
