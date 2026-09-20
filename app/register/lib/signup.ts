"use server";

import { SignupFormSchema, FormState } from "@/lib/definitions";
import * as z from "zod";

export async function signup(state: FormState, formData: FormData) {
  //validation
  const validatedFields = SignupFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  const email = validatedFields.data?.email;
  const password = validatedFields.data?.password;

  if (!validatedFields.success) {
    const errorResult = z.flattenError(validatedFields.error);

    return {
      errors: {
        email: errorResult.fieldErrors.email,
        password: errorResult.fieldErrors.password,
        confirmPassword: errorResult.fieldErrors.confirmPassword,
      },
      values: {
        email: email,
      },
    };
  }

  //regiteration
  // try {
  //   const response = await fetch("http://localhost:5194/api/auth/register", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       email: email,
  //       password: password,
  //     }),
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
}
