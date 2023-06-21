const express = require('express');
const app = express();
const mongoose = require("mongoose");
const PORT = 8800;
const dotenv = require("dotenv");
const helmet = require('helmet');
const morgan = require('morgan');

const userRoute = require("./routes/users.js")
const authRoute = require("./routes/auth.js")
const postRoute = require("./routes/posts.js")

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Errore di connessione al server DB'));
db.once('open', () => {
  console.log('Server DB connesso correttamente');
});

//middleware
app.use(express.json())
app.use(helmet());
app.use(morgan('common'));

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)

app.listen(PORT, () => {
    console.log(`Server avviato sulla porta ${PORT}`);
  });
;