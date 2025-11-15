import mongoose from "mongoose";

const connectDb = async () => {
	let connection;

	try {
		if (!connection) {
			connection = await mongoose.connect(process.env.MONGO_URI ?? "");
			console.log("connected to db");
		}
	} catch (error) {
		console.error("mongo db connection error:", error);
	}

	return connection;
};

export { connectDb as DB };
