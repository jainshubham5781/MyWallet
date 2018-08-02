var express = require('express');
var router = express.Router();
var config = require(__base + 'config/config.js');
const { check, validationResult } = require('express-validator/check');

var register = require('./register.js');
var home = require('./home.js');
var transaction = require('./transaction.js');

router.use(function(req, res, next){
	res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	next();
});

router.get('/', register.index);

// router.route('/login')
// 	.get(register.login_display)
// 	.post(register.login);
router .get('/chat', function(req, res){
	res.render('chat');
})

router.get('/login', register.login_display);

router.post('/login', 
	//[check('email').isEmail().withMessage('Must be an email').trim().normalizeEmail()],
	register.login);


router.get('/signup', register.signup_display);

router.post('/signup', [
	check('email').isEmail().withMessage('Must be an email').trim().normalizeEmail(),
	check('password').isLength({min:4}),
	check('passwordConf').exists().custom((value,{req}) => value === req.body.password)
		.withMessage('Password & ConfirmPassword Not Equal'),
	check('phoneNumber').isMobilePhone(config.locales),
	check('username').exists().not().isEmpty().trim()
	],
	register.signup);

// router.route('/signup')
// 	.get(register.signup_display)
// 	.post(register.signup);

router.get('/logout', register.logout);

router.use('/home', register.checkSignIn
	, function(err, req, res, next){
		console.log(err);
		res.redirect('/login');
	}
)
router.get('/home', home.home_display);

router.get('/profile', home.profile_display);

router.route('/sendToWallet')
	.get(transaction.send_to_wallet_display)
	.post(transaction.send_to_wallet)

router.route('/addToWallet')
	.get(transaction.add_to_wallet_display)
	.post(transaction.add_to_wallet);

router.get('/showTransaction', transaction.show_transaction);

// router.get('*', function(req, res, next) {
// 	next(new Error('404'));
// });

module.exports = router;