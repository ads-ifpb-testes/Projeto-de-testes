const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const router = require(path.resolve(__dirname, 'src', 'routes', 'router'));
const app = express();
const port = 3000;

//SWAGGER
const swaggerDefinition = {
  openapi: '3.0.0',
  info:{
    title:'API REST Express para um website onde mostra um fórum de interações entre usuarios.',
    version: '1.0.0',
    description: 'É um site de interação proposto para permitir aos usuários criar um perfil personalizável com foto e fazer postagens por tópicos na página inicial da aplicação. Cada postagem pode conter comentários e inclui um link para visitar o perfil do autor.',
    license:{
      name: 'Licenciado sob GPL.',
      url: 'https://github.com/ifpb-cz-ads/pw1-2023-1-projeto-forum',
    }
  },
  servers:[
    {
      url:'http://localhost:3000',
      description:'Servidor de desenvolvimento',
    },
    {
      url:'https://projeto-forum.onrender.com/',
      description:'Servidor de produção'
    },
  ],
};

const option = {
  swaggerDefinition,
  apis: ['./src/routes/userAPI.js', './src/routes/postsAPI.js', './src/routes/commentsAPI.js',]
};

const swaggerSpec = swaggerJSDoc(option);

// DATABASE
const database = require(path.resolve(__dirname, 'src', 'database', 'mongo'));
const dbConn = 'Database connected';
database.connect()
  .then(() => {
    console.log(dbConn);
    app.emit(dbConn);
  }).catch(err => console.log(err));;
const { sessionUser } = require(path.resolve(__dirname, 'src', 'middlewares', 'sessionMiddleware'));
app.use(database.sessionOptions);
app.use(database.flash());
app.use(sessionUser);

// USER
const msgMiddleware = require(path.resolve(__dirname, 'src', 'middlewares', 'msgMiddleware'));
app.use(msgMiddleware);

// EXPRESS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());

// VIEWS
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// SERVER
app.use(router);
app.use('/docs',swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.on(dbConn, () => app.listen(port, () => console.log(`
Server listening on port ${port}
Access http://localhost:${port}
`)));