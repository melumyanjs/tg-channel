import express from 'express'
import { __dirname } from './../helpers/utils.js';
import MongoDB, { getObjectId } from './../handlers/mongomanager.js';
import exphbs from 'express-handlebars'
import { ifCond, formatTime } from "./js/helpersHbs.js"
import * as path from "path"
import IndexController from './controllers/IndexController.js';
import ChannelController from './controllers/ChannelController.js';
import ApiController from './controllers/ApiController.js';

export const db = new MongoDB('mongodb://localhost:27017', 'tg-stat');
const PORT = process.env.PORT || 5000
const app = new express()

app.engine('hbs', exphbs.engine({ 
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: { ifCond, formatTime }
})); 
app.set('view engine', 'hbs'); 

app.set('views', path.resolve(__dirname, '../showcase/views'))
app.use(express.json())

app.get('/api/data', ApiController.getDataChannel)
app.get('/:channel', ChannelController.view)
app.get('/', IndexController.view)

async function start(){
    try{
        await app.listen(PORT, () => console.log(`Server has been started on ${PORT} ...`))
        await db.connect()
    }catch (e){
        console.log(e)
        await db.disconnect()
    }
}

start()