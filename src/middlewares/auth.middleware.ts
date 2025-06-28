import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../controllers/user.controller";
import { verifyToken } from "../utils/jwt.utils";

export function verificarToken(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1] || "";
    
    if (!token) {
      res.status(401).json({ message: 'Token no proporcionado' });
    }
  
    try {
      const decoded = verifyToken(token);
        
      req.usuario = decoded;
      next();
    } catch (error) {
      res.status(403).json({ message: 'Token inválido' });
    }
  }