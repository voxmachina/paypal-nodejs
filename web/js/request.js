var Request = function() {
	this.init();
};

Request.prototype = {
	init: function() {
		this.xhr = new XMLHttpRequest();
	},

	post: function(url, params, done) {
		var csrfToken = this.getCsrfToken();
		var paymentToken = this.getPaymentToken();
		var xhr = this.xhr;

		if (csrfToken !== undefined && csrfToken !== '') {
			xhr.open('POST', url);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken);
			xhr.setRequestHeader("X-PAYMENT-TOKEN", paymentToken);
			xhr.onload = function() {
				done(xhr.status !== 200, xhr.response || 'An unknown error occurred');
			};
			this.xhr.send(params);
		} else {
			done(true);
		}
	},

	get: function(url, done) {
		var csrfToken = this.getCsrfToken();
		var xhr = this.xhr;

		if (csrfToken !== undefined && csrfToken !== '') {
			xhr.open('GET', url);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken);
			xhr.onload = function() {
				done(xhr.status !== 200, xhr.response || 'An unknown error occurred');
			};
			this.xhr.send();
		} else {
			done(true);
		}
	},

	getPaymentToken: function() {
		var elem = document.getElementById('token');
		var token = '';

		if (elem !== undefined) {
			token = document.getElementById('token').value;
		}

		return token;
	},

	getCsrfToken: function() {
		var elem = document.getElementById('csrf');
		var token = '';

		if (elem !== undefined) {
			token = document.getElementById('csrf').value;
		}

		return token;
	}
};
