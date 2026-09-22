import * as z from "zod";

export const SigninFormSchema = z.object({
  email: z.email({ error: "Please enter a valid email." }).trim(),
});

export type FormState =
  | {
      errors?: {
        email?: string[];
      };
      message?: string;
      values?: {
        email?: string;
      };
      success: boolean;
    }
  | undefined;
