const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const MONGODB_URL = "mongodb+srv://shardabackend:shardabackend@cluster0.dv9kyuf.mongodb.net/?retryWrites=true&w=majority";

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/course');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static('public'));

app.use('/api/', userRoutes);
app.use('/api/', adminRoutes);

mongoose.set('strictQuery', false);

async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

connectToMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose.connection.on('error', (error) => {
  console.error("MongoDB error:", error.message);
});
