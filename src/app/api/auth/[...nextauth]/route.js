import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import bcrypt from "bcryptjs";

// Define the authentication configuration
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

// Use NextAuth handler directly to handle requests
const handler = NextAuth(authOptions);

// Export handlers for GET, POST, and OPTIONS methods
export { handler as GET, handler as POST };

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS(req) {
  const allowedOrigins = [
    "https://dnd-manage-ver01.vercel.app",
    "https://dnd-manage-ver01-frontend.vercel.app",
    "https://dnd-manage-ver01-mwysj9xmi-kengroxsas-projects.vercel.app",
  ];
  
  const origin = req.headers.get("origin") || "";
  
  // Return simple preflight response
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}