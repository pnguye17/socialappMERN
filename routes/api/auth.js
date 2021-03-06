const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')

// @route    GET api/auth
// @desc     Test route
// @access   Public
router.get('/', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
})

// @route Post api/auth
// @desc authenticate user get token
// @access Public
router.post('/',
    [
    check('email', "Please include a valid email")
    .isEmail(),
    check("password", "Password is required").exists()
],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const { email, password } = req.body
    
    try {
        let user = await User.findOne({email})

        // see if user exist
        if (!user) {
            return res.status(400).json({ errors: [{msg: "invalid credentials"}]})
        }
        // comparing the password that is entered 
        // and with the hash password
        const isMatch = await bcrypt.compare(password, user.password)
        //return jsonwebtoken
        
        if(!isMatch) {
            return res.status(400).json({ errors: [{msg: "invalid credentials"}]})
        }
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err, token) => {
                if (err) throw err 
                res.json({ token })
            }
        )
    } catch(err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
})
module.exports = router