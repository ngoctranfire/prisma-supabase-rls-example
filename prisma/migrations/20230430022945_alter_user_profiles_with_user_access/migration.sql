/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `user_profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `user_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."user_profiles" ADD COLUMN     "user_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "public"."user_profiles"("user_id");

-- AddForeignKey
ALTER TABLE "public"."user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

------------------------------------------------ START TO ADDITIONAL ITEMS FOR POLICIES ---------------------------------------------------
ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;
CREATE Policy "individual_authorized_user_profile_access"
    on user_profiles for select
    using (auth.uid() = user_id);
