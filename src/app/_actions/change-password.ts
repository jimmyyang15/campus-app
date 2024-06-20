"use server"

import { ChangePasswordSchema, ChangePasswordSchemaType } from "@/lib/schemas/auth";
import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { compare, hash } from "bcrypt";

export const changePassword = async (values: ChangePasswordSchemaType) => {

    const validatedFields = ChangePasswordSchema.safeParse(values);
    if (!validatedFields.success) {
        return {
            error: "Invalid fields!",
        };
    }

    const { curPass, newPassword } = validatedFields.data;
    const hashedNewPassword = await hash(newPassword,12);
    const userSession = await validateRequest();

    const user = await db.user.findUnique({
        where: {
            id: userSession?.id
        }
    });
    const validPass =await compare(curPass, user?.hashedPassword as string);
    const samePass =await compare(newPassword, user?.hashedPassword as string);
    if (!validPass) {
        return {
            error: "Current password is not correct"
        };
    }

    if(samePass) {
        return {
            error:"Please use another password"
        }
    }
    await db.user.update({
        where: {
            id: user?.id
        },
        data: {
            hashedPassword:hashedNewPassword
        }
    })

    return {
        success: `Password changed`
    }

}