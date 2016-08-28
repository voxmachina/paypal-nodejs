# A Paypal and Braintree Payment Gateway Example
Pedro Eugenio, 08/2016

# Instructions
npm install

npm start

Open: http://localhost:3000

# Tests
npm test

# Development
npm run dev

# Further
Some good pratices to handle security for saving credit cards are:
* Always use HTTPS
* Never save Credit Card information, instead use a payment token for authorized payments
* Require users to authenticate and log in before
* If needed to save Credit Card information then:
  * Use encryption to save this information, never transfer or save clear text data
  * Use a page token for the payment that it's to be used on a single transaction
* Follow https://en.wikipedia.org/wiki/PA-DSS
* In the near future, already in beta on Chrome: https://w3c.github.io/browser-payment-api/
