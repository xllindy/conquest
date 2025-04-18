// Importing modules
const express = require('express'); 
const path = require('path'); 
const fs = require("fs"); 

// Port for the server
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

// Allow server to accept request from any origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Methods", "GET, POST"); 
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); 
  next(); 
});


// Route to handle POST requests to "/server"
app.post("/server", (request, response) => {
  // Read the content of the data.json file
  fs.readFile("./data.json", 'utf8', (error, data) => {
    if (error) {
      console.error("Error reading file:", error); 
      return response.status(500).json({ error: error }); 
    }

    // Parse the file content to an array of tasks
    const tasks = JSON.parse(data);

    // Create a new task object from the request body
    const task = {
      task: request.body.name, 
      id: request.body.deviceId 
    };

    // Add the new task to the tasks array
    tasks.push(task);

    // Write the updated tasks array back to the file
    fs.writeFile("./data.json", JSON.stringify(tasks, null, 2), 'utf8', (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return response.status(500).json({ error: error });
      }

      // Send the updated tasks array as a response
      response.json({ tasks });
    });
  });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on https://i539663.hera.fontysict.net:${PORT}`);
});
