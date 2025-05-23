import { Request, Response } from "express";
import * as User from "../models/user.model";

export const getUsers = async (_req: Request, res: Response) => {
  const users = await User.getAllUsers();
  res.json(users);
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const user = await User.getUserById(parseInt(req.params.id));
  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }
  res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const user = await User.createUser(req.body);
  res.status(201).json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const user = await User.updateUser(parseInt(req.params.id), req.body);
  res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  await User.deleteUser(parseInt(req.params.id));
  res.status(204).send();
};
