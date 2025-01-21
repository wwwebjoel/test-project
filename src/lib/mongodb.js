import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI; // Ensure this is set in your .env.local

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// This function will handle connecting to MongoDB via Mongoose.
const connectToMongoDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connections[0].readyState) {
    // Use existing database connection
    return;
  }

  // Connect to the database
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log("Connected to MongoDB via Mongoose"))
    .catch(err => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });

  return mongoose.connection;
};

export default connectToMongoDB;
