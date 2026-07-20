import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const inputIdentifier = credentials.email.toLowerCase().trim();

        // Hardcoded Admin Account Check
        if (inputIdentifier === "nearbuyadmin1" && credentials.password === "123456") {
          return {
            id: "nearbuy-admin-static-id",
            name: "Nearbuy Admin",
            email: "nearbuyadmin1",
            role: "admin",
            phone: "+91 99999 99999",
            picture: "",
          };
        }

        await dbConnect();

        const user = await User.findOne({ email: inputIdentifier });
        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.password) {
          throw new Error("This account is registered via Google OAuth. Please sign in with Google.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          picture: user.picture,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        await dbConnect();
        
        let user = await User.findOne({ email: profile.email.toLowerCase() });
        if (!user) {
          // Register new Google user dynamically
          user = await User.create({
            name: profile.name,
            email: profile.email.toLowerCase(),
            picture: profile.picture || "",
            isGoogleUser: true,
            role: "vendor", // Default role, user can switch or be assigned.
          });
        }
        return true;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      await dbConnect();

      // For initial sign in, attach user details
      if (user) {
        token.id = user.id;
        token.role = user.role;
      } else if (token.email) {
        // Fetch fresh details from DB to keep role/details updated
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
        }
      }

      // Handle session update triggers
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
