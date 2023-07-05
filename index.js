const express = require('express');
const app = express();
const mongoose = require("mongoose");
const PORT = 8800;
const dotenv = require("dotenv");
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const multer = require('multer');
const path = require("path")

const userRoute = require("./routes/users.js")
const authRoute = require("./routes/auth.js")
const postRoute = require("./routes/posts.js")

app.use(cors());

app.use('/public/assets', express.static(path.join(__dirname, "./public/assets")));//route per accedere ai file

//middleware
app.use(express.json())
//app.use(helmet());//aggiunge o rimuove headers 
//app.use(morgan('common'));//registra richieste http insieme ad altre info, utile per debug


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.post('/api/upload', upload.single("img"), async (req, res) => {
  const URL = req.protocol + "://" + req.get("host")
  try {
    const imgUrl = req.file.filename
    /* res.status(200).send({
      message: "File caricato con successo",
      statusCode: 200,
      imgUrl: `${URL}/public/assets/${imgUrl}`
    }); */
    res.status(200).json({
      img: `${URL}/public/assets/${imgUrl}`
    })
  } catch (error) {
    console.log(error);
  }
});


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


app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
;