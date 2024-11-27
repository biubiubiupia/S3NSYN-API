import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth-routes.js";
import goalsRoutes from "./routes/goals-routes.js";

const app = express();

const { PORT, BACKEND_URL, CORS_ORIGIN } = process.env;
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Welcome to S3NSYN!");
});

app.use("/", authRoutes);
app.use("/goals", goalsRoutes);


app.listen(PORT, () => {
    console.log(`Server running at ${BACKEND_URL}:${PORT}`);
});