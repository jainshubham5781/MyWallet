var User = require(__base + 'models/user');
var Transaction = require(__base + 'models/transaction');
var validator = require(__base + 'config/validator');

exports.send_to_wallet_display = function(req, res){
	console.log('SendMoneyPage');	
	var decodedMessage = '';
	if(req.query.message)
		decodedMessage = Buffer.from(req.query.message, 'base64').toString('ascii');
	res.render('SendMoney', {message: decodedMessage});
}

exports.send_to_wallet = function(req, res){
	console.log('SendMoneyPost');
	if(req.body.amount <= 0){
		res.render('SendMoney', {message: "Amount should be greater than 0!"});
	}
	else{
		var query = {phoneNumber: req.body.phoneNumber},
			projection = 'email';
		User.findUserData(query, projection).then(function(result){
			if(!result){
				return res.render('SendMoney', {message: "PhoneNumber not exists!"});
			}
			else if(req.session.email == result.email){
				return res.render('SendMoney', {message: "It is your registered Number only!"});
			}
			else{
				var date = new Date();
			 	//Senders
				var query = {email: req.session.email},
			    update = { 
			    	$inc:{walletAmount: -(req.body.amount)}, 
			    	$push:{ transHistory: {
			    		to: result.email, 
			    		amountTransfer: req.body.amount, 
			    		type: 'Sent', 
			    		date: date} } 
			    	},
			    options = { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true };
				Transaction.saveTransaction(query, update, options).then(function(result) {
			    	console.log("Sent: " + result);
			    }, function(err){
			    		console.log("Sent: " + err);
				});

				//Receivers
				var query = {email: result.email},
			    update = { 
			    	$inc:{walletAmount: req.body.amount}, 
			    	$push:{ transHistory: {
			    		from: req.session.email, 
			    		amountTransfer: req.body.amount,
			    		type: 'Received', 
			    		date: date} } 
			    	},
			    options = { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true };
			    Transaction.saveTransaction(query, update, options).then(function(result) {
			    	console.log("Received: " + result);
			    }, function(err){
			    		console.log("Received: " + err);
				});
			   
				//return res.render('SendMoney');
				//var message = encodeURIComponent('Send Successfully');
				var message = "Send Successfully"
				var encodedMessage = Buffer.from(message).toString('base64');
				res.redirect('/sendToWallet?message=' + encodedMessage);
			}
		}, function(err){
			console.log("findByPhone: " + err);
		});
	}
}

exports.add_to_wallet_display = function(req, res){
	console.log('AddMoneyPage');
	res.render('AddMoney', {message: "Add Money to your wallet"});
}

exports.add_to_wallet = function(req, res){
	console.log('AddMoneyPost');
	if(req.body.amount <= 0){
		res.render('AddMoney', {message: "Amount should be greater than 0!"});
	}
	else{
		var date = new Date();
		if(req.body.mode == 'Debit'){
			var validateCardNumber = validator.validateCardNumber(req.body.cardNumber);
			var validateExpDate = validator.validateExpirationDate(req.body.expiryDate);
			var validateCVV = validator.validateCVV(req.body.cvv, validateCardNumber.card.code.size);

			console.log(validateExpDate);
			console.log(validateCVV);
			console.log(validateCardNumber);
			if(!validateCardNumber.isValid){
				return res.render('AddMoney', {message: "Something Wrong with card Details!"});
			}
			if(!validateExpDate.isValid){
				return res.render('AddMoney', {message: "Expiraation Date is Wrong!!"});
			}
			if(!validateCVV.isValid){
				return res.render('AddMoney', {message: "CVV length is wrong!"});
			}
			// if(validateCardNumber.card.code.size != (req.body.cvv + '').length){
			// 	return res.render('AddMoney', {message: "CVV length is wrong!"});
			// }

			var query = {email: req.session.email},
			    update = { 
			    	$inc: {walletAmount: req.body.amount}, 
			    	$push: { 
			    		debitCard: {
			    			cardType: req.body.cardType,
			    			cardNumber: req.body.cardNumber,
			    			cardHolderName: req.body.cardHolderName
			    		},
			    		transHistory: {
				    		from: req.body.cardNumber, 
				    		amountTransfer: req.body.amount, 
				    		type: 'Added', 
				    		date: date
				    	} 
			    	} 
		    	},
			    options = { upsert: true, new: true, setDefaultsOnInsert: true };

			 Transaction.saveTransaction(query, update, options).then(function(result) {
			    	console.log("Added: " + result);
			    	res.render('AddMoney', {message: "Successful"});
			    }, function(err){
			    		console.log("AddeErr: " + err);
				});	    
		}
		else if(req.body.mode == 'Bank'){
			var query = {email: req.session.email},
			    update = { 
			    	$inc: {walletAmount: req.body.amount}, 
			    	$push: { 
			    		bankAccount: {
			    			bankName: req.body.bankName,
			    			accNumber: req.body.accNumber,
			    			accHolderName: req.body.accHolderName,
			    			iFSCCode : req.body.iFSCCode
			    		},
			    		transHistory: {
				    		from: req.body.accNumber, 
				    		amountTransfer: req.body.amount, 
				    		type: 'Added', 
				    		date: date
				    	} 
				    } 
			    },
			    options = { upsert: true, new: true, setDefaultsOnInsert: true };
			Transaction.saveTransaction(query, update, options).then(function(result) {
			    	console.log("Added: " + result);
			    	res.render('AddMoney', {message: "Successful"});
			    }, function(err){
			    		console.log("Added: " + err);
				});	    
		}
	}
}


exports.show_transaction = function(req, res){
	console.log('show_transaction_page');
	var query = {email: req.session.email},
		projection = {_id: 0, 'transHistory': 1, 'walletAmount': 1},
		options = 'to';
	Transaction.findTransactionByEmail(query, projection, options).then(function(result) {
    	console.log("TransactionDetail: " + result);
    	res.render('transaction', {message: "All transactions: ", result: JSON.stringify(result.transHistory), walletAmount: result.walletAmount});
    }, function(err){
    		console.log("TransactionDetail: " + err);
	});	    
}

