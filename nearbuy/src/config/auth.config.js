import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import authService from "@/services/auth.service";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Vendor from "@/models/Vendor";

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
        if (!credentials?.email || !credentials?.password) return null;
        await dbConnect();
        return await authService.validateCredentials(
          credentials.email,
          credentials.password,
        );
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();
        let dbUser = await User.findOne({ email: user.email.toLowerCase() });

        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            email: user.email.toLowerCase(),
            profileImage: user.image,
            provider: "google",
            providerId: account.providerAccountId,
            role: "USER", // Defaults to customer unless updated
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      await dbConnect();
      if (token?.email) {
        const dbUser = await User.findOne({ email: token.email.toLowerCase() });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;

          // Check if vendor exists for this user
          const vendor = await Vendor.findOne({ ownerId: dbUser._id });
          token.vendorId = vendor ? vendor._id.toString() : null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.vendorId = token.vendorId;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
};
