const express = require("express");
const path = require('path');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

const csvRouter = require("./import/import.router");
dotenv.config();

const PORT = process.env.VPI_APP_PORT || 5000;
const HOST = process.env.VPI_APP_HOST || "localhost";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, 'client/build')));

app.use("/api/import", csvRouter);

// Serve the React app for any unspecified routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the server
app.listen(PORT, HOST, () => {
  console.log("Server is running at port " + PORT + " and host " + HOST + "");
});
