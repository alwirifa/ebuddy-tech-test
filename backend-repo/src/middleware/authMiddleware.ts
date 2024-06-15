

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'THISISSECRET';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decodedToken.userId;

    (req as any).user = { userId }; 
    next();
  } catch (error) {
    res.status(401).send('Unauthorized: Invalid token');
  }
};
