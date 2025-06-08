import { pool, supabase } from "../db/pool";
import { hashPassword } from "../utils/hash.utils";

export const getAllUsers = async () => {
  const { data, error } = await supabase.from("usuarios").select();

  return { data, error };
};

export const getAllMechanics = async () => {
  const { data, error } = await supabase.from("talleres").select();

  return { data, error };
};

export const getUserById = async (id: number) => {
  const { data, error } = await supabase.from("usuarios").select().eq("id", id);

  return { data, error };
};

type User = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  contraseña: string;
  rol_id: number;
};
type UserResponse = {
  data: User[],error:any
};
export const getUserByEmail = async (email: string): Promise<UserResponse> => {
  const { data, error } = await supabase.from("usuarios").select().eq("email", email) as UserResponse;

  return { data, error };
};

export const createUser = async (user: {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  contraseña: string;
  rol_id: number;
}) => {
  const hashedPassword = await hashPassword(user.contraseña)
  const { data, error } = await supabase
  .from('usuarios')
  .insert({ nombre: user.nombre, apellido: user.apellido, email: user.email, telefono: user.telefono, contraseña: hashedPassword, rol_id:user.rol_id })
  .select()

  return {data, error}
};

export const updateUser = async (
  id: number,
  userInfo: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    // contraseña: string;
    rol_id: number;
  }
) => {
  const { data, error } = await supabase
  .from('usuarios')
  .update(userInfo)
  .eq('id', id)
  .select()

  return {data, error}
};

export const deleteUser = async (id: number) => {
  await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
};
