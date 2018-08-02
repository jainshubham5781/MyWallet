var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var promise = require('promise');

var TransactionSchema = new mongoose.Schema({
  email: {
  	type: String, 
  	unique: true, 
  	required: true, 
  	trim: true
  },
  walletAmount: {
  	type: Number, 
  	required: true, 
  	trim: true, 
  	default: 0
  },
  transHistory: {
    date: {type: Date, default: new Date()},
    to: {type: String, trim: true, default: ''},
    from: {type: String, trim: true, default: ''},
    amountTransfer: {type: Number, min: 0},
    type: {type: String, trim: true, enum: ['Received', 'Sent', 'Added']}
  },
  debitCard: {
  	cardType: {type: String, trim: true},
  	cardNumber: {type: Number, required: true},
  	cardHolderName: {type: String, trim: true}
  },
  bankAccount: {
  	bankName : {type: String, trim: true, required: true},
  	accHolderName: {type: String, trim: true},
  	accNumber: {type: Number, required: true},
  	iFSCCode:  {type: String, trim: true, required: true}
  }
});


TransactionSchema.statics.saveTransaction = function(query, update, options){
	return new Promise(function(resolve, reject){
		Transaction.findOneAndUpdate(query, update, options)
		.exec(function(err, result){
			if(err){
				reject(err);
			}
			else{
				resolve(result);
			}
		});
	});
}

TransactionSchema.statics.findTransactionByEmail = function(query, projection, options){
	return new Promise(function(resolve, reject){
		Transaction.findOne(query, projection)
		.sort(options)
		.exec(function(err, result){
			if(err){
				reject(err);
			}
			else{
				resolve(result);
			}
		});
	});
}

var Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;