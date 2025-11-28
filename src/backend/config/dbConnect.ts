import mongoose, { Mongoose } from "mongoose";

/**
 * Define a type-safe cache interface for global usage.
 * This prevents "any" and keeps strict typing.
 */
type MongooseCache = {
	conn: Mongoose | null;
	promise: Promise<Mongoose> | null;
};

/**
 * Extend the Node global type to include our cache.
 * MUST use `var` because it re-declares safely across hot reloads.
 */
declare global {
	// eslint-disable-next-line no-var
	var _mongooseCache: MongooseCache | undefined;
}

/**
 * Ensure the cache exists in the global object.
 * Global persists across Next.js hot reloads, unlike module scope.
 */
globalThis._mongooseCache ??= {
	conn: null,
	promise: null,
};

/**
 * Main function to connect to MongoDB.
 * Uses cached connection in dev to avoid connection exhaustion.
 * Automatically retries on failure by resetting cached promise.
 *
 * @returns {Promise<Mongoose>} Mongoose instance
 * @throws {Error} If MONGODB_URI is not defined or connection fails
 */
export const connectDB = async (): Promise<Mongoose> => {
	const cache = globalThis._mongooseCache!;

	// 1. If already connected → reuse it
	if (cache.conn) {
		// console.log("[MongoDB] ♻️  Using existing database connection");
		return cache.conn;
	}

	const MONGODB_URI = process.env.MONGO_URI;

	if (!MONGODB_URI) {
		throw new Error("Missing MONGODB_URI environment variable.");
	}

	// 2. If connection already in progress → wait for it
	if (cache.promise) {
		console.log("[MongoDB] Waiting for existing connection promise...");
	} else {
		console.log("[MongoDB] Creating new database connection...");

		cache.promise = mongoose
			.connect(MONGODB_URI, {
				bufferCommands: false,
				maxPoolSize: 10,
				serverSelectionTimeoutMS: 5000,
				socketTimeoutMS: 45000,
			})
			.then((m) => {
				console.log("[MongoDB] Connected successfully");
				return m;
			});
	}

	// 3. Await connection, cache it, and handle errors
	try {
		cache.conn = await cache.promise;
	} catch (error) {
		// Reset promise to allow retry on next call
		cache.promise = null;
		console.error("[MongoDB] Connection failed:", error);
		throw error;
	}

	return cache.conn;
};

// ========================================
// Connection Event Listeners (Optional)
// ========================================

mongoose.connection.on("connected", () => {
	console.log("[MongoDB] Mongoose connected to database");
});

mongoose.connection.on("error", (err) => {
	console.error("[MongoDB] Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
	console.log("[MongoDB] Mongoose disconnected from database");
});

// Additional monitoring in development
if (process.env.NODE_ENV !== "production") {
	mongoose.connection.on("reconnected", () => {
		console.log("[MongoDB] Mongoose reconnected to database");
	});
}
const DBInstance = { getConnection: () => connectDB() };

export { DBInstance };
