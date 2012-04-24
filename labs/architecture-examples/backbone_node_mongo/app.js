var express = require('express')
  , http = require('http')
  , mongoose = require('mongoose')
  , models = require('./models')
  , routes = require('./routes')
  , sockets = require('./sockets')
  , connect = require('express/node_modules/connect')
  , RedisStore = require('connect-redis')(express)
  , sessionStore = new RedisStore()
  , app = express()
  , srvr
  , io;

app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session({
    secret: 'keyboard cat',
    key: 'express.sid',
    store: sessionStore
  }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function () {
  app.use(express.errorHandler());
});

routes.init(app);
mongoose.connect("127.0.0.1", "todomvc", 27017);
srvr = http.createServer(app);
io = require('socket.io').listen(srvr);
sockets.init(io, sessionStore);
srvr.listen(3000);

console.log("Express server listening on port 3000");
