"use client";

import { createAuthClient } from "better-auth/react";

const client = createAuthClient();

export const { useSession, signOut } = client;

export function signInGoogle(options?: { callbackURL?: string; errorCallbackURL?: string }) {
  return client.signIn.social({
    provider: "google",
    callbackURL: options?.callbackURL,
    errorCallbackURL: options?.errorCallbackURL,
  });
}

export function signInDiscord(options?: { callbackURL?: string; errorCallbackURL?: string }) {
  return client.signIn.social({
    provider: "discord",
    callbackURL: options?.callbackURL,
    errorCallbackURL: options?.errorCallbackURL,
  });
}
