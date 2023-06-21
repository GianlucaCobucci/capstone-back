const express = require('express');
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();

app.listen(PORT, () => {
    console.log(`Server avviato sulla porta ${PORT}`);
  });
;