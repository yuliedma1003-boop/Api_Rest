import { z } from "zod";

const id = z.coerce.number().int().positive();
const telefono = z.string().trim().min(7).max(30);
const correo = z.string().trim().email().max(150);

export const clienteSchema = z.object({
  nombre: z.string().trim().min(2).max(120),
  identificacion: z.string().trim().min(5).max(30),
  telefono,
  correo,
  direccion: z.string().trim().max(200).optional().nullable()
}).strict();

export const mascotaSchema = z.object({
  nombre: z.string().trim().min(1).max(100),
  especie: z.string().trim().min(2).max(60),
  raza: z.string().trim().max(100).optional().nullable(),
  fechaNacimiento: z.coerce.date().optional().nullable(),
  sexo: z.enum(["MACHO", "HEMBRA", "NO_ESPECIFICADO"]),
  clienteId: id
}).strict();

export const veterinarioSchema = z.object({
  nombre: z.string().trim().min(2).max(120),
  registroProfesional: z.string().trim().min(3).max(40),
  especialidad: z.string().trim().min(2).max(100),
  telefono,
  correo
}).strict();

export const citaSchema = z.object({
  fechaHora: z.coerce.date(),
  motivo: z.string().trim().min(3).max(500),
  estado: z.enum(["PROGRAMADA", "CONFIRMADA", "ATENDIDA", "CANCELADA"]).optional(),
  mascotaId: id,
  veterinarioId: id
}).strict();

export const historiaClinicaSchema = z.object({
  fecha: z.coerce.date(),
  diagnostico: z.string().trim().min(3),
  tratamiento: z.string().trim().min(3),
  observaciones: z.string().trim().optional().nullable(),
  mascotaId: id,
  veterinarioId: id,
  citaId: id.optional().nullable()
}).strict();