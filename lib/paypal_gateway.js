var Paypal = require('paypal-rest-sdk');

exports.submit = function (paymentRequest, done) {
	var customerNameList = paymentRequest.card.holder.split(" ");
	var payment;

	Paypal.configure({
		'mode': process.env.PAYPAL_MODE || 'sandbox',
		'client_id': process.env.PAYPAL_CLIEND_ID,
		'client_secret': process.env.PAYPAL_CLIEND_SECRET
	});

	payment = {
		"intent": "sale",
		"payer": {
			"payment_method": "credit_card",
			"funding_instruments": [{
				"credit_card": {
					"type": paymentRequest.card.cardType.toLowerCase(),
					"number": paymentRequest.card.number,
					"expire_month": paymentRequest.card.expiration.month,
					"expire_year": paymentRequest.card.expiration.year,
					"cvv2": paymentRequest.card.ccv,
					"first_name": customerNameList[0],
					"last_name": customerNameList[1]
				}
			}]
		},
		"transactions": [{
			"amount": {
				"total": paymentRequest.price.amount,
				"currency": paymentRequest.price.currency
			},
			"description": "A test payment"
		}]
	};

	Paypal.payment.create(payment, function (error, payment) {
		if (error) {
			done(true, error);
		} else {
			done(false, payment);
		}
	});
};
