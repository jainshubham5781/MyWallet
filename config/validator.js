var valid = require('card-validator');

exports.validateCardNumber = function(cardNumber){
	return valid.number(cardNumber);
}

exports.validateExpirationDate = function(expDate){
	return valid.expirationDate(expDate);
}

exports.validateCVV = function(cvv, maxLength){
	return valid.cvv(cvv, maxLength);
}