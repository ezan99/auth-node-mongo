const router = require("express").Router();
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const loginValidation = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
});

const registerValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().min(6).required().email(),
    sport: Joi.string().required(),
    password: Joi.string().min(6).required(),
});

router.get('/find/:id', async (req, res) => {
    try {
        const response = await User.findById(req.params.id);
        res.json(response)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post("/login", async (req, res) => {
    const { error } = loginValidation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).send("Email or password is wrong");

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Email or password is wrong");

    // Assign new token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).send({
        name: user.name,
        email: user.email,
        sport: user.sport,
        message: "success",
        token: token,
    });
});

router.post("/register", async (req, res) => {
    const { error } = registerValidation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if the user exists
    const emailExists = await User.findOne({ email: req.body.email });

    if (emailExists) return res.status(400).send("Email allready exists");

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Add row to DB
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        sport: req.body.sport,
        password: hashPassword,
    });

    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;