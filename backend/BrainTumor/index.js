import * as dotenv from 'dotenv'
dotenv.config({})
import cors from 'cors';
import bootstrap from './src/app.controller.js'
import express from 'express'
const app = express()
const port = process.env.PORT || 8000

app.use(cors());
bootstrap(app , express)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))