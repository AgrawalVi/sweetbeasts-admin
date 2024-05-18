import Google from 'next-auth/providers/google';
import Instagram from 'next-auth/providers/instagram';

import type { NextAuthConfig } from "next-auth"
 
export default { providers: [Google, Instagram] } satisfies NextAuthConfig