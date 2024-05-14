const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const port = 4000;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Define the path to the views directory
const viewsPath = path.join(__dirname, "views");

// Set the views directory
app.set("views", viewsPath);

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/logindemo")
  .then(() => {
    console.log(`Connection successful`);
  })
  .catch((error) => {
    console.error(`Error connecting to the database: ${error.message}`);
  });

const fmSchema = new mongoose.Schema({
  email: String,
  password: String
});

const sg = mongoose.model("sg", fmSchema);

const static_path = path.join(__dirname, "../");
app.use(express.static(static_path));

app.use(express.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
  try {
    const gmMember = new sg({
      email: req.body.email,
      password: req.body.password,
    });
    await gmMember.save();
    res.send("Data saved successfully");
  } catch (error) {
    console.error("Error saving data to the database:", error.message);
    res.status(500).send("Error saving data to the database");
  }
});

app.get("/admin", async (req, res) => {
  try {
    const data = await sg.find();
    res.render("admin", { data });
  } catch (error) {
    console.error("Error fetching data from the database:", error.message);
    res.status(500).send("Error fetching data from the database");
  }
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
