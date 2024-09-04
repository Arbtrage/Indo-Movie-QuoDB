import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import prisma from "../../../libs/prisma";


export const POST = async (req: NextRequest) => {
    const data = await req.json();
    const { email, password } = data;

    const isUser = await prisma.user.findFirst({
        where: {
            email
        }
    })

    const hashedPassword = bcrypt.hashSync(password, 10);

    if (isUser) throw new Error("User with this email already exists");
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        }
    })

    return NextResponse.json(user);
};

export const GET = async (req: NextRequest) => {
   
    return NextResponse.json({message:"Hello World"});
}