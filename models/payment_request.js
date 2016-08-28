const mongoose = require('mongoose');

const paymentRequest = new mongoose.Schema({
	paymentToken: {
		type: String
	},
	type: String,
	price: {
		amount: {
			type: String,
			required: true,
			validate: [function(amount) {
				var re = /[0-9]*[.,]?[0-9]+/;
				return re.test(amount)
			}, 'invalid price']
		},
		currency: {
			type: String,
			required: true,
			validate: [function(amount) {
				var re = /[A-Z]{3}/;
				return re.test(amount)
			}, 'invalid currency']
		}
	},
	customer: {
		name: {
			type: String,
			required: true,
			validate: [function(amount) {
				var re = /[a-zA-Z0-9 ]+/;
				return re.test(amount)
			}, 'invalid full name']
		}
	},
	card: {
		cardType: {
			type: String
		},
		holder: {
			type: String,
			required: true,
			validate: [function(amount) {
				var re = /[a-zA-Z0-9 ]+/;
				return re.test(amount)
			}, 'invalid holder name']
		},
		number: {
			type: Number,
			required: true,
			validate: [function(amount) {
				var re = /[0-9]{13,16}/;
				return re.test(amount)
			}, 'invalid card number']
		},
		expiration: {
			day: {
				type: Number,
				required: true,
				validate: [function(amount) {
					var re = /[0-9]*/;
					return re.test(amount)
				}, 'invalid day']
			},
			month: {
				type: Number,
				required: true,
				validate: [function(amount) {
					var re = /[0-9]*/;
					return re.test(amount)
				}, 'invalid month']
			},
			year: {
				type: Number,
				required: true,
				validate: [function(amount) {
					var re = /[0-9]{4}/;
					return re.test(amount)
				}, 'invalid year']
			}
		},
		ccv: {
			type: Number,
			required: true,
			validate: [function(amount) {
				var re = /[0-9]*/;
				return re.test(amount)
			}, 'invalid ccv']
		}
	}
}, { timestamps: true });

paymentRequest.methods.setCardType = function() {
	var cardNumber = '' + this.card.number;
	this.card.cardType = 'Visa';
	var re = new RegExp("^4");

	if (cardNumber.match(re) != null) {
		this.card.cardType = 'Visa';
	}

	re = new RegExp("^5[1-5]");
	if (cardNumber.match(re) != null) {
		this.card.cardType = 'Mastercard';
	}

	re = new RegExp("^3[47]");
	if (cardNumber.match(re) != null) {
		this.card.cardType = "AMEX";
	}
};

paymentRequest.post( "validate", function (doc) {
	this.setCardType();
});

const PaymentRequest = mongoose.model('PaymentRequest', paymentRequest);

module.exports = PaymentRequest;
