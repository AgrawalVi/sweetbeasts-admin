import { usePathname } from 'next/navigation';
import authConfig from './auth.config';
import NextAuth from 'next-auth';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;

    console.log("IS LOGGED IN: ", isLoggedIn);

    console.log("ROUTE: ", req.nextUrl.pathname);
})

export const config = {

    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}