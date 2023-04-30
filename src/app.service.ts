import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { useSupabaseRowLevelSecurity } from './prismaExtensions/useSupabaseRowLevelSecurity';

@Injectable()
export class AppService {
  // Prisma Client with RLS Policies Enforced
  private readonly rlsPrismaClient = new PrismaClient({
    datasources: {
      db: {
        url: process.env.RLS_DATABASE_URL
      }
    }
  });
  // Prisma Client that Bypasses Any Security Policies (SHOULD BE LIMITED)
  private readonly bypassRlsPrismaClient = new PrismaClient();

  /**
   * Database currently has two entries with the following user_ids
   * 1. b2e41732-ef4d-493e-92aa-9dfdfc2a0c08
   * 2. df0cc8cb-8483-41c4-a361-22070c8848c8
   * @returns string
   */
  async getHello(): Promise<string> {
    console.log("Getting first user profiles")
    const userId1 = 'b2e41732-ef4d-493e-92aa-9dfdfc2a0c08';
    const userId2 = 'df0cc8cb-8483-41c4-a361-22070c8848c8';

    const result = await this.rlsPrismaClient.$extends(useSupabaseRowLevelSecurity({
      claimsFn: () => ({
        sub: userId1,
      })
    })).user_profiles.findMany({
      where: {
        user_id: userId1,
      }
    });
    const noClaimsResult = await this.rlsPrismaClient.user_profiles.findMany({
      where: {
        user_id: userId1,
      }
    });
    const bypassResult = await this.bypassRlsPrismaClient.user_profiles.findMany();

    const myResponse = {
      rlsUserResult: result,
      bypassResult: bypassResult,
      rlsUserWithNoClaims: noClaimsResult,
    }
    console.log('Here are my results:', myResponse);
    return JSON.stringify(myResponse, null, '\t');
  }
}
