const router = require("express").Router()
const User = require("../models/User.js")
const bcrypt = require("bcrypt")

//register
router.post("/register", async (req, res) => {
    try {
        //genera password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //genera utente
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email
        })

        //salva utente e ritorna risposta
        const user = await newUser.save()
        res.status(201).send({
            message: "Utente salvato correttamente",
            statusCode: 201,
            user
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            statusCode: 500
        });
    }
})

//login
router.post("/login", async (req, res) => {
    try {
        //trova utente se presente in database
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).send({
                message: "Utente non trovato",
                statusCode: 404
            })
        }
        //verifica password
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) {
            return res.status(400).send({
                message: "Password errata",
                statusCode: 400
            })
        }

        //salva utente e ritorna risposta
        res.status(200).send({
            message: "Login effettuato correttamente",
            statusCode: 200,
            user,
        })
    } catch (error) {
        res.status(500).send({
            error
        })
    }
})

module.exports = router



