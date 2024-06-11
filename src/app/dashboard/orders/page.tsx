import { currentUser } from "@/lib/auth"

export default async function Orders() {
  const user = await currentUser()

  return <div>{JSON.stringify(user)}</div>
}
