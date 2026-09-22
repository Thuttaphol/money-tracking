"use server";

import { SigninFormSchema, FormState } from "@/definitions/signin-definitions";
import * as z from "zod";

export async function validateSignin(email: string | null): Promise<FormState> {
  //validation
  const validatedFields = SigninFormSchema.safeParse({
    email: email ?? "",
  });

  const emailData = validatedFields.data?.email;

  if (!validatedFields.success) {
    const errorResult = z.flattenError(validatedFields.error);

    return {
      success: false,
      errors: {
        email: errorResult.fieldErrors.email,
      },
      values: {
        email: emailData,
      },
    };
  }

  return { success: true };
}
