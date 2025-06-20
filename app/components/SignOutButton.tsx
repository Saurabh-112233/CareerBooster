'use client';
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth.action";

export default function SignOutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    console.log("User logged out");
    router.push("/sign-in");
  };

  return (

  <button onClick={handleLogout} 
  className="absolute top-9 right-10 md:top-6 
  md:right-6 bg-neutral-300 text-black text-sm font-semibold px-4 py-2 
  rounded-2xl shadow-lg hover:bg-neutral-400 transition">
    Sign Out
  </button>

  );
}
