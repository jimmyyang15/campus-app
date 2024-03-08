"use server"

import { db } from "@/server/db"

export const findUserByUsername = async(username:string) => {
    const user = await db.user.findFirst({
        where:{
            username
        }
    });

    return user;
}
export const findUserByEmail = async(email:string) => {
    const user = await db.user.findFirst({
        where:{
            email
        }
    });

    return user;
}

