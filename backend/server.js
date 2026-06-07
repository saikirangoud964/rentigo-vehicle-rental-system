require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const adminRoutes = require("./src/routes/adminRoutes");

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await connectDB();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
});
