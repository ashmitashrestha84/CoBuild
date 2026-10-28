import express from "express";
import routes from "./routes";

const app = express();

// Parse incoming JSON
app.use(express.json());

// Mount all routes
app.use("/api/v1", routes);
app.post("/api/v1/auth/register-test", (req, res) => {
  res.status(200).json({
    message: "Test route is working!",
  });
});
export default app;
