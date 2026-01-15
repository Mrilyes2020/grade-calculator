import { 
  gradeSubmissions, 
  type GradeSubmission, 
  type InsertGradeSubmission,
  type User, 
  type InsertUser,
  users
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Grade submission methods
  getGradeSubmissionBySessionId(sessionId: string): Promise<GradeSubmission | undefined>;
  createGradeSubmission(submission: InsertGradeSubmission): Promise<GradeSubmission>;
  updateGradeSubmission(sessionId: string, submission: Partial<InsertGradeSubmission>): Promise<GradeSubmission | undefined>;
  getAllGradeSubmissions(): Promise<GradeSubmission[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getGradeSubmissionBySessionId(sessionId: string): Promise<GradeSubmission | undefined> {
    const [submission] = await db
      .select()
      .from(gradeSubmissions)
      .where(eq(gradeSubmissions.sessionId, sessionId));
    return submission || undefined;
  }

  async createGradeSubmission(submission: InsertGradeSubmission): Promise<GradeSubmission> {
    const [created] = await db
      .insert(gradeSubmissions)
      .values(submission)
      .returning();
    return created;
  }

  async updateGradeSubmission(sessionId: string, submission: Partial<InsertGradeSubmission>): Promise<GradeSubmission | undefined> {
    const [updated] = await db
      .update(gradeSubmissions)
      .set({ ...submission, updatedAt: new Date() })
      .where(eq(gradeSubmissions.sessionId, sessionId))
      .returning();
    return updated || undefined;
  }

  async getAllGradeSubmissions(): Promise<GradeSubmission[]> {
    return await db.select().from(gradeSubmissions);
  }
}

export const storage = new DatabaseStorage();
