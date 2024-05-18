import { auth, signOut } from "@/auth"

const SettingsPage = async () => {
  const session = await auth()

  return (
    <>
      <div>{JSON.stringify(session)}</div>
      <form
        action={async() => {
            'use server'
            await signOut({
            redirectTo: '/auth/login',
        })
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </>
  )
}

export default SettingsPage
