import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { BASE_URL } from './lib/utils';

export const { handlers, auth, signIn, signOut } =
  NextAuth({
    secret: process.env.AUTH_SECRET,
    trustHost: true, // Ensures NextAuth works with remote hosts
    providers: [
      Credentials({
        credentials: {
          email: {
            label: 'Email',
            type: 'email',
          },
          password: {
            label: 'Password',
            type: 'password',
          },
        },
        async authorize(credentials) {
          console.log('Authorizing User...');
          const { email, password } = credentials;
          console.log({ email, password });

          try {
            const response = await fetch(
              `${BASE_URL}/auth/login`,
              {
                method: 'POST',
                headers: {
                  'Content-Type':
                    'application/json',
                },
                body: JSON.stringify({
                  email,
                  password,
                }),
              }
            );

            console.log(
              'Server Response:',
              response
            );

            if (!response.ok) {
              const errorDetails =
                await response.json();
              console.error(
                'Authorization failed:',
                errorDetails.message ||
                  response.statusText
              );
              throw new Error(
                errorDetails.message ||
                  'Invalid credentials'
              );
            }

            const data = await response.json();
            console.log('Parsed Data:', data);

            if (data?.user?.accessToken) {
              return {
                accessToken:
                  data.user.accessToken,
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
                image: data.user.avatar,
              };
            }

            return null;
          } catch (error) {
            console.error(
              'Error during authorization:',
              error
            );
            throw error;
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        // console.log('JWT Callback called');
        if (user) {
          // console.log(
          //   'Adding user data to token:',
          //   user
          // );
          token.accessToken = user.accessToken;
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
          token.role = user.role;
          token.image = user.image;
        } else {
          // console.log(
          //   'No user data passed to JWT callback. Using existing token.'
          // );
        }
        // console.log('Updated Token:', token);
        return token;
      },
      async session({ session, token }) {
        // console.log('Session Callback called');
        // console.log('Existing Session:', session);
        // console.log('Token Data:', token);
        Object.assign(session, {
          id: token.id,
          accessToken: token.accessToken,
          name: token.name,
          email: token.email,
          role: token.role,
          image: token.image,
        });
        // console.log('Updated Session:', session);
        return session;
      },
    },
    session: {
      strategy: 'jwt', // Use JWT for session handling
      maxAge: 30 * 60, // 30 minutes in seconds
    },
    jwt: {
      maxAge: 30 * 60, // 30 minutes in seconds
    },
    // cookies: {
    //   sessionToken: {
    //     name:
    //       process.env.NODE_ENV === 'production'
    //         ? '__Secure-authjs.session-token'
    //         : 'authjs.session-token',
    //     options: {
    //       httpOnly: true,
    //       secure:
    //         process.env.NODE_ENV === 'production', // Only use secure cookies in production
    //       path: '/',
    //       sameSite: 'lax', // Set sameSite to 'lax' or 'strict' based on your needs
    //     },
    //   },
    // },
  });
