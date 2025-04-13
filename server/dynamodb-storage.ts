import { 
  type User, type InsertUser,
  type Rsvp, type InsertRsvp,
  type Wish, type InsertWish
} from "@shared/schema";
import { IStorage } from "./storage";
import { dynamoDb, TABLES } from "./dynamodb";
import { 
  PutCommand, 
  GetCommand, 
  ScanCommand, 
  QueryCommand 
} from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export class DynamoDBStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const params = {
      TableName: "users", // We'll keep users in a separate table
      Key: { id }
    };

    try {
      const { Item } = await dynamoDb.send(new GetCommand(params));
      return Item as User | undefined;
    } catch (error) {
      console.error("Error fetching user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const params = {
      TableName: "users",
      IndexName: "UsernameIndex", // Would need to create this secondary index
      KeyConditionExpression: "username = :username",
      ExpressionAttributeValues: {
        ":username": username
      }
    };

    try {
      const { Items } = await dynamoDb.send(new QueryCommand(params));
      return Items && Items.length > 0 ? Items[0] as User : undefined;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      
      // Fallback for local development - scan the full table
      // Not recommended for production due to performance issues
      try {
        const { Items } = await dynamoDb.send(new ScanCommand({ TableName: "users" }));
        return Items?.find(item => item.username === username) as User | undefined;
      } catch (scanError) {
        console.error("Error scanning users table:", scanError);
        return undefined;
      }
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = Date.now(); // Use timestamp as a simple ID generator
    const user: User = { ...insertUser, id };

    const params = {
      TableName: "users",
      Item: user
    };

    try {
      await dynamoDb.send(new PutCommand(params));
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // RSVP methods
  async getAllRsvps(): Promise<Rsvp[]> {
    const params = {
      TableName: TABLES.RSVPS
    };

    try {
      const { Items } = await dynamoDb.send(new ScanCommand(params));
      const rsvps = Items as Rsvp[] || [];
      
      // Sort by createdAt in descending order
      return rsvps.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      return [];
    }
  }

  async getRsvp(id: number): Promise<Rsvp | undefined> {
    const params = {
      TableName: TABLES.RSVPS,
      Key: { id }
    };

    try {
      const { Item } = await dynamoDb.send(new GetCommand(params));
      return Item as Rsvp | undefined;
    } catch (error) {
      console.error("Error fetching RSVP:", error);
      return undefined;
    }
  }

  async createRsvp(insertRsvp: InsertRsvp): Promise<Rsvp> {
    const id = Date.now(); // Use timestamp as a simple ID generator
    const createdAt = new Date();
    
    // Ensure all properties match the Rsvp type
    const rsvp: Rsvp = { 
      ...insertRsvp, 
      id, 
      createdAt,
      message: insertRsvp.message || null,
      meal: insertRsvp.meal || null
    };

    const params = {
      TableName: TABLES.RSVPS,
      Item: rsvp
    };

    try {
      await dynamoDb.send(new PutCommand(params));
      return rsvp;
    } catch (error) {
      console.error("Error creating RSVP:", error);
      throw error;
    }
  }

  // Wish methods
  async getAllWishes(): Promise<Wish[]> {
    const params = {
      TableName: TABLES.WISHES
    };

    try {
      const { Items } = await dynamoDb.send(new ScanCommand(params));
      const wishes = Items as Wish[] || [];
      
      // Sort by createdAt in descending order
      return wishes.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } catch (error) {
      console.error("Error fetching wishes:", error);
      return [];
    }
  }

  async getWish(id: number): Promise<Wish | undefined> {
    const params = {
      TableName: TABLES.WISHES,
      Key: { id }
    };

    try {
      const { Item } = await dynamoDb.send(new GetCommand(params));
      return Item as Wish | undefined;
    } catch (error) {
      console.error("Error fetching wish:", error);
      return undefined;
    }
  }

  async createWish(insertWish: InsertWish): Promise<Wish> {
    const id = Date.now(); // Use timestamp as a simple ID generator
    const createdAt = new Date();
    
    // Ensure all properties match the Wish type
    const wish: Wish = {
      id,
      name: insertWish.name,
      message: insertWish.message,
      createdAt
    };

    const params = {
      TableName: TABLES.WISHES,
      Item: wish
    };

    try {
      await dynamoDb.send(new PutCommand(params));
      return wish;
    } catch (error) {
      console.error("Error creating wish:", error);
      throw error;
    }
  }
}

// Initialize the admin user if none exists
const initAdminUser = async () => {
  const storage = new DynamoDBStorage();
  try {
    const adminUser = await storage.getUserByUsername("admin");
    
    if (!adminUser) {
      await storage.createUser({
        username: "admin",
        password: "weddingadmin2023"
      });
      console.log("Admin user created successfully");
    }
  } catch (error) {
    console.error("Failed to initialize admin user:", error);
  }
};

// Initialize the database
initAdminUser().catch(err => console.error("Failed to initialize admin user:", err));

export const dynamoDBStorage = new DynamoDBStorage();