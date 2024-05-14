import { Prisma } from "@prisma/client";

export type PostsWithUser = Prisma.PostGetPayload<{
    include: {
        user:{
            include:{
                profile:true
            }
        },
        reactions:{
            include:{
                user:true
            }
        }
    }
}>

export type ReactionWithUser = Prisma.ReactionGetPayload<{
    include:{
        user:true
    }
}>

export type UserWithProfile = Prisma.UserGetPayload<{
    include: {
        profile: true
    }
}>;

export type CommentWithUser = Prisma.CommentGetPayload<{
    include:{
        user:{
            include:{
                profile:true
            }
        }
    }
}>

export type ClubWithInclude = Prisma.ClubGetPayload<{
    include:{
        request:{
            include:{
                user:true
            }
        }
    }
}>