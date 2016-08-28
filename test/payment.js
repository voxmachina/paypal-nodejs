const request = require('supertest');
const app = require('../server.js');
const PaymentGatewayFactory = require('../lib/payment_gateway_factory');
const cheerio = require('cheerio');
const chai = require('chai');
const spies = require('chai-spies');
const should = chai.should();
const expect = chai.expect;
const sinon = require('sinon');

var paymentMock;

beforeEach(function() {
	paymentMock = {
		price: {
			amount: 100,
			currency: 'EUR'
		},
		customer: {
			name: 'John Doe'
		},
		card: {
			holder: 'John Doe',
			number: 4111111111111111,
			expiration: {
				day: 1,
				month: 12,
				year: 2020
			},
			ccv: 545
		}
	};
});

afterEach(function(){
	paymentMock = {};
});

describe('POST /payment/submit', () => {
	it('should return 400 with empty post payload', (done) => {
		request(app)
			.post('/payment/submit')
			.expect(400, done);
	});

	it("should return 400 if price amount is empty", (done) => {
		paymentMock.price.amount = '';

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function(err, res) {
				expect(res.status).equal(400);
				done();
			})
	});

	it("should return 400 if price amount is invalid", (done) => {
		paymentMock.price.amount = 'x';

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function(err, res) {
				expect(res.status).equal(400);
				done();
			})
	});

	it("should return 400 if currency is empty", (done) => {
		paymentMock.price.currency = '';

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function(err, res) {
				expect(res.status).equal(400);
				done();
			})
	});

	it("should return 400 if currency is invalid", (done) => {
		paymentMock.price.currency = 'x';

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function(err, res) {
				expect(res.status).equal(400);
				done();
			})
	});

	it("should return 400 if customer is empty", (done) => {
		paymentMock.customer.name = '';

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function(err, res) {
				expect(res.status).equal(400);
				done();
			})
	});

	it("should return 400 if card number is empty", (done) => {
		paymentMock.card.number = '';

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function(err, res) {
				expect(res.status).equal(400);
				done();
			})
	});

	it("should return 400 if card number name is invalid", (done) => {
		paymentMock.card.number = '444';

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function(err, res) {
				expect(res.status).equal(400);
				done();
			})
	});

	it("should return 400 if card holder is empty", (done) => {
		paymentMock.card.holder = '';

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function(err, res) {
				expect(res.status).equal(400);
				done();
			})
	});

	it("should return 400 if card expiration day is empty", (done) => {
		paymentMock.card.expiration.day = '';

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function(err, res) {
				expect(res.status).equal(400);
				done();
			})
	});

	it("should return 400 if card expiration day is invalid", (done) => {
		paymentMock.card.expiration.day = 'x';

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function(err, res) {
				expect(res.status).equal(400);
				done();
			})
	});

	it("should return 400 if card expiration month is empty", (done) => {
		paymentMock.card.expiration.month = '';

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function(err, res) {
				expect(res.status).equal(400);
				done();
			})
	});

	it("should return 400 if card expiration month is invalid", (done) => {
		paymentMock.card.expiration.month = 'x';

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function(err, res) {
				expect(res.status).equal(400);
				done();
			})
	});

	it("should return 400 if card expiration year is empty", (done) => {
		paymentMock.card.expiration.year = '';

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function(err, res) {
				expect(res.status).equal(400);
				done();
			})
	});

	it("should return 400 if card expiration year is invalid", (done) => {
		paymentMock.card.expiration.year = 'x';

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function(err, res) {
				expect(res.status).equal(400);
				done();
			})
	});

	it("should return 400 if ccv is empty", (done) => {
		paymentMock.card.ccv = '';

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function(err, res) {
				expect(res.status).equal(400);
				done();
			})
	});

	it("should return 400 if ccv is invalid", (done) => {
		paymentMock.card.ccv = 'x';

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function(err, res) {
				expect(res.status).equal(400);
				done();
			})
	});

	it("should return 400 if currency is not USD and credit card is AMEX", (done) => {
		paymentMock.price.currency = 'EUR';
		paymentMock.card.number = '371449635398431'; // AMEX Test Card

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function(err, res) {
				expect(res.status).equal(400);
				done();
			})
	});

	it("should use Paypal if credit card type is AMEX", (done) => {
		var paypal = sinon.stub(PaymentGatewayFactory, 'getPaypal');
		paymentMock.price.currency = 'USD';
		paymentMock.card.number = '371449635398431'; // AMEX Test Card

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function (err, res) {
				paypal.restore();
				sinon.assert.calledOnce(paypal);
				done();
			})
	});

	it("should use Paypal if currency is USD", (done) => {
		var paypal = sinon.stub(PaymentGatewayFactory, 'getPaypal');
		paymentMock.price.currency = 'USD';
		paymentMock.card.number = '371449635398431'; // AMEX Test Card

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function (err, res) {
				paypal.restore();
				sinon.assert.calledOnce(paypal);
				done();
			})
	});

	it("should use Paypal if currency EUR", (done) => {
		var paypal = sinon.stub(PaymentGatewayFactory, 'getPaypal');
		paymentMock.price.currency = 'EUR';
		paymentMock.card.number = '4111111111111111'; // Visa Test Card

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function (err, res) {
				paypal.restore();
				sinon.assert.calledOnce(paypal);
				done();
			})
	});

	it("should use Paypal if currency AUD", (done) => {
		var paypal = sinon.stub(PaymentGatewayFactory, 'getPaypal');
		paymentMock.price.currency = 'AUD';
		paymentMock.card.number = '4111111111111111'; // Visa Test Card

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function (err, res) {
				paypal.restore();
				sinon.assert.calledOnce(paypal);
				done();
			})
	});

	it("should use Braintree if currency is not USD, EUR or AUD", (done) => {
		var braintree = sinon.stub(PaymentGatewayFactory, 'getBraintree');
		paymentMock.price.currency = 'THB';
		paymentMock.card.number = '4111111111111111'; // Visa Test Card

		request(app)
			.post('/payment/submit')
			.set('X-PAYMENT-TOKEN', '12345')
			.send(paymentMock)
			.end(function (err, res) {
				braintree.restore();
				sinon.assert.calledOnce(braintree);
				done();
			})
	});
});
