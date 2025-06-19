require('dotenv').config();

const express = require("express");
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const sequelize = require("./config/database");
require("./models/associations");
const otpRoutes = require("./routes/otp.routes");
const authRoutes = require("./routes/auth.routes");
const forgotRoutes = require("./routes/forgot.routes");
const routes = require("./routes/index");

const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 3600000,
    }
  })
);

// Mount OTP routes
app.use("/api/otp", otpRoutes);
// Mount authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/forgot", forgotRoutes);
// Mount other API routes
app.use("/api", routes);

// Serve EJS views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve React build
app.use(express.static(path.join(__dirname, 'views', 'build')));

// Render home page
app.get('/', (req, res) => {
  res.render('index', { message: "Welcome to the React + EJS App!" });
});

// Catch-all to serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'build', 'index.html'));
});

// Sync database and start server
sequelize.sync()
  .then(() => console.log("Database synced successfully"))
  .catch((err) => console.error("Database sync failed:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
