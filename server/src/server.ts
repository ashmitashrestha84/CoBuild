import "dotenv/config";

import app from "./app";
import ENV_CONFIG from "./config/env.config";
import { connectDatabase } from "./config/db.config";

const PORT = ENV_CONFIG.PORT;
const DB_URI = ENV_CONFIG.DB_URI;

connectDatabase(DB_URI);

const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
