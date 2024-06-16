import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const user = await validateRequest();
    if (!user) {
      return NextResponse.json({
        error: "Unauthorized"
      }, {
        status: 401
      })
    }
    const data = await db.post.findUnique({
      where: {
        id: params.postId
      },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        reactions: true,
        comments: {
          orderBy: {
            createdAt: "desc"
          },
          include: {
            user: {
              include: {
                profile: true
              }
            }
          }
        }
      }
    })


    return NextResponse.json({
      data
    })
  } catch (error) {
    return new NextResponse("Internal server error", {
      status: 500
    })
  }

}


export async function DELETE(req: NextRequest, { params }: { params: { postId: string } }) {
  try {
    await db.post.delete({
      where: {
        id: params.postId
      }
    });
    const user = await validateRequest()
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    };
    return NextResponse.json({
      status: 201,
      message: "Post Deleted"
    })
  } catch (error) {
    return new NextResponse("Internal server error", {
      status: 500
    })
  }

}