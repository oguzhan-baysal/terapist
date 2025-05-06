import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongodb";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email ve şifre gerekli");
        }

        const { db } = await connectToDatabase();
        
        // Önce kullanıcılar koleksiyonunda ara
        let user = await db.collection("users").findOne({ email: credentials.email });
        let isTherapist = false;

        // Kullanıcı bulunamazsa terapistler koleksiyonunda ara
        if (!user) {
          user = await db.collection("therapists").findOne({ email: credentials.email });
          if (user) {
            isTherapist = true;
          }
        }

        if (!user) {
          throw new Error("Kullanıcı bulunamadı");
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Geçersiz şifre");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: isTherapist ? "therapist" : "user"
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as "user" | "therapist" | "admin";
      }
      return session;
    }
  },
  pages: {
    signIn: "/giris",
    error: "/giris"
  }
}; 