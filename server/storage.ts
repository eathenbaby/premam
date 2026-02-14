import { db } from "./db";
import { creators, messages, type Creator, type InsertCreator, type Message, type InsertMessage } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Creators
  createCreator(creator: InsertCreator): Promise<Creator>;
  getCreatorBySlug(slug: string): Promise<Creator | undefined>;
  getCreatorById(id: number): Promise<Creator | undefined>;
  
  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesForCreator(creatorId: number): Promise<Message[]>;
}

export class DatabaseStorage implements IStorage {
  async createCreator(insertCreator: InsertCreator): Promise<Creator> {
    const [creator] = await db.insert(creators).values(insertCreator).returning();
    return creator;
  }

  async getCreatorBySlug(slug: string): Promise<Creator | undefined> {
    const [creator] = await db.select().from(creators).where(eq(creators.slug, slug));
    return creator;
  }

  async getCreatorById(id: number): Promise<Creator | undefined> {
    const [creator] = await db.select().from(creators).where(eq(creators.id, id));
    return creator;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async getMessagesForCreator(creatorId: number): Promise<Message[]> {
    return await db.select()
      .from(messages)
      .where(eq(messages.creatorId, creatorId))
      .orderBy(desc(messages.senderTimestamp));
  }
}

export const storage = new DatabaseStorage();
