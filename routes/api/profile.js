const express = require('express')
const router = express.Router()
const auth = require("../../middleware/auth")
const User = require('../../models/User')
const Profile = require("../../models/Profile")

// @route GET api/profile/me
// @desc get concurrent user profile
// @access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ["name", 'avatar'])

        if (!profile) {
            res.status(400).json({ msg: "no profile found"})
        }

        res.json(profile)

    } catch (err) {
        console.log(err.message)
        res.status(500).send('server error')
    }
})

module.exports = router