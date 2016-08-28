const express = require('express');
const path = require('path');
const session = require('express-session');
const lusca = require('lusca');
const braintree = require("braintree");
const errorHandler = require('errorhandler');
const logger = require('morgan');
const bodyParser = require('body-parser');
const sass = require('node-sass-middleware');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.load({path: '.env'});

const braintreeGateway = braintree.connect({
	environment: process.env.BRAINTREE_MODE || braintree.Environment.Sandbox,
	merchantId: process.env.BRAINTREE_MERCHANT_ID,
	publicKey: process.env.BRAINTREE_PUBLIC_KEY,
	privateKey: process.env.BRAINTREE_PRIVATE_KEY
});
const env = process.env.NODE_ENV || 'dev';

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', () => {
	console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
	process.exit(1);
});

const homeController = require('./controllers/home');
const paymentController = require('./controllers/payment');

const app = express();

app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: 'cenas',
	store: new MongoStore({
		url: process.env.MONGODB_URI,
		autoReconnect: true
	})
}));

app.use(lusca({
	csrf: env !== 'test',
	xframe: 'SAMEORIGIN',
	xssProtection: true,
}));

app.use(logger('dev'));
app.use(sass({
	src: path.join(__dirname, 'web'),
	dest: path.join(__dirname, 'web/public'),
	debug: true
}));
app.use(express.static(path.join(__dirname, 'web/public'), {maxAge: 31557600000}));

app.get('/', homeController.index);
app.post('/payment/submit', paymentController.index);
app.get('/token', function (req, res) {
	braintreeGateway.clientToken.generate({}, function (err, response) {
		res.send(response.clientToken);
	});
});

app.use(errorHandler());

app.listen(app.get('port'), () => {
	console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
