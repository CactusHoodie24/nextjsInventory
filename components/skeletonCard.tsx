'use client'
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
import { Skeleton } from './ui/skeleton';
export default function SkeletonAppBar() {
    return (
        <div className='ml-[230px] mt-[100px]'>
             <Card className="w-[900px] max-w-sm">
      <CardHeader  className='flex-row gap-4 items-center'>
       <Skeleton className='w-12 h-12 rounded-full' />
       <Skeleton className='h-6 flex-grow' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-4 flex-grow mt-4'/>
         <Skeleton className='h-4 flex-grow mt-4'/>
         <Skeleton className='h-4 w-1/2 mt-4'/>
        </CardContent>
        <CardFooter>
        <Skeleton className='h-10 w-28' />
        </CardFooter>
    </Card>
        </div>
    )
}