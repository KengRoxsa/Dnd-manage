import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import bcrypt from "bcryptjs";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      // custom login below.
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }
          const passwordMatch = await bcrypt.compare(password, user.password);
          if(!passwordMatch){
            return null;
          }
          return user;
        } catch (error) {
          console.log("Error:", error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  page: {
    signIn: "/login",
  },
  //ตรงนี้คือส่่งค่าเพิ่มเติม เช่นไวก role บลาๆ
  callbacks: {
    async jwt({ token, user, session }) {
        if (user) {
            return {
                ...token,
                id: user.id,
                role: user.role
                
            }
        }

        return token;
    },
    async session({ session, user, token }) {
        return {
            ...session,
            user: {
                ...session.user,
                id: token.id,
                role: token.role
            }
        }
    }
  }
    }
  

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
// ส่วน export { handler as GET, handler as POST } ทำหน้าที่ export handler นี้ให้ใช้งานจากภายนอกโมดูล และให้ handler นี้สามารถใช้งานได้ทั้งสำหรับ method GET และ POST
