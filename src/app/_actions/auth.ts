import { db } from "@/server/db"

export const userExistsByUsername = async(username:string) => {
    const user = await db.user.findFirst({
        where:{
            username
        }
    });

    return !!user;
}