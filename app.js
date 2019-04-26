const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const errorHandler = require('./helpers/error-handler');
const passport = require('passport');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
    }
    next();
  });

app.use(passport.initialize());
// app.use(passport.session());

require('./config/passport');

const bookRoutes = require('./routes/book.routes');
const institutionRoutes = require('./routes/institution.routes');
const userRoutes = require('./routes/user.routes');

app.get('/', (req, res, next) => {
    res.status(200).send("Express code challenge started");
});
app.use('/books', bookRoutes);
app.use('/institutions', institutionRoutes);
app.use('/users', userRoutes);

module.exports = app;