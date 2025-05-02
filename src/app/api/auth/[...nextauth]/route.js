import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const authOptions = {
  providers: [
    CredentialsProvider({

      name: "credentials",
      
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });

          if (!user) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) return null;

          return user;
        } catch (error) {
          console.log("Error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };
    },
  },
};

// --- เพิ่ม CORS headers ---
const handler = NextAuth(authOptions);

const withCORS = (handler) => {
  return async (req) => {
    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "https://dnd-manage-ver01-frontend.vercel.app", // ปรับเป็น domain จริงหากรู้เช่น https://dnd-manage-ver01-frontend.vercel.app
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    const res = await handler(req);

    const origin = req.headers.get("origin") || "*";
    const responseWithCORS = new NextResponse(res.body, res);
    responseWithCORS.headers.set("Access-Control-Allow-Origin", origin);
    responseWithCORS.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    responseWithCORS.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    responseWithCORS.headers.set("Access-Control-Allow-Credentials", "true");

    return responseWithCORS;
  };
};

const wrappedHandler = withCORS(handler);

export { wrappedHandler as GET, wrappedHandler as POST };
