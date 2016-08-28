var PaymentClient = function(data) {
	this.init(data);
};

PaymentClient.prototype = {
	data: {
		price: {
			amount: 0,
			currency: ''
		},
		customer: {
			name: ''
		},
		card: {
			holder: '',
			number: null,
			expiration: {
				day: 0,
				month: 0,
				year: 0
			},
			ccv: 0
		}
	},

	init: function(data) {
		this.data = data;
	},

	submit: function(done) {
		var request = new Request();

		try {
			request.post('/payment/submit', JSON.stringify(this.data), done);
		} catch(e) {
			if (console && typeof console.error === 'function') {
				console.error('Error while parsing JSON', e);
			}
		}
	}
};
