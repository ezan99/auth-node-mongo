const express = require("express");
const app = express();
const cors = require('cors');

const AuthRoutes = require("./routes/AuthRouter");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

// Database connection
mongoose.connect(
    process.env.DB_CONNECTION, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    () => console.log("Connected to DB")
);

// Injecting route from which calling will start
app.use(cors())
app.use(express.json());
app.use("/api/user", AuthRoutes);

app.listen(process.env.PORT || 4500, () => {
    console.log(`Server Started at ${4500}`)
});