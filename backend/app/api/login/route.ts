// we need to use encryption to prevent direct access of a users password to the backend developers or people who can acces the backend
import bcrypt from 'bcrypt'
import prisma from "@/prisma"
import { connectToDb } from "@/utils"
import { NextResponse } from "next/server"

export const POST =async (req:Request) => {
    try {
        let { email, password} = await req.json()

        if(!email || !password){
            return NextResponse.json({error: 'all inputs are required'}, {status: 422})
        }

        await connectToDb()

        const existingUser = await prisma.user.findFirst({where:{email}})

        if(!existingUser){
            return NextResponse.json({error: 'User not registered'}, {status: 401})
        }

        const emailValidation = await bcrypt.compare( password, existingUser.password )

        if(!emailValidation){
            return NextResponse.json({message: 'invalid password'}, {status: 403})
        }

        return NextResponse.json({message: 'User Logged in'}, {status: 200})

    } catch (error: any) {
        console.log(error)
        return NextResponse.json({error: error.message}, {status: 500})
    } finally {
        await prisma.$disconnect()
    }
}


