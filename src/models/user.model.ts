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

export const getMechanicById = async (id: number) => {
  const { data, error } = await supabase.from("talleres").select().eq("id", id);

  return { data, error };
};

export const obtenerHorariosDisponibles = async (tallerId: number, fecha: string) => {
  const { data, error } = await getMechanicById(tallerId) as any;
  const occupied = await obtenerHorariosOcupados(tallerId, fecha) as any;

  const horasOcupadas = occupied.data?.map((t: { hora: Date; })=>{return t.hora});
  
  let horario_inicio = data[0].horario_inicio;
  let horario_fin = data[0].horario_fin;
  // let duracion_turno = data[0].duracion_turno;

  let horarioInicioParaSumar = new Date(`${fecha}T${horario_inicio}`).getHours()
  let horarioFinParaSumar = new Date(`${fecha}T${horario_fin}`).getHours()
  
  const disponibles: string[] = [];

  while (horarioInicioParaSumar < horarioFinParaSumar) {  
    let horaString = formatNumberToTime(parseInt(horario_inicio))

    if (!horasOcupadas.includes(horaString)) {    
      disponibles.push(horaString);
    }    

    horarioInicioParaSumar = horarioInicioParaSumar+1
    horario_inicio = parseInt(horario_inicio)+1
  
    }
  
  return disponibles;
};

export const obtenerHorariosOcupados = async (tallerId: number, fecha: string) => {
  const { data, error } = await supabase
    .from("turnos")
    .select()
    .eq("taller_id", tallerId).eq("fecha", fecha);
  
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

export const createAppointment = async (usuario_id:number,taller_id:number, fecha: string, hora: string) => {
  const { data, error } = await supabase
    .from("turnos")
    .insert({
      cliente_id: usuario_id,
      taller_id: taller_id,
      fecha: fecha,
      hora: hora
    }).select();
    
    return { data, error };

}

export const getAppointmentsByUser = async(usuario_id:number)=>{
  const { data, error } = await supabase
    .from("turnos")
    .select()
    .eq("cliente_id", usuario_id);

  return { data, error };

}

function formatNumberToTime(hour: number): string {
  // Ensure the hour is an integer between 0 and 23 (optional validation)
  if (hour < 0 || hour > 23) {
    throw new Error('Hour must be between 0 and 23');
  }
  
  const hh = Math.floor(hour).toString().padStart(2, '0');
  return `${hh}:00:00`;
}