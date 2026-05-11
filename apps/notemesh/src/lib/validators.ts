import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const noteCreateSchema = z.object({
  title: z.string().trim().max(180).optional(),
  content: z.string().max(200000).optional(),
});

export const noteUpdateSchema = z.object({
  title: z.string().trim().max(180).optional(),
  content: z.string().max(200000).optional(),
  isPinned: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

export const tagSchema = z.object({
  name: z.string().trim().min(1).max(40),
  color: z.string().trim().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export const attachmentSchema = z.object({
  fileName: z.string().trim().min(1),
  fileUrl: z.string().trim().min(1),
  fileType: z.string().trim().min(1),
  fileSize: z.number().int().positive(),
});
