const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation} = require('../validation');


router.post('/register', async (req, res) => {
	console.log(req.body)
	const { error } = registerValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);


	// checking email already exists
	const emailExist = await User.findOne({email: req.body.email});
	if (emailExist) return res.status(400).send('Email already exists');

	// Hash passwords 
	const salt = await bcrypt.genSaltSync(10);
	const hashPassword = await bcrypt.hashSync(req.body.password, salt);


	// create new user
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashPassword
	});

	try {

		const savedUser = await user.save();
		res.send({user: user._id});

	} catch(err) {
		res.status(400).send(err);
	}

	
});


// Login
router.get('/login', async (req, res) => {
	// checking email already exists
	const user = await User.findOne({email: req.body.email});
	if (!user) return res.status(400).send("Email doesn't exist");

	// Hash passwords 
	// const salt = await bcrypt.genSaltSync(10);
	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) return res.status(400).send("Invalid password");

	// res.send({user: user});

	const token = jwt.sign({_id: user.id}, 'qwerewrqds');
	res.header('Authorization', token).send(token);


});

module.exports = router;