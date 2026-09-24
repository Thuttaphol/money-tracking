import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:5194/openapi/v1.json",
  output: "lib/api/generated",
  plugins: [
    "@hey-api/typescript",
    "@hey-api/sdk",
    {
      name: "@hey-api/client-next",
      runtimeConfigPath: "./lib/hey-api",
      throwOnError: true,
    },
    "zod",
  ],
});
