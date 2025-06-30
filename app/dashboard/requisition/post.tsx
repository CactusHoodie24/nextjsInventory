"use server";

import { auth } from "@/lib/auth";
import { requisitionSchema } from "@/lib/zod";
import { prisma } from "@/prisma";

export async function saveRequisition(prevState: any, formData: FormData) {
    const description = formData.get("description") as string;
    const remarks = formData.get("remarks") as string;
    const quantityIssuedStr = formData.get("quantityIssued") as string;
    const quantityIssued = Number(quantityIssuedStr);
    const itemIdStr = formData.get("itemId") as string;
    const itemId = Number(itemIdStr);

    const session = await auth();
    if (!session?.user?.email) {
        console.error("❌ No email found in session");
        return {
            errors: {
                description: '',
                remarks: '',
                quantityIssued: '',
            },
            message: "User not authenticated",
        };
    }

    const user = await prisma.user.findUnique({
        where: { email: session?.user?.email }
    })

    console.log(user)

    console.log("📝 Form values:");
    console.log({ description, remarks, quantityIssued, itemId });


    const result = requisitionSchema.safeParse({
        description,
        remarks,
        quantityIssued,
        itemId
    });

    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        console.log("⚠️ Validation errors:", fieldErrors);

        return {
            errors: {
                description: fieldErrors.description?.[0] || "",
                remarks: fieldErrors.remarks?.[0] || "",
                quantityIssued: fieldErrors.quantityIssued?.[0] || ""
            },
            message: ""
        };
    }

    try {
        if (!user?.id) {
            console.error("❌ User not authenticated.");
            return {
                errors: {
                    description: '',
                    remarks: '',
                    quantityIssued: ''
                },
                message: "User is not authenticated"
            };
        }

        const requisition = await prisma.requisition.create({
            data: {
                description,
                remarks,
                quantityIssued,
                status: "DISPATCHED",
                authorId: user.id,
                itemId
            }
        });

        const item = await prisma.supplyItem.findUnique({
            where: { id: itemId },
        });

        if (!item) {
            throw new Error("Item not found.");
        }

        if (item.quantity < quantityIssued) {
            throw new Error("Cannot issue more than available stock.");
        }

        await prisma.supplyItem.update(
            {
                where: { id: itemId },
                data: {
                    quantity: item?.quantity - quantityIssued
                }
            }
        )

        await prisma.log.create({
            data: {
                action: 'Performed a requisition',
                description: 'Subtracted from the stock',
                itemId: itemId,
                authorId: user.id
            }
        })

        console.log("✅ Requisition created:", requisition);

        return {
            errors: {
                description: '',
                remarks: '',
                quantityIssued: ''
            },
            message: "Requisition was a success"
        };
    } catch (err) {
        console.error("❌ Error creating requisition:", err);

        return {
            errors: {
                description: '',
                remarks: '',
                quantityIssued: ''
            },
            message: "Something went wrong creating the requisition"
        };
    }
}
