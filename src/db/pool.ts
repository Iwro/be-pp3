import { Pool } from 'pg';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js'

dotenv.config();

export const supabase = createClient(process.env.DATABASE_URL || "", process.env.PUBLIC_ANON_KEY || "")


export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // necesario para Supabase
  },
});