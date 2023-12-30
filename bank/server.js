import 'dotenv/config';
import express from "express";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import cors from 'cors'
const app = express();

// cors middleware
app.use(cors())

//Middleware for JSON parsing
app.use(express.json());

// users Routes
app.use("/api/v1/users", userRoutes);

// Error handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
