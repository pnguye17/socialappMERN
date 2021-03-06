const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')

const User = require('../../models/User')

// @route PUT api/user/:id
// @desc update user info
// @access private

router.put('/:id', 
    [ 
        auth, 
        [
            check('email', "Please include a valid email")
            .isEmail()
        ]
    ], 
    async (req, res) => { 
        const errors = validationResult(req)
        const { email } = req.body
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()})
        }
        try {
            const updateUser = await User.findById(req.params.id)
        
            updateUser.email = email
    
            await updateUser.save()
            res.json(updateUser)
        
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error")
        
    }
}
)

// @route DELETE api/user/:id
// @desc DELETE user
// @access private

router.delete('/', auth, async (req, res) => { 

        try {
            const deleteUser = await User.findOneAndRemove({ _id: req.user.id})
           
            res.json("User is deleted")
        
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error")
    }
}
)


// @route Post api/user
// @desc register user
// @access Public
router.post('/',[
    check('name', "Name is required")
    .not()
    .isEmpty(),
    check('email', "Please include a valid email")
    .isEmail(),
    check("password", "Please enter a password with 6 or more characters")
    .isLength({min: 6})
],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const { name, email, password } = req.body
    
    try {
        let user = await User.findOne({email})

        // see if user exist
        if (user) {
            return res.status(400).json({ errors: [{msg: "user already exists"}]})
        }
        //get users gravatar
        const avatar = gravatar.url(email, {
            s: '200', // photo size
            r: 'pg', // pg photos
            d: "mm"
        })
        
        user = new User({
            name,
            email,
            avatar,
            password
        })

        //encrypt password
        // salt first
        const salt = await bcrypt.genSalt(10)
        //hashes the password with the salt from above
        user.password = await bcrypt.hash(password, salt)
        await user.save()
        //return jsonwebtoken
        
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


// @route GET api/users
// @desc get a list of all users
// @access public

router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        console.log(users)
        res.json(users)

    } catch (error) {
        console.error(err.message)
        res.status(500).send("Server Error")
        
    }
} )

module.exports = router