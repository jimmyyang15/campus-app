"use server";

import { lucia, validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export const signOut = async () => {
    try {
      const  session = await validateRequest()
  
      await db.subscription.deleteMany({
        where:{
          userId:session?.id as string
        }
      })
      if (!session) {
        return {
          error: "Unauthorized",
        }
      }
  
      await lucia.invalidateSession(session.id)
  
      const sessionCookie = lucia.createBlankSessionCookie()
  
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )

      return redirect("/auth/signin")
    } catch (error: any) {
      return {
        error: error?.message,
      }
    }
  }