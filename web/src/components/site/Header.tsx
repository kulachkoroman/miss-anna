import { getCurrentUser } from "@/lib/auth";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const user = await getCurrentUser();
  return (
    <HeaderClient
      user={user ? { name: user.studentName || user.name, role: user.role } : null}
    />
  );
}
