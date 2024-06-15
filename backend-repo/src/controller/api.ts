import { Request, Response } from "express";
import {
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  loginUser as login
} from "../repository/userCollection";
import jwt from 'jsonwebtoken'

import { ApiError } from "../entities/ApiError";
import { authMiddleware } from "../middleware/authMiddleware";

const JWT_SECRET = 'THISISSECRET'; 

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await login(email, password);

    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' }); 

      res.status(200).json({ userId: user.id, token, message: "Login successful" });
    }
  } catch (error) {
    // Tangani error
    console.error("Error in loginUser:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const addData = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const userData = { name, email, password };
    const userId = await addUser(userData);
    res.status(200).send(`User added with ID: ${userId}`);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        error: {
          message: error.message,
          errorCode: error.errorCode,
        },
      });
    } else if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
};

export const fetchUserData = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        error: {
          message: error.message,
          errorCode: error.errorCode,
        },
      });
    } else if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
};

export const fetchUserDataById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        error: {
          message: error.message,
          errorCode: error.errorCode,
        },
      });
    } else if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
};

export const updateUserData = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;
    const userData = { name, email, password };

    // Gunakan middleware authMiddleware di sini
    await authMiddleware(req, res, async () => {
      // Lanjutkan dengan operasi update jika diotorisasi
      const response = await updateUser(userId, userData);
      res.status(200).send(response);
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        error: {
          message: error.message,
          errorCode: error.errorCode,
        },
      });
    } else if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
};