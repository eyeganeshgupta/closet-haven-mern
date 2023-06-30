import http from "http";
import app from "./app/app";

// create the server
const PORT = 7000;
const server = http.createServer(app);
server.listen(PORT, console.log(`Server is up and running on port ${PORT}`));
