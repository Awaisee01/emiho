// import { NextAuthOptions } from 'next-auth';
// import GoogleProvider from 'next-auth/providers/google';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import connectDB from './mongodb';
// import User from '@/models/User';

// export const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: 'credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }

//         await connectDB();
//         const user = await User.findOne({ email: credentials.email });

//         if (!user || !user.password) {
//           return null;
//         }

//         const isPasswordValid = await user.comparePassword(credentials.password);

//         if (!isPasswordValid) {
//           return null;
//         }

//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: user.name,
//           image: user.image,
//         };
//       }
//     })
//   ],
// callbacks: {
//   async signIn({ user, account }) {
//     if (account?.provider === "google") {
//       await connectDB();

//       const existingUser = await User.findOne({ email: user.email });

//       if (!existingUser) {
//         await User.create({
//           name: user.name,
//           email: user.email,
//           image: user.image,
//           provider: "google",
//           profile: {
//             bio: "",
//             location: "",
//             website: "",
//           },
//           subscription: {
//             plan: "Free",
//             status: "active",
//           },
//         });
//       }
//     }
//     return true;
//   },

//   async jwt({ token, user, trigger, session }) {
//     await connectDB();

//     // 🔹 On first login
//     if (user) {
//       const dbUser = await User.findOne({ email: user.email });
//       if (dbUser) {
//         token.id = dbUser._id.toString();
//         token.name = dbUser.name;
//         token.email = dbUser.email;
//         token.image = dbUser.image; // ✅ include image
//         token.subscription = dbUser.subscription || {
//           plan: "Free",
//           status: "active",
//         };
//       }
//     }

//     // 🔹 On client-side update()
//     if (trigger === "update" && session) {
//       const dbUser = await User.findOne({ email: session.user?.email });
//       if (dbUser) {
//         token.name = dbUser.name;
//         token.image = dbUser.image; // ✅ keep in sync
//         token.subscription = dbUser.subscription || token.subscription;
//       }
//     }

//     return token;
//   },

//   async session({ session, token }) {
//     if (session.user) {
//       session.user.id = token.id as string;
//       session.user.name = token.name as string;
//       session.user.email = token.email as string;
//       session.user.image = token.image as string; // ✅ attach image
//       session.user.subscription =
//         token.subscription || { plan: "Free", status: "active" };
//     }
//     return session;
//   },
// },

//   pages: {
//     signIn: '/auth/signin',
//     newUser: '/auth/signup', // ✅ redirect first-time users here
//   },
//   session: {
//     strategy: 'jwt',
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };


// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { scope: "openid email profile" } },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) return null;
        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) return null;
        return { id: user._id.toString(), email: user.email, name: user.name, image: user.image };
      }
    })
  ],
  callbacks: {
    // On sign-in (Google) ensure user doc exists
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        const existing = await User.findOne({ email: user.email });
        if (!existing) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: "google",
            profile: { bio: "", location: "", website: "" },
            subscription: { plan: "Free", status: "active" },
          });
        }
      }
      return true;
    },

    // jwt callback runs on sign-in and subsequent session calls
    async jwt({ token, user, account, profile, trigger, session }) {
      await connectDB();

      // On first sign in, `user` exists — set token fields from DB
      if (user) {
        const dbUser = await User.findOne({ email: (user as any).email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.image = dbUser.image;
          token.subscription = dbUser.subscription || { plan: "Free", status: "active" };
        }
      } else {
        // For subsequent calls (e.g. session.update()), refresh subscription from DB if token.email or token.id exists
        if (token.email || token.id) {
          const dbUser = token.id ? await User.findById(token.id) : await User.findOne({ email: token.email as string });
          if (dbUser) {
            token.subscription = dbUser.subscription || { plan: "Free", status: "active" };
            token.name = dbUser.name;
            token.image = dbUser.image;
            token.email = dbUser.email;
            token.id = dbUser._id.toString();
          }
        }
      }

      return token;
    },

    // session maps token -> session (so client sees token.subscription)
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.subscription = token.subscription || { plan: "Free", status: "active" };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup"
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
