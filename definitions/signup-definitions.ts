import * as z from "zod";

export const SignupFormSchema = z
  .object({
    email: z.email({ error: "Please enter a valid email." }).trim(),
    password: z
      .string()
      .min(8, { error: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
      .regex(/[0-9]/, { error: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        error: "Contain at least one special character.",
      })
      .trim(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type FormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
      };
      message?: string;
      values?: {
        email?: string;
      };
    }
  | undefined;
