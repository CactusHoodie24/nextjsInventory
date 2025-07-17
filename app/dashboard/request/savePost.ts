'use server'

import { prisma } from "@/prisma"
import { requestSchema } from "@/lib/zod"
import { Priority, RequestType } from "@prisma/client"
import { initialState } from "./savePostState"






export async function savePost(
  prevState: typeof initialState,
  formData: FormData
): Promise<typeof initialState> {
  try {
    // Get values from the form
    const request = formData.get("request") as string
    const remarks = formData.get("remarks") as string
    const priority = formData.get("priority") as string
    const quantityStr = formData.get("quantity") as string
    const quantity = Number(quantityStr)
    const item_idStr = formData.get("item_id") as string
    const item_id = Number(item_idStr)

    // Validate with Zod schema
    const result = requestSchema.safeParse({ request, remarks, priority, quantity, item_id })

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors

      return {
        success: false,
        error: {
          priority: fieldErrors.priority ?? [],
          request: fieldErrors.request ?? [],
          quantity: fieldErrors.quantity ?? [],
          item_id: fieldErrors.item_id ?? [],
          remarks: fieldErrors.remarks ?? []
        }
      }
    }

    const data = result.data

    // Save to database
    await prisma.request.create({
      data: {
        request: data.request as RequestType,
        priority: data.priority as Priority,
        remarks: data.remarks,
        quantityRequired: data.quantity,
        itemId: data.item_id
      }
    })

    return {
      success: true,
      error: {
        priority: [],
        request: [],
        quantity: [],
        item_id: [],
        remarks: []
      }
    }
  } catch (error) {
    console.error("Error saving request:", error)

    return {
      success: false,
      error: {
        priority: [],
        request: [],
        quantity: [],
        item_id: [],
        remarks: []
      }
    }
  }
}
