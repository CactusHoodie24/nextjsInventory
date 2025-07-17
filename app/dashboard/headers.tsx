import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Application {
  itemName?: string;
  quantity?: number | null;
  title: string;
  supplierName?: string;
  amount?: number | null;
  rate?: string
}

export default function Header({
  itemName,
  quantity,
  title,
  amount,
  supplierName,
  rate
}: Application) {
  const displayName = itemName ?? supplierName ?? "No data";
  const displayValue = quantity ?? amount ?? rate ?? "N/A";

  return (
    <Card className="w-[240px] h-[150px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{displayName}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold">{displayValue}</p>
      </CardContent>
    </Card>
  );
}
