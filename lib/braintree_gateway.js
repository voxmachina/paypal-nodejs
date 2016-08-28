const braintree = require("braintree");

exports.submit = function (paymentRequest, done) {
	var braintreeGateway = braintree.connect({
		environment: braintree.Environment.Sandbox,
		merchantId: process.env.BRAINTREE_MERCHANT_ID,
		publicKey: process.env.BRAINTREE_PUBLIC_KEY,
		privateKey: process.env.BRAINTREE_PRIVATE_KEY
	});

	braintreeGateway.transaction.sale({
		amount: paymentRequest.price.amount,
		paymentMethodNonce: 'fake-valid-nonce',
		creditCard: {
			cardholderName: paymentRequest.card.holder,
			cvv: paymentRequest.card.ccv,
			expirationMonth: paymentRequest.card.expiration.month,
			expirationYear: paymentRequest.card.expiration.year,
			number: paymentRequest.card.number
		},
		options: {
			submitForSettlement: true
		}
	}, function (err, result) {
		if (err) {
			done(true, err);
		} else {
			done(false, result);
		}
	});
};
