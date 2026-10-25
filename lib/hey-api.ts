import type { CreateClientConfig } from "./api/generated/client.gen";

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseUrl: `${process.env.NEXT_PUBLIC_CAPTAIN_API}`,
  credentials: "include",
});
