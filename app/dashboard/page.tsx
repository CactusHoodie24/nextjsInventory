import { auth } from "@/lib/auth";
import ClientProfile from "./ClientProfile";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import Headers from './headers'
import ChartComponent from "@/components/chart-bar-multiple";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function Dashboard() {
  const session = await auth();
   // ⏳ Simulate network delay (e.g., 2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return (
    <div className="ml-[20px] mt-5">
      <div className="flex gap-1.5">
 <Headers />
 <Headers />
 <Headers />
 <Headers />
 </div>
 <div className="flex mt-3.5">
  <Card className="w-[600px]">
  <ChartComponent />
  </Card>
<Card className="ml-1.5 w-[370px]">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
 </div>
    </div>
  )
}
