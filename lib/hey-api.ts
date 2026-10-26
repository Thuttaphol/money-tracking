import type { CreateClientConfig } from "./api/generated/client.gen";

export const createClientConfig: CreateClientConfig = (config) => {
  const baseUrl =
    typeof window === "undefined" ? process.env.CAPTAIN_API : "/backend";

  if (!baseUrl) {
    throw new Error("CAPTAIN_API is required on the server");
  }

  return {
    ...config,
    baseUrl,
    credentials: "include",
  };
};
