'use client'
import React, { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from 'axios';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Progress } from "@/components/ui/progress"
import clsx from 'clsx';
import { deliverNoteFormData, deliverNoteSchema } from '@/lib/zod';

interface User {
     id: string;
    name: string;
    address: string;
    email: string;
    phonenumber: string;
    manager: string;
    city: string;
}

interface Application {
    suppliers: User[]
}

const FormPage = ({suppliers}: Application) => {
    const [details, setDetails] = useState<deliverNoteFormData>({
        name: '',
        quantity: 0,
        unit: '',
        category: '',
        description: ''
    })
    const [selectedSupplierId, setSelectedSupplierId] = useState('')
    const [success, setSucces] = useState(false)
    const [error, setError]  = useState(false)
    const [errors, setErrors] = useState<Partial<Record<keyof deliverNoteFormData, string>>>({})
    const [isPending, setIsPending] = useState(false)
    const {data: session, status} = useSession()
    const [progress, setProgress] = React.useState(13)

   
    

    const payload = {
        email: session?.user?.email,
        supplierId: selectedSupplierId,
        name: details.name,
        unit: details.unit,
        description: details.description,
        category: details.category,
        quantity: details.quantity
    }

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { id, value } = e.target;

  const updatedForm = {
    ...details,
    [id]: id === 'quantity' ? Number(value) : value,
  };

  setDetails(updatedForm);

  const result = deliverNoteSchema.safeParse(updatedForm);

  if (!result.success) {
    const fielderrors = result.error.flatten().fieldErrors;

    setErrors({
      name: fielderrors.name?.[0] ?? '',
      quantity: fielderrors.quantity?.[0] ?? '',
      description: fielderrors.description?.[0] ?? '',
      category: fielderrors.category?.[0] ?? '',
      unit: fielderrors.unit?.[0] ?? '',
    });
  } else {
    setErrors({});
  }
};


    const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const show = e.target.value;
        setSelectedSupplierId(show)
    }

    const handleSubmmit =  async (e: React.FormEvent<HTMLFormElement>) => {
       e.preventDefault()
       setIsPending(true)
       if(!selectedSupplierId || !details.category || !details.description || !details.name || !details.quantity || !details.unit) {
        toast.error('Error Sending Data', {
          description: 'Please try Again completing the form',
          duration: 5000
        })
        setIsPending(false)
        return;
       }
       try {
        const res = await axios.post('http://localhost:3000/api/delivery-note', payload)
        console.log(payload)
        if(res.status === 200) {
           toast.success("Form Sent successfully!", {
    description: `Details ${details.name} ${details.quantity}!`,
    duration: 5000,
  });
  setProgress(66)
  setSucces(true);
  setIsPending(false);
  // Optional: reset form
  setDetails({
    name: '',
    quantity: 0,
    unit: '',
    category: '',
    description: ''
  });
  setSelectedSupplierId('');
        } 
     else {
        toast.error('Error Sending Data', {
        description: `Trying Sending the Data Again`,
        duration: 5000,
        }
            
        )
            setSucces(false)
            setIsPending(false)
        }
       
       } catch (error) {
        console.log('There was an error sending the data', error)
       } finally {
        setIsPending(false)
       }
       
    }

  return (
    <div className='flex flex-col'>
      <div className='mb-10'>    
        <Progress value={progress} />
        <div className='flex gap-32 mb-2.5'>
         <div className='w-[32px] h-[32px] rounded-full bg-transparent border-2 pt-1 pl-2.5 mt-2'>1</div>
         <div className={clsx(
  'w-[32px] h-[32px] rounded-full border-2 pt-1 pl-2.5 mt-2',
  progress === 66 ? 'bg-green-600' : 'bg-transparent'
)}>2</div>
        </div>
            <Card className="w-[900px] max-w-sm">
      <CardHeader>
        <CardTitle>This is the Delivery Note Process</CardTitle>
        <CardDescription>
          Enter the appropriate information
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmmit}>
        <div className="flex gap-6">
           <div>
            <div className="grid gap-2">
                 <Label htmlFor="supplier-select">Supplier</Label>
        <select id="supplier-select" onChange={handleSupplierChange}> 
            <option value="">Select a supplier</option>
            {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
            ))}
        </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Name</Label>
              <Input
                id="name"
                type="name" value={details.name} onChange={handleChange}
                placeholder="Security Paper"
                required
              />
            {errors.name && <p className='text-red-500'>{errors.name}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" value={details.quantity} onChange={handleChange} required />
            {errors.quantity && <p className='text-red-500'>{errors.quantity}</p>}
            </div>
            </div>
            <div>
            <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
              <Input id="unit" type="text" value={details.unit} onChange={handleChange} required />
             {errors.unit && <p className='text-red-500'>{errors.unit}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
              <Input id="category" type="text" value={details.category} onChange={handleChange} required />
            {errors.category && <p className='text-red-500'>{errors.category}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="unit">Description</Label>
              <Input id="description" type="text" value={details.description} onChange={handleChange} required />
             {errors.description && <p className='text-red-500'>{errors.description}</p>}
            </div>
              <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'submmiting' : 'Submit'}
        </Button>
          </div>
          </div>
            </form>
        </CardContent>
    </Card>
    </div>
    </div>
  )
}

export default FormPage