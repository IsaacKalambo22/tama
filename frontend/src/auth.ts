import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { BASE_URL } from './lib/utils';

export const { handlers, auth, signIn, signOut } =
  NextAuth({
    secret: process.env.AUTH_SECRET,
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

            // Log the raw response for debugging
            console.log(
              'Server Response:',
              response
            );

            if (!response.ok) {
              // Handle specific HTTP errors
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
              };
            }

            return null; // Fallback for missing user data
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
        console.log('JWT Callback called');
        console.log({ user, token });
        // Store the accessToken in the token object
        if (user?.accessToken) {
          token.accessToken = user.accessToken;
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
          token.role = user.role;
        }
        return token;
      },
      async session({ session, token }) {
        console.log('JWT Callback called');
        console.log({ session, token });
        Object.assign(session, {
          id: token.id,
          accessToken: token.accessToken,
          name: token.name,
          email: token.email,
          role: token.role,
        });
        return session;
      },
    },
  });
