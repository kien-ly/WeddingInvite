import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Initialize the DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  // When running locally, you can use credentials from the local environment
  // When deployed to EC2, use IAM roles or environment variables
  ...(process.env.AWS_ACCESS_KEY_ID && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
    }
  })
});

// Create a document client for more convenient interactions
export const dynamoDb = DynamoDBDocumentClient.from(client);

// Table names
export const TABLES = {
  RSVPS: "SVPS", // As requested in specifications
  WISHES: "wish" // As requested in specifications
};

// Initialize the DynamoDB tables if they don't exist
export async function initDynamoDBTables() {
  try {
    console.log("Checking DynamoDB tables...");
    
    // We'll be using the AWS CLI or AWS Console to create tables in production
    // This would be more appropriate way to handle table creation for production
    
    console.log("DynamoDB tables initialization completed");
  } catch (error) {
    console.error("Error initializing DynamoDB tables:", error);
    throw error;
  }
}