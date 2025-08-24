import { NextFunction, Request, Response } from "express";
import * as User from "../models/user.model";
import { comparePassword } from "../utils/hash.utils";
import { signToken, verifyToken } from "../utils/jwt.utils";

export const getUsers = async (_req: Request, res: Response) => {
  const { data, error } = await User.getAllUsers();

  res.json(data);
};

export const getMechanics = async (_req: Request, res: Response) => {
  const { data, error } = await User.getAllMechanics();

  res.json(data);
};

export const getUser = async (req: Request, res: Response) => {
  const {data, error} = await User.getUserById(parseInt(req.params.id));

  if (error) {
    res.status(404).json({ message: "Usuario no encontrado" });
    return;
  }
  res.json(data);
};

export const createUser = async (req: Request, res: Response) => {
  const {data, error} = await User.createUser(req.body);
  if (error) {
    res.status(400).json({error: error})
  } else {
    res.status(201).json(data);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const user = await User.updateUser(parseInt(req.params.id), req.body);
  res.json(user);
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, contrasena } = req.body;
  const usuario = await User.getUserByEmail(email)
  console.log(usuario);
  
  if (usuario.data?.length == 0) {
    res.status(401).json({ message: 'Usuario no encontrado' });
  } 
  // const userInputPass = usuario.data;

  const contrasenaValida = await comparePassword(contrasena, usuario.data[0].contrasena)
  // res.status(215).json(usuario.data[0].contrasena || usuario)
  console.log(contrasenaValida, usuario.data[0].contrasena, contrasena);
  
  if (!contrasenaValida) {
    res.status(401).json({ message: 'contrasena incorrecta' });
  }

  const token = signToken(
    { id: usuario.data[0].id, rol_id: usuario.data[0].rol_id, email: usuario.data[0].email, telefono: usuario.data[0].telefono }
  );

  res.status(200).json({token})
}

export const deleteUser = async (req: Request, res: Response) => {
  await User.deleteUser(parseInt(req.params.id));
  res.status(204).send();
};

export const getProfile = async (req: Request, res: Response) => {
  // @ts-ignore → para acceder a req.usuario (set por el middleware)
  const user = req.usuario;
  
  const profile = await User.getProfile(user.id)
  res.status(200).json(profile)
  // try {
    // const { data, error } = await supabase
    //   .from("usuarios")
    //   .select("*")
    //   .eq("id", user.id)
    //   .single();

    // if (error) {
    //   return res.status(500).json({ message: "Error al obtener perfil", error: error.message });
    // }

    // return res.json({ perfil: data });
  // } catch (err: any) {
  //   return res.status(500).json({ message: "Error interno", error: err.message });
  // }
};

export const createUserShop = async (req: Request, res: Response) => {
  const {usuario, taller} = await User.createUserShop(req.body);

  
  if (!usuario || !taller) {
    res.status(400).json({error: "Hubo un error"})
  } else {
    res.status(201).json(taller);
  }
}; 

export interface AuthRequest extends Request {
  usuario?: any;
}

