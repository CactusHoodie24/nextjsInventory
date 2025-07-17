import Headers from "./headers";
import ChartComponent from "@/components/chart-bar-multiple";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMostUsedItem } from "@/lib/MostUsedItem";
import { MostRequisitions } from "@/lib/OfficeWithMost";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { outofStock } from "@/lib/OutofStocl";
import { fulfillmentRate, pendingRequest } from "@/lib/fulfillment";
import { getChartData } from "@/lib/chartData";

export default async function Dashboard() {
  const item = await getMostUsedItem()
  const suppliers = await MostRequisitions()
  const stock = await outofStock()
  const rate = await fulfillmentRate()
  const Pending = await pendingRequest()
  const itemName = item?.findName?.name;
const quantity = item?.quantityUsed?.quantityIssued;
const supplierName = suppliers?.officeName?.name
const amount = suppliers?.quantityIssued.quantityIssued
const stockItem = stock?.name 
const pendingArray = Pending
const chartData = await getChartData()

  return (
    <div className="ml-[20px] mt-5">
      <div className="flex gap-1.5">
      <Headers itemName={itemName} quantity={quantity} title="Most Used Item" />
<Headers supplierName={supplierName} amount={amount} title="Most Requisitions" />
<Headers rate={rate.rate} title="Fulfilment Rate" />
<Headers itemName={stockItem} amount={stock?.quantity} title="Out Of Stock" />
      </div>
      <div className="flex mt-3.5">
        <Card className="w-[600px]">
          <ChartComponent chartData={chartData} />
        </Card>
        <Card className="ml-1.5 w-[370px]">
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
               {pendingArray?.map(item => (
       <AccordionItem key={item.id} value={item.status}>
    <AccordionTrigger>{item.officeName}</AccordionTrigger>
    <AccordionContent className="flex gap-1.5">
      <p>Date: {item.createdAt.toLocaleString()}</p>
      <p>Item: {item.item.name}</p>
      <p>Quantity: {item.quantityRequired}</p>
    </AccordionContent>
  </AccordionItem>
     ))}
</Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
