import { pool } from '../db/pool';

export const getAllUsers = async () => {
  const res = await pool.query('SELECT * FROM usuarios');
  return res.rows;
};

export const getUserById = async (id: number) => {
  const res = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
  return res.rows[0];
};

export const createUser = async (user: {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  contraseña: string;
  rol_id: number;
}) => {
  const res = await pool.query(
    'INSERT INTO usuarios (nombre, apellido, email, telefono, contraseña, rol_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [user.nombre, user.apellido, user.email, user.telefono, user.contraseña, user.rol_id]
  );
  return res.rows[0];
};

export const updateUser = async (id: number, fields: Partial<{
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  contraseña: string;
  rol_id: number;
}>) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  const sets = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const query = `UPDATE usuarios SET ${sets} WHERE id = $${keys.length + 1} RETURNING *`;

  const res = await pool.query(query, [...values, id]);
  return res.rows[0];
};

export const deleteUser = async (id: number) => {
  await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
};