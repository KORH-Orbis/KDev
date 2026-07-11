import NextAuth from "next-auth";
import { authOptions } from "@/modules/auth/lib/nextauth";

export default NextAuth(authOptions);
