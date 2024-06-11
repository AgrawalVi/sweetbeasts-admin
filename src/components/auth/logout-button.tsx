import { signOut } from "next-auth/react"

const LogoutButton = () => {
    const onClick = () => {
        signOut()
    }

    return <button onClick={onClick}>Sign Out</button>
}

export default LogoutButton
