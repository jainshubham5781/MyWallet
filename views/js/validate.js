var tempp = 'ert';
//var valid = require('card-validator');

$(document).ready(function() {
	
	var cardNumber = document.getElementById('cardNumber');
	cardNumber.onkeyup = function(){
		cardValid = false;
		if(!cardValid){
			$('#CardSubmit').attr("disabled", "disabled");
		}
		if($('#cardNumber').val() == ''){
			$('#cardType').val('empty');
			return;
		}
		$('#cardNumber').validateCreditCard(function(result) {
		if(result.card_type)
			$('#cardType').val(result.card_type.name);
		else
			$('#cardType').val('-');
        // console.log('Card type: ' + (result.card_type == null ? '-' : result.card_type.name)
        //              + ' Valid: ' + result.valid
        //              + ' Lengthvalid: ' + result.length_valid
        //              + ' Luhn valid: ' + result.luhn_valid);
        if(result.card_type && result.valid && result.length_valid && result.luhn_valid){
        	cardValid = true;
        	$('#CardSubmit').removeAttr("disabled");
        }
        });
        console.log(cardValid);
	}


	//document.getElementById("demo").innerHTML = tt;
	// console.log($('#cardNumber').val());
	// console.log($('#cardType').val());
	// var cardNumber = document.getElementById('cardNumber');
	// cardNumber.onkeyup = function(){
	// 	var numberValidation = valid.number(cardNumber.value);
	// 	if(!numberValidation.isPotentiallyValid){
	// 		console.log("Nottt");
	// 		renderInvalidCardNumber();
	// 	}
	// 	if(numberValidation.card){
	// 		console.log(numberValidation.card.type);
	// 		$('#cardType').val(numberValidation.card.type);
	// 	}

		//document.getElementById('demo2').innerHTML = cardNumber.value;
		
// 	    //console.log($('#fname').val());
 	//}
});

// function init() {
// 	console.log($('#fname').val());
// 	var inputBox = document.getElementById('fname');
// 	inputBox.onkeyup = function(){
// 	    document.getElementById('demo2').innerHTML = inputBox.value;
// 	    //console.log($('#fname').val());
// }
// }
// window.onload = init;

// function myFunction() {
// 	document.getElementById("demo").innerHTML =   $("#fname").val()
	
// 	$("#demo2").val('jjhjhj');
    // var x = document.getElementById("fname");
    // x.value = x.value.toUpperCase();
//}
