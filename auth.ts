import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export const auth = () => NextAuth(authOptions);

// Also export the auth config for convenience
export { authOptions }; 