const PaymentRequest = require('../models/payment_request');
const PaymentGatewayFactory = require('../lib/payment_gateway_factory');

exports.index = (req, res) => {
	var body = req.body;
	var paymentRequest;
	var error;
	var errorMessage = '';
	var errorName;
	var paymentGateway = null;

	if (Object.keys(body).length === 0 && body.constructor === Object) {
		return res.status(400).send('invalid data');
	}

	paymentRequest = new PaymentRequest(body);

	try {
		paymentRequest.paymentToken = req.get('X-PAYMENT-TOKEN');
	} catch(e) {
		return res.status(400).send('invalid token');
	}

	error = paymentRequest.validateSync();

	if (error) {
		for (errorName in error.errors) {
			errorMessage += error.errors[errorName].message;
		}
		return res.status(400).send(errorMessage);
	} else {
		if (paymentRequest.price.currency !== 'USD' && paymentRequest.card.cardType === 'AMEX') {
			return res.status(400).send('AMEX is possible to use only for USD');
		}

		if (paymentRequest.card.cardType === 'AMEX' || paymentRequest.price.currency === 'USD'
			|| paymentRequest.price.currency === 'EUR' || paymentRequest.price.currency === 'AUD') {
			paymentGateway = PaymentGatewayFactory.getPaypal();
		} else {
			paymentGateway = PaymentGatewayFactory.getBraintree();
		}

		if (paymentGateway !== null) {
			paymentGateway.submit(paymentRequest, function(err) {
				if (err) {
					return res.status(500).send('Gateway returned an error');
				} else {
					paymentRequest.save(function (err) {
						if (err) {
							return res.status(500).send('Failed to save to database');
						} else {
							return res.status(200).send('ok');
						}
					});
				}
			});
		} else {
			return res.status(500).send('Gateway not found');
		}
	}
};
