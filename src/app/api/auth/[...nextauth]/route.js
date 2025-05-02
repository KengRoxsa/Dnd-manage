import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import bcrypt from "bcryptjs";

// NextAuth config
const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });

          if (!user) {
            throw new Error("No user found");
          }

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            throw new Error("Incorrect password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error("Authentication failed");
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
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
};

const allowedOrigins = [
  "https://dnd-manage-ver01.vercel.app",
  "https://dnd-manage-ver01-frontend.vercel.app",
  "https://dnd-manage-ver01-mwysj9xmi-kengroxsas-projects.vercel.app",
];

function getCORSHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

export async function OPTIONS(req) {
  const origin = req.headers.get("origin") || "*";
  return new Response(null, {
    status: 200,
    headers: getCORSHeaders(origin),
  });
}

export async function GET(req) {
  const origin = req.headers.get("origin") || "*";
  const response = await NextAuth(req, authOptions);
  Object.entries(getCORSHeaders(origin)).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export async function POST(req) {
  const origin = req.headers.get("origin") || "*";
  const response = await NextAuth(req, authOptions);
  Object.entries(getCORSHeaders(origin)).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}
