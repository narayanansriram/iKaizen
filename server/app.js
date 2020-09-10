const env = require("./config/environment");
const express = require("express");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const passport = require("passport");
const configurePassport = require("./config/passport");
const usersRouter = require("./controllers/users");
const entriesRouter = require("./controllers/entries");
const habitsRouter = require("./controllers/habits");

// link to MongoDB by setting up a Mongoose connection
mongoose.connect(env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const port = env.PORT || 3000;

// parse incoming request bodies formatted in JSON
app.use(express.json());

// configure sessions
app.use(
  session({
    secret: env.SESSION_SECRET,
    cookie: {
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      secret: env.SESSION_STORE_SECRET,
    }),
  })
);

// configure authentication
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// load routers into main application
app.use("/api/users", usersRouter);
app.use("/api/entries", entriesRouter);
app.use("/api/habits", habitsRouter);

app.listen(port, () => {
  console.log(`Serving application on port ${port}`);
});