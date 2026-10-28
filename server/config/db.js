// ──────────────────────────────────────────────────────────────
//  config/db.js — MongoDB connection using Mongoose
//
//  This function connects to MongoDB using the URI stored in
//  the .env file. Call it once when the server starts.
//
//  ⚠️  MongoDB will only connect when ALL of these are true:
//    1. MONGODB_URI in .env is a valid Atlas connection string
//    2. Your IP is whitelisted in MongoDB Atlas → Network Access
//    3. The username/password in the URI are correct
//    4. The cluster is active (not paused on free tier)
// ──────────────────────────────────────────────────────────────

import mongoose from 'mongoose';

// We export this so the health controller can report DB status
export let dbStatus = 'disconnected';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || '';

  // Detect if the URI is still the placeholder from .env.example
  const isPlaceholder = !uri || uri.includes('<username>') || uri.includes('<password>');

  if (isPlaceholder) {
    dbStatus = 'not configured';
    console.warn('⚠️  MONGODB_URI is not set or is still the placeholder value.');
    console.warn('   Database features will not work until you add a real URI.');
    console.warn('   → Edit server/.env and set MONGODB_URI to your MongoDB Atlas string.');
    return; // Keep server running for health-check testing
  }

  try {
    dbStatus = 'connecting';

    // Mongoose connection options — suppress deprecation warnings
    const connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Fail fast (5s) instead of waiting 30s
    });

    dbStatus = 'connected';
    console.log(`✅ MongoDB connected: ${connection.connection.host}`);

  } catch (error) {
    dbStatus = 'error';

    // Print a helpful, actionable error message
    console.error('❌ MongoDB connection failed:', error.message);
    console.warn('');
    console.warn('   Common fixes:');
    console.warn('   1. Go to MongoDB Atlas → Network Access → Add your current IP');
    console.warn('   2. Check your username & password in the MONGODB_URI');
    console.warn('   3. Make sure your cluster is not paused (free tier pauses after 60 days)');
    console.warn('   4. Add the database name at the end of your URI:');
    console.warn('      mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/smarthire');
    console.warn('');
    console.warn('   ✔ Server will keep running — /api/health works without MongoDB.');
    console.warn('   ✔ Routes that need the database will fail until the DB is connected.');

    // ── We do NOT call process.exit(1) here ──────────────────
    // The server stays alive so you can still test the health
    // endpoint and other routes that don't need MongoDB.
  }
};

export default connectDB;
