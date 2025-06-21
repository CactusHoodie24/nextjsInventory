
import { getSupplier } from '@/lib/data'
import React from 'react'
import FormPage from './form';
import { ProgressDemo } from './progress';

const page = async () => {
    const suppliers = await getSupplier();
  return (
    <div>
    <div className='flex ml-[230px] mt-[50px]'>
    <FormPage suppliers={suppliers} />
    </div>
    </div>
    
  )
}

export default page