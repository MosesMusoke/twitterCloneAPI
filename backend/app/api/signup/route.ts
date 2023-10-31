// we need to use encryption to prevent direct access of a users password to the backend developers or people who can acces the backend
import bcrypt from 'bcrypt'
import prisma from "@/prisma"
import { connectToDb } from "@/utils"
import { NextResponse } from "next/server"

export const POST =async (req:Request) => {
    try {
        let {name, email, password} = await req.json()

        if(!name || !email || !password){
            return NextResponse.json({error: 'all fields are required'}, {status: 422})
        }

        await connectToDb()

        const existingUser = await prisma.user.findFirst({where:{email}})
        if(existingUser) return NextResponse.json({message: 'User already registered. Please Login'}, {status: 200})

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({data:{name, email, password:hashedPassword}})
        return NextResponse.json({user}, {status: 200})
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({error: error.message}, {status: 500})
    } finally {
        await prisma.$disconnect()
    }
}


