import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server } from "socket.io";
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { port } from './config/index.js';
import Database from './dbConnection/connection.js';
import userRoutes from './routes/userRoutes.js';
import { openApiSpecification } from './config/swagger.js';

const app = express();
const db = new Database();


var Message = mongoose.model('Message', {
  name: String,
  message: String
});

//Configuración de cors
app.use(cors());

//Lectura de datos en formato json
app.use(express.json());

//routes
app.use('/users', userRoutes);

//Archivo estático
app.use(express.static('./src'));

//Extracción de información
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/messages', async (req, res) => {
  var messages = await Message.find({});
  res.send(messages);
})

app.get('/messages/:user', (req, res) => {
  var user = req.params.user
  Message.find({ name: user }, (err, messages) => {
    res.send(messages);
  })
})

app.post('/messages', async (req, res) => {
  try {
    var message = new Message(req.body);

    var savedMessage = await message.save()
    console.log('saved');

    var censored = await Message.findOne({ message: 'badword' });
    if (censored)
      await Message.remove({ _id: censored.id })
    else
      io.emit('message', req.body);
    res.sendStatus(200);
  }
  catch (error) {
    res.sendStatus(500);
    return console.log('error', error);
  }
  finally {
    console.log('Message Posted')
  }
})

//Documentacion
app.use("/docs", swaggerUi.serve);
app.get("/docs", swaggerUi.setup(openApiSpecification));

//Respuesta localhost
app.get('/', (request, response, error) => {
  response.send('status: ok')
})

const http = createServer(app);
const io = new Server(http, {
  serveClient: true
});

io.on('connection', (socket) => {
  console.log('Un usuario esta conectado')
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
       console.log('A user disconnected');
    });
})

http.listen(port, (error) => {
  if (error) {
    console.log('Server error: Failed');
    process.exit(1);
  }
  console.log(`Server listening port ${port}`)
})

export default app;