// import mongoose from "mongoose";

// const isConnected: {
//   connect?: number | null;
// } = {};

// async function dbConnect() {
//   console.log(process.env.MONGO_URI, "mongouri");

//   if (isConnected.connect) {
//     console.log("database is already connected");
//     return;
//   }
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI!,{
//         dbName:"Time-Table"
//     });
//     console.log("database is connected successfuly", conn.connection.host);
//     isConnected.connect = conn.connection.readyState;
//   } catch (error: any) {
//     console.log("database connection error ", error.message);
//   }
// }

// export default dbConnect;


import mongoose from "mongoose";

// TypeScript typing for isConnected
const isConnected: { connect?: number | null } = { connect: null };

async function dbConnect() {
  // Ensure environment variable is set
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI environment variable is not defined.");
    throw new Error("MONGO_URI environment variable is missing");
  }

  // Log the URI (for debugging)


  // Check if already connected
  if (isConnected.connect) {
    console.log("Database is already connected");
    return;
  }

  try {
    // Connect to the MongoDB database
    const conn = await mongoose.connect(process.env.MONGO_URI!, {
      dbName: "Time-Table",  // Ensure the dbName is correct
    });
    
    console.log("Database connected successfully:", conn.connection.host);
    
    // Set the connection status to indicate success
    isConnected.connect = conn.connection.readyState;
  } catch (error: any) {
    console.error("Database connection error:", error);  // Log the full error object
    throw new Error("Failed to connect to the database");
  }
}

export default dbConnect;
