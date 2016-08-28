var PaypalGateway = require('./paypal_gateway');
var BraintreeGateway = require('./braintree_gateway');

exports.getPaypal = function () {
	return PaypalGateway;
};

exports.getBraintree = function () {
	return BraintreeGateway;
};
