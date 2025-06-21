import { AppSidebar } from "@/components/app-sidebar";
import RegisterComponent from "@/components/login";
import TabsDemo from "@/components/register";
import { prisma } from "@/prisma";
import Image from "next/image";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  const isLoggedIn = !!session;

  return (
    <>
      {isLoggedIn && <AppSidebar isLoggedIn={true} />}
      <div className="flex justify-center items-center h-screen ml-[500px]">
      {!isLoggedIn && <RegisterComponent />}
      </div>
    </>
  );
}

