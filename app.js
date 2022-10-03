// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const { isAuthenticated } = require("./middleware/jwt.middleware");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
// const allRoutes = require("./routes");
// app.use("/api", allRoutes);

// const moviesRouter = require('./routes/movies.routes'); // <== has to be added
// app.use('/api', moviesRouter); // <== has to be added
const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

const roomRouter = require("./routes/room.routes");
app.use("/api", isAuthenticated, roomRouter);

const itemRouter = require("./routes/item.routes");
app.use("/api", isAuthenticated, itemRouter);



const index = require('./routes/index.routes'); // <== already included
app.use('/', index); // <== already included


require("./error-handling")(app);

module.exports = app;
