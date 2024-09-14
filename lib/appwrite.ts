"use server";

import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

// Define types for better type safety
interface AppwriteClients {
  account: Account;
  database?: Databases;
  user?: Users;
}

// Create Appwrite session client
export async function createSessionClient(): Promise<AppwriteClients> {
  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  // Retrieve session from cookies
  const session = cookies().get("appwrite-session");

  // Handle missing session error
  if (!session || !session.value) {
    console.error("No session found for the current user.");
    throw new Error("No session. Please log in.");
  }

  // Set session in the Appwrite client
  client.setSession(session.value);

  // Return an object with only the Account service
  return {
    account: new Account(client),
  };
}

// Create Appwrite admin client
export async function createAdminClient(): Promise<AppwriteClients> {
  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  // Return an object with Account, Databases, and Users services
  return {
    account: new Account(client),
    database: new Databases(client),
    user: new Users(client),
  };
}
