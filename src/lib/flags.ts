export const OAUTH_ENABLED_SERVER =
  process.env.AUTH_OAUTH_ENABLED?.toLowerCase() === "true";

export const OAUTH_ENABLED_CLIENT =
  process.env.NEXT_PUBLIC_AUTH_OAUTH_ENABLED?.toLowerCase() === "true";
