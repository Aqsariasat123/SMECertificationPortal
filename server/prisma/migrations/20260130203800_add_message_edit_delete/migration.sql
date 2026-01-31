-- AlterTable
ALTER TABLE "chat_messages" ADD COLUMN     "deletedForUsers" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "editedAt" TIMESTAMP(3),
ADD COLUMN     "isDeletedForEveryone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isEdited" BOOLEAN NOT NULL DEFAULT false;
