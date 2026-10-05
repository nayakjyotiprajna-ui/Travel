import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/traveltwin';

  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${mongoUri.replace(/:([^@]+)@/, ':****@')}`);
    
    // Set a 4-second timeout for initial connection so we fail-fast to in-memory if local mongod is absent
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (err: any) {
    console.warn(`[Database] Connection to '${mongoUri}' failed: ${err.message}`);
    console.log(`[Database] Bootstrapping embedded MongoDB Memory Server for self-contained execution...`);

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();

      const memoryConn = await mongoose.connect(inMemoryUri);
      console.log(`[Database] Embedded In-Memory MongoDB connected: ${inMemoryUri}`);
      return memoryConn;
    } catch (memErr: any) {
      console.error(`[Database] Could not start embedded MongoDB: ${memErr.message}`);
      console.warn(`[Database] Running in disconnected state; API calls will handle DB errors gracefully.`);
    }
  }
};
