import { DatabaseSession, DatabaseUser, RegisteredDatabaseSessionAttributes, RegisteredDatabaseUserAttributes } from "lucia";
import { db } from "./db";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";

function transformIntoDatabaseSession(raw: SessionSchema): DatabaseSession {
	const { id, userId, expiresAt, ...attributes } = raw;
	return {
		id,
		userId,
		expiresAt,
		attributes
	};
}

function transformIntoDatabaseUser(raw: UserSchema): DatabaseUser {
	const { id, ...attributes } = raw;
	return {
		id,
		attributes
	};
}

interface UserSchema extends RegisteredDatabaseUserAttributes {
	id: string;
}

interface SessionSchema extends RegisteredDatabaseSessionAttributes {
	id: string;
	userId: string;
	expiresAt: Date;
}

class CustomAdapter extends PrismaAdapter<PrismaClient> {
    public async getSessionAndUser(
          sessionId: string
      ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
          const result = await db.session.findFirst({
        where:{
          id:sessionId
        },include:{
          user:{
            include:{
              profile:true,
              club:true,
            }
          }
        }
      })
  
      if(!result) return [null,null]
      const { user,...session}=result;
      if(!user || !session) return [null,null];
  
      return [
        transformIntoDatabaseSession(session),
        transformIntoDatabaseUser(user as any)
      ]
      }
  }
  
 export const adapter = new CustomAdapter(db.session, db.user);