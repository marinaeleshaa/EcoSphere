import mongoose, { Connection } from "mongoose";

class DB {
  private static instance: DB; // singleton instance
  private connection?: Connection;

  // private constructor to prevent direct instantiation
  private constructor() {}

  // Get the singleton instance
  public static getInstance(): DB {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance;
  }

  // Connect to MongoDB
  public async connect(uri?: string): Promise<Connection> {
    if (this.connection) return this.connection; // return existing connection

    const mongoUri = uri || process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI is not defined");

    try {
      const { connection } = await mongoose.connect(mongoUri, {
        // optional mongoose options can go here
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as mongoose.ConnectOptions);

      this.connection = connection;

      console.log("✅ Connected to MongoDB");

      this.connection.on("disconnected", () => {
        console.warn("⚠️ MongoDB disconnected");
      });

      this.connection.on("error", (err) => {
        console.error("❌ MongoDB connection error:", err);
      });

      return this.connection;
    } catch (error) {
      console.error(
        "❌ Failed to connect to MongoDB:",
        (error as Error).message
      );
      process.exit(1);
    }
  }

  // Get the existing connection (connects if not yet connected)
  public async getConnection(): Promise<Connection> {
    if (!this.connection) {
      await this.connect();
    }
    return this.connection!;
  }
}

// Export the singleton instance
export const DBInstance = DB.getInstance();
