"use client"

import { toast } from "sonner"
import { usePathname } from "next/navigation"
import { ChangeEvent, useActionState, useEffect, useState } from "react"
import { saveRequisition } from "./post"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type thing = {
  name: string
  quantity: number
}

type item = {
     id: number;
  name: string;
  totalQuantity: number;
}

interface Application {
  info: thing[],
  items: item[]
}

const initialState = {
  errors: {
    description: '',
    status: '',
    remarks: '',
    quantityIssued: ''
  },
  message: ''
}


const FormRequisition = ({ info, items }: Application) => {
  const pathname = usePathname()
  const [state, action, isPending] = useActionState(saveRequisition, initialState)
  const [selectedName, setSelectedName] = useState('')
  const [quantityIssued, setQuantityIssued] = useState<string>('')
  const [availableStock, setAvailableStock] = useState<number>(0)
  const [selectedItemId, setSelectedItemId] = useState<string>('');

useEffect(() => {
  if (pathname?.includes('/dashboard/requisition') && info.length > 0) {
    info.forEach((item, index) => {
      setTimeout(() => {
        toast('Stock Info', {
          description: `${item.name}: ${item.quantity}`,
          duration: 4000,
        });
      }, index * 2000); // Delay each toast by 0.5s
    });
  }
}, [pathname, info]);

const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedId = e.target.value;
  setSelectedItemId(selectedId);

  const matchedItem = items.find(item => item.id.toString() === selectedId);
  const quantity = matchedItem?.totalQuantity ?? 0;

  setQuantityIssued(quantity.toString());
  setAvailableStock(quantity);
};


function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
   const input = e.target.value;
  const number = Number(input);

  // Allow empty string (user clearing field), or if number is within bounds
  if (input === "" || number <= availableStock) {
    setQuantityIssued(input);
  }
}

  return (
     <Card className="w-[900px] max-w-sm">
      <CardHeader>
        <CardTitle>This is the Requisition Process</CardTitle>
        <CardDescription>
          Enter the appropriate information
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
    <form action={action}>
      <div className="flex flex-col gap-3.5">
        <div>
          <Label htmlFor="description">Description</Label>
    <Input id="description" type="text" name="description" placeholder="description" />
    {state?.errors?.description && <h2 className="text-red-500">{state?.errors.description}</h2>}
    </div>
    <div>
      <Label htmlFor="remarks">Remarks</Label>
    <Input id="remarks" type="text" name="remarks" placeholder="remarks" />
    {state?.errors?.remarks && <h2 className="text-red-500">{state.errors.remarks}</h2>}
    </div>
    <div>
      <Label htmlFor="QuantityIssued">Quantity Issued</Label>
    <Input id="QuantityIssued" type="number" name="quantityIssued" value={quantityIssued} onChange={handleQuantityChange} placeholder="Quantity Issued" />
    {state?.errors?.quantityIssued && <h2 className="text-red-500">{state.errors.quantityIssued}</h2>}
    </div>
    <div>
      <Label htmlFor="item">Item</Label>
    <select id="item" name="itemId" value={selectedItemId} onChange={handleChange}>
  <option value="">Select Option</option>
  {items.map(item => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))}
</select>
    {state?.errors?.quantityIssued && <h2 className="text-red-500">{state.errors.quantityIssued}</h2>}
    </div>
    <Button className="w-full" type="submit" disabled={isPending}>{isPending ? 'submitting' : 'submit'}</Button>
    {state.message && <h2 className="text-green-500">{state.message}</h2>}
    </div>
    </form>
     </CardContent>
    </Card>
  )
}

export default FormRequisition
