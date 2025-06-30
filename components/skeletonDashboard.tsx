import ChartComponent from "@/components/chart-bar-multiple";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "./ui/skeleton";

export default async function SkeletonDashboard() {
  return (
    <div className="ml-[20px] mt-5">
      <div className="flex gap-1.5">
        {'abcd'.split('').map((item, index)=> (
           <Card className="w-[240px] h-[150px]" key={index}>
  <CardHeader>
   <Skeleton className="h-4 w-[100px]" />
  </CardHeader>
  <CardContent>
     <Skeleton className="h-3 w-full mb-2" />
  <Skeleton className="h-3 w-1/2" />
  </CardContent>
</Card>
        ))}
 </div>
 <div className="flex mt-3.5">
  <Card className="w-[600px]">
  <ChartComponent />
  </Card>
<Card className="ml-1.5 w-[370px]">
  <CardHeader>
    <Skeleton className="h-4 w-[100px]" />
  </CardHeader>
  <CardContent>
         <Skeleton className="h-3 w-full mb-2" />
  <Skeleton className="h-3 w-1/2" />
  </CardContent>
</Card>
 </div>
    </div>
  )
}
