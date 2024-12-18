const express = require("express");
const authRouter = require('./routers/authRouter')();
const premiseRouter = require('./routers/premiseRouter')();
const typePremiseRouter = require('./routers/typePremiseRouter')();
const rentalRouter = require('./routers/rentalRouter')();
const userRouter = require('./routers/userRouter')();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');


const PORT = 3441 || process.env.PORT;
const app = express();
app.use(cors());

const httpsServer = https.createServer(
    {
        key: fs.readFileSync('./ssl/key.pem', 'utf8'),
        cert: fs.readFileSync('./ssl/cert.pem', 'utf8')
    },
    app
);

const wss = new WebSocket.Server({ server: httpsServer });

wss.on('connection', function connection(ws) {
    console.log('Новое WebSocket-подключение');
    ws.on('message', function incoming(message) {
      	wss.clients.forEach(function each(client) {
        	if (client !== ws && client.readyState === WebSocket.OPEN) {
          		client.send('' + message);
        	}
      	});
    });
  
    ws.on('close', function close() {
      	console.log('WebSocket-подключение закрыто');
    });
});


httpsServer.listen(PORT, ()=>{console.log("Сервер прослушивает запросы на порту: ", PORT)})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/premise', premiseRouter);
app.use('/rental', rentalRouter);
app.use('/type_premise', typePremiseRouter);
app.use('/user', userRouter);

app.use((req, res) => res.status(404).send('Error 404'));
