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
        },
        comments:{
      
            include:{
              user:{
                include:{
                  profile:true
                }
              }
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

export type ClubWithPayload = Prisma.ClubGetPayload<{
    include:{
        request:{
            include:{
                user:true
            }
        },
        members:{
            include:{
                profile:true
            }
        }
    }
}>

export type RequestWithPayload = Prisma.RequestGetPayload<{
    include:{
        user:{
            include:{
                profile:true
            }
        }
    }
}>

export type SubmissionWithPayload = Prisma.SubmissionGetPayload<{
    include:{
        assignment:true,
        user:{
            include:{
                profile:true
            }
        }
    }
}>

export type AssignmentWithPayload = Prisma.AssignmentGetPayload<{
    include:{
        submissions:{
            include:{
                user:{
                    include:{
                        profile:true
                    }
                }
            }
        }
    }
}>

export type InvitationWithPayload = Prisma.InvitationGetPayload<{
    include:{
        club:true,
        sender:{
            include:{
                profile:true
            }
        }
       
    }
}>

