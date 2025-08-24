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
  contrasena: string;
  rol_id: number;
};
type UserResponse = {
  data: User[];
  error: any;
};
export const getUserByEmail = async (email: string): Promise<UserResponse> => {
  const { data, error } = (await supabase
    .from("usuarios")
    .select()
    .eq("email", email)) as UserResponse;

  return { data, error };
};

export const createUser = async (user: {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  contrasena: string;
  rol_id: number;
}) => {
  const hashedPassword = await hashPassword(user.contrasena);
  console.log("CONTRA HASHEADA", hashedPassword);
  
  const { data, error } = await supabase
    .from("usuarios")
    .insert({
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono,
      contrasena: hashedPassword,
      rol_id: user.rol_id,
    })
    .select();

  return { data, error };
};

export const updateUser = async (
  id: number,
  userInfo: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    // contrasena: string;
    rol_id: number;
  }
) => {
  const { data, error } = await supabase
    .from("usuarios")
    .update(userInfo)
    .eq("id", id)
    .select();

  return { data, error };
};

export const deleteUser = async (id: number) => {
  await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
};

export const getProfile = async (id: number) => {
  const { data, error } = await getUserById(id);
  // await supabase
  // .from("usuarios")
  // .select("*")
  // .eq("id", id)
  // .single();

  return { data, error };
};

export const createUserShop = async (user: {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  contrasena: string;
  rol_id: number;
  nombre_taller: string;
  ciudad: string;
  direccion: string;
  barrio: string;
  horario_inicio: number;
  horario_fin: number;
  duracion_turno: number;
  dias_laborales: string[];
}) => {

  const { data: createdUser, error: userError } = await createUser({
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    telefono: user.telefono,
    contrasena: user.contrasena,
    rol_id: user.rol_id})

    if (!createdUser || createdUser.length === 0) throw new Error('No se insertó usuario')

    const userId = createdUser?.[0]?.id;

  const { data: tallerData, error: tallerError } = await supabase
  .from('talleres')
  .insert({
    usuario_id: userId,
    nombre_taller:user.nombre_taller,
    ciudad:user.ciudad,
    direccion:user.direccion,
    barrio:user.barrio,
    horario_inicio:user.horario_inicio,
    horario_fin:user.horario_fin,
    duracion_turno:user.duracion_turno,
    dias_laborales:user.dias_laborales
  })
  .select()
  
  if (tallerError) {console.log(tallerError)}
  if (!tallerData || tallerData.length === 0) throw new Error('No se pudo crear taller '+tallerError)

  // console.log("DATA101", createdUser);
  return {
    usuario: createdUser[0],
    taller: tallerData[0],
  }
};
