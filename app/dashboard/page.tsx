import { auth } from "@/lib/auth";
import ClientProfile from "./ClientProfile";
import { AppSidebar } from "@/components/app-sidebar";

export default async function Dashboard() {
  const session = await auth();
  return ;
}
