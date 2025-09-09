import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import propertyRouter from './routes/propertyRoutes.js';
import messageRoutes from "./routes/messageRoutes.js";
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import statsRoutes from './routes/statsRoutes.js';
import adminRoutes from "./routes/adminRoutes.js";
import savedSearchRoutes from "./routes/savedSearchRoutes.js";

const app = express();
const port = process.env.PORT || 8081;

connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://hostel-finder-frontend.onrender.com",
  "https://hostelfinder-silk.vercel.app",
  process.env.CLIENT_URL,
];

// 🟢 Correct __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// 🟢 Fix: CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server calls & health checks
      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true, // ✅ allow cookies
  })
);

// 🟢 Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🟢 API endpoints
app.get('/', (req, res) => res.send('API working'));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/property', propertyRouter);
app.use("/api/messages", messageRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/saved-searches", savedSearchRoutes);

// 🟢 Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${port}`);
});
