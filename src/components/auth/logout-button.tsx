'use server'

import { signOut } from "@/auth";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
    const router = useRouter();
    return ( 
        <form action={async () => {
            'use server'
            await signOut();
        }}>
            <button type='submit' >
                Sign Out
            </button>
        </form>
     );
}

export default LogoutButton;