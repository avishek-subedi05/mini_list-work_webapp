// Import required modules
const express = require("express"); // Express.js for creating the server and handling routes
const path = require("path"); // Path module to handle file paths
const fs = require("fs"); // File system module to read/write files
const app = express(); // Create an instance of the Express app

// Set EJS as the view engine to render dynamic HTML files
app.set("view engine", "ejs");

// Serve static files (like CSS, JS, images) from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse URL-encoded form data (from forms)
app.use(express.urlencoded({ extended: true }));

// GET route for the home page
app.get("/", function (req, res) {
    // Read the 'files' directory to get the list of files
    fs.readdir("./files", function (err, files) {
        // Render the 'index' EJS view and pass the list of files to it
        res.render("index", { files: files });

    });
});

app.get("/file/:filename", function (req, res) {
    // Read the contents of a specific file
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {

        // Render the 'show' EJS view and pass the file contents to it
        res.render("show", { filename: req.params.filename, filedata: filedata });


    });
});



app.get("/edit/:filename", function (req, res) {
    // Read the contents of a specific file
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {

        // Render the 'edit' EJS view and pass the file contents to it
        res.render("edit", { filename: req.params.filename, filedata: filedata });


    });
});

app.post("/edit/:filename", function (req, res) {
    // Extract the old file name from URL parameter
    const oldname = `./files/${req.params.filename}`;
    // Extract the new file name from the form input
    const newName = `./files/${req.body.new}`;

    // Check if the file name is being changed
    if (oldname !== newName) {
        // Rename the file
        fs.rename(oldname, newName, function (err) {
            if (err) {
                console.error("Error renaming file:", err);
                return res.status(500).send("Error renaming file");
            }
            console.log("File renamed successfully");

            // After renaming, update the content of the newly named file
            fs.writeFile(newName, req.body.details, function (err) {
                if (err) {
                    console.error("Error writing file:", err);
                    return res.status(500).send("Error writing file");
                }
                console.log("File content updated successfully");
                // Redirect to home page after successful update
                res.redirect("/");
            });
        });
    } else {
        // If the file name is not changing, just update its content
        fs.writeFile(newName, req.body.details, function (err) {
            if (err) {
                console.error("Error writing file:", err);
                return res.status(500).send("Error writing file");
            }
            console.log("File content updated successfully");
            res.redirect("/");
        });
    }
});


app.post("/create", function (req, res) {
    // Create a new text file using the form's 'title' (removing spaces) as the filename
    // and the 'details' as the file content
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function (err) {
        // After creating the file, redirect back to the home page
        res.redirect("/");
    });
});

// Start the server on port 3000 and log a success message
app.listen(3000, function () {
    console.log("It's working on http://localhost:3000");

});
