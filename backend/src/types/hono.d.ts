import "hono";

declare module "hono" {
  interface ContextVariableMap {
    user: {
      accessToken: string;
      [key: string]: unknown;
    };
  }
}
