import { z } from "zod";

export const HealthSchema = z.object({
  ok: z.boolean(),
  service: z.string(),
  time: z.string(),
});

export const CreateFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
});

export const UpdateFormSchema = CreateFormSchema.partial().extend({
  status: z.enum(["active", "archived"]).optional(),
});

export const FormFieldSchema = z.object({
  type: z.enum(["text", "select", "checkbox", "rating"]),
  name: z.string().min(1),
  label: z.string().nullable().optional(),
  required: z.boolean().optional(),
  ord: z.number().optional(),
  config: z.any().optional(),
});

export const UpsertFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  status: z.string().optional(),
  fields: z.array(FormFieldSchema),
});

export const CreateSubmissionSchema = z.object({
  payload: z.record(z.any()),
});

export function nowIso() {
  return new Date().toISOString();
}
