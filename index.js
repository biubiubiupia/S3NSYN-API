import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

const { PORT, BACKEND_URL, CORS_ORIGIN } = process.env;
