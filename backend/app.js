import express from "express";//web framework for node js
import cors from "cors";//cross-origin-rescourse-sharing- B.E. can handle request from diff origins
import { connectDB } from "./DB/Database.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import transactionRoutes from "./Routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";
import stockRoutes from "./Routers/stockRoutes.js";
import adminRoutes from "./Routers/adminRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/v1/stocks", stockRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
