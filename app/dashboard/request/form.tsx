'use client'

import React, { ChangeEvent, useState } from "react"
import { Input } from "@/components/ui/input"
import { savePost} from "./savePost"
import { initialState } from "./savePostState"


type Thing = {
  name: string
  id: number
  description: string
  unit: string
  category: string
}

type Application = {
  item: Thing[]
}

export default function Request({ item }: Application) {
  // useActionState replaces useFormState
  const [state, action, isPending] = React.useActionState(savePost, initialState)

  const [priority, setPriority] = useState('')
  const [request, setRequest] = useState('')
  const [selectedItemId, setSelectedItemId] = useState('')

  const handlePriorityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value)
  }

  const handleRequestChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRequest(e.target.value)
  }

  const handleItemChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedItemId(e.target.value)
  }

  return (
    <div className="ml-[230px] mt-[50px]">
      <form action={action} className="space-y-4">
        <select name="priority" value={priority} onChange={handlePriorityChange}>
          <option value="">Select Priority Level</option>
          <option value="HIGH">HIGH</option>
          <option value="LOW">LOW</option>
        </select>
        {state.error.priority?.[0] && <p className="text-red-500 text-sm">{state.error.priority[0]}</p>}

        <select name="request" value={request} onChange={handleRequestChange}>
          <option value="">Select Request</option>
          <option value="RESTOCK">Restock</option>
          <option value="MAINTANANCE">Maintenance</option>
        </select>
        {state.error.request?.[0] && <p className="text-red-500 text-sm">{state.error.request[0]}</p>}

        <select name="item_id" value={selectedItemId} onChange={handleItemChange}>
          <option value="">Select Item</option>
          {item.map(i => (
            <option key={i.id} value={i.id}>{i.name}</option>
          ))}
        </select>
        {state.error.item_id?.[0] && <p className="text-red-500 text-sm">{state.error.item_id[0]}</p>}

        <Input type="text" name="quantity" placeholder="Quantity" />
        {state.error.quantity?.[0] && <p className="text-red-500 text-sm">{state.error.quantity[0]}</p>}

        <Input type="text" name="remarks" placeholder="Remarks" />
        {state.error.remarks?.[0] && <p className="text-red-500 text-sm">{state.error.remarks[0]}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit"}
        </button>

        {state.success && <p className="text-green-600 text-sm mt-2">Request submitted successfully!</p>}
      </form>
    </div>
  )
}
