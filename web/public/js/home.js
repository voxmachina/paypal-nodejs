var PaymentClient = function(data) {
    this.init(data);
};

PaymentClient.prototype = {
    data: {
        price: {
            amount: 0,
            currency: ""
        },
        customer: {
            name: ""
        },
        card: {
            holder: "",
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
            request.post("/payment/submit", JSON.stringify(this.data), done);
        } catch (e) {
            if (console && typeof console.error === "function") {
                console.error("Error while parsing JSON", e);
            }
        }
    }
};

var FormHandler = function() {
    this.init();
};

FormHandler.prototype = {
    fields: [],
    fieldIds: [ "price", "currency", "fullname", "cardname", "number", "day", "month", "year", "ccv" ],
    messageContainerId: "messages",
    messageContainerElement: null,
    messageTimeout: null,
    fieldTimeout: null,
    submitButton: null,
    init: function() {
        var form = document.getElementById("payment");
        this.cacheElements();
        this.getClientToken();
        form.addEventListener("submit", this.onFormSubmit.bind(this));
    },
    getClientToken: function() {
        var request = new Request();
        request.get("/token", this.onTokenResponse.bind(this));
    },
    onTokenResponse: function(err, token) {
        if (err) {
            throw new Error("Could not retrieve payment token");
        } else {
            document.getElementById("token").value = token;
        }
    },
    cacheElements: function() {
        this.fieldIds.forEach(function(elemId) {
            this.fields[elemId] = document.getElementById(elemId);
        }, this);
        this.messageContainerElement = document.getElementById(this.messageContainerId);
        this.submitButton = document.getElementById("submit");
    },
    getParsedFormData: function() {
        return {
            price: {
                amount: this.fields["price"].value,
                currency: this.fields["currency"].value
            },
            customer: {
                name: this.fields["fullname"].value
            },
            card: {
                holder: this.fields["cardname"].value,
                number: this.fields["number"].value,
                expiration: {
                    day: this.fields["day"].value,
                    month: this.fields["month"].value,
                    year: this.fields["year"].value
                },
                ccv: this.fields["ccv"].value
            }
        };
    },
    onFormSubmit: function(evt) {
        var paymentClient;
        if (this.validateForm()) {
            this.setLoading();
            paymentClient = new PaymentClient(this.getParsedFormData());
            paymentClient.submit(this.onPaymentClientResponse.bind(this));
        }
        evt.preventDefault();
    },
    setLoading: function() {
        this.submitButton.value = "Loading...";
        this.submitButton.setAttribute("disabled", true);
    },
    setDone: function() {
        this.submitButton.value = "Submit";
        this.submitButton.removeAttribute("disabled");
    },
    validateForm: function() {
        var fieldId;
        var field;
        var pattern;
        var isValid = true;
        for (fieldId in this.fields) {
            field = this.fields[fieldId];
            if (!new RegExp(field.getAttribute("pattern")).test(field.value)) {
                isValid = false;
                field.classList.add("error");
                if (this.fieldTimeout !== null) {
                    clearTimeout(this.fieldTimeout);
                }
                this.fieldTimeout = setTimeout(function() {
                    field.classList.remove("error");
                }, 3e3);
                this.showError(field.getAttribute("rel") + " requires a valid value");
                break;
            }
        }
        return isValid;
    },
    onPaymentClientResponse: function(err, data) {
        if (err) {
            this.showError(data);
        } else {
            this.showSuccess("Payment made with success");
        }
        this.setDone();
    },
    encodeParams: function() {
        var encodedParams = "";
        this.fields.forEach(function(elem) {
            if (encodedParams.length > 0) {
                encodedParams += "&";
            }
            encodedParams += encodeURI(elem.id + "=" + elem.value);
        });
        return encodedParams;
    },
    showSuccess: function(msg) {
        this.messageContainerElement.innerHTML = msg;
        this.messageContainerElement.classList.remove("error");
        this.messageContainerElement.classList.add("success");
        this.showMessage();
    },
    showError: function(msg) {
        this.messageContainerElement.innerHTML = msg;
        this.messageContainerElement.classList.remove("success");
        this.messageContainerElement.classList.add("error");
        this.showMessage();
    },
    showMessage: function() {
        this.messageContainerElement.classList.add("active");
        if (this.messageTimeout !== null) {
            clearTimeout(this.messageTimeout);
        }
        this.messageTimeout = setTimeout(this.hideMessage.bind(this), 3e3);
    },
    hideMessage: function() {
        this.messageContainerElement.classList.remove("error");
        this.messageContainerElement.classList.remove("success");
        this.messageContainerElement.classList.remove("active");
    }
};

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
        if (csrfToken !== undefined && csrfToken !== "") {
            xhr.open("POST", url);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken);
            xhr.setRequestHeader("X-PAYMENT-TOKEN", paymentToken);
            xhr.onload = function() {
                done(xhr.status !== 200, xhr.response || "An unknown error occurred");
            };
            this.xhr.send(params);
        } else {
            done(true);
        }
    },
    get: function(url, done) {
        var csrfToken = this.getCsrfToken();
        var xhr = this.xhr;
        if (csrfToken !== undefined && csrfToken !== "") {
            xhr.open("GET", url);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken);
            xhr.onload = function() {
                done(xhr.status !== 200, xhr.response || "An unknown error occurred");
            };
            this.xhr.send();
        } else {
            done(true);
        }
    },
    getPaymentToken: function() {
        var elem = document.getElementById("token");
        var token = "";
        if (elem !== undefined) {
            token = document.getElementById("token").value;
        }
        return token;
    },
    getCsrfToken: function() {
        var elem = document.getElementById("csrf");
        var token = "";
        if (elem !== undefined) {
            token = document.getElementById("csrf").value;
        }
        return token;
    }
};
