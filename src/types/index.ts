import { Prisma } from "@prisma/client";

export type PostsWithUser = Prisma.PostGetPayload<{
    include: {
        user:{
            include:{
                profile:true
            }
        }
    }
}>

export type UserWithProfile = Prisma.UserGetPayload<{
    include: {
        profile: true
    }
}>