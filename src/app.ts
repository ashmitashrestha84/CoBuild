import express from "express";
import routes from "./routes";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());


app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is up & running",
    success: true,
    data: null,
  });
});


app.use("/api/v1", routes);
app.post("/api/v1/auth/register-test", (req, res) => {
  res.status(200).json({
    message: "Test route is working!",
  });
});
export default app;
