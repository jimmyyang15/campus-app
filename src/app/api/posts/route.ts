import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const data = await db.post.findMany({
    include: {
      user: {
        include: {
          profile: true
        }
      },
      reactions: {
        include: {
          user: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });


  return NextResponse.json({
    data
  })
}

type Payload = {
  title: string;
  content: string;
}

export async function POST(req: Request) {


  const { title, content }: Payload = await req.json();
  const user = await validateRequest()
  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  };
  await db.post.create({
    data: {
      title, 
      content,
      user: {
        connect: {
          id: user.id
        }
      }
    }
  })

  return NextResponse.json({
    status: 201,
    message: "Post created"
  })
}