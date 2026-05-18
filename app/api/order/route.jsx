import { NextResponse } from "next/server";
import { desc, eq, getTableColumns } from "drizzle-orm";
import { db } from "../../../configs/db";
import { cartTable, orderTable, productsTable } from "../../../configs/schema";
import { Resend } from 'resend';
import { currentUser } from "@clerk/nextjs/server";
import EmailOrder from "../../../emails/email";
import { useUser } from "@clerk/nextjs";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {

    try {

        //Get Order Detail + Email
        const { email, orderDetail } = await req.json();

        //Validation
        if (!email || !orderDetail || orderDetail.length === 0) {
            return NextResponse.json(
                { error: "Missing email or order details" },
                { status: 400 }
            );
        }

        //Insert record to order tables
        let orderList = [];
        orderDetail.forEach((order) => {
            orderList.push({
                email: email,
                productId: order.productId
            });
        });

        const result = await db.insert(orderTable)
            .values(orderList)
            .returning();

        //Delete user Cart Item
        const deleteResult = await db.delete(cartTable)
            .where(eq(cartTable.email, email));

        //send confirmation email
        const sendEmailResult = await SendEmail(email,orderDetail); 
        

        return NextResponse.json({
            message: "Order created successfully",
            result
        });

    } catch (error) {

        console.log("ORDER API ERROR:", error);

        return NextResponse.json(
            {
                error: "Failed to create order",
                details: error.message
            },
            { status: 500 }
        );
    }
}
//used to send email to user
const SendEmail = async (email, orderDetail) => {

    const result = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Order Confirmation Receipt',
        react: <EmailOrder orderDetail={orderDetail} />,
    });

    return result;
}

//used to get order list

export async function GET(req){

    const user= await currentUser();

    const result=await db.select({
        ...getTableColumns(productsTable)
    }).from(orderTable)
    .innerJoin(productsTable,eq(productsTable.id,orderTable.productId))
    .where(eq(orderTable.email, user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(orderTable.id))

    return NextResponse.json(result)
    
}