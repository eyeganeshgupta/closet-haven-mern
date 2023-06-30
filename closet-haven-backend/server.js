import http from "http";
import app from "./app/app.js";

// create the server
const PORT = 2024;
const server = http.createServer(app);
server.listen(PORT, console.log(`Server is up and running on port ${PORT}`));
