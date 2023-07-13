const router = require("express").Router()
const Message = require("../models/Message")

//aggiungi messaggio
router.post("/", async (req, res)=>{
    const newMessage = new Message (req.body)
    try {
        const savedMessage = await newMessage.save()
        res.status(200).send({
            message: "Messaggio creato con successo",
            statusCode: 200,
            savedMessage
        })
    } catch (error) {
        res.status(500).send({
            message: "Errore nel server",
            statusCode: 500,
            error
        })
    }
})

//get messaggi
router.get("/:conversationId", async (req, res)=>{
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        })
        res.status(200).send({
            message: "Messaggio recuperato con successo",
            statusCode: 200,
            messages
        })
    } catch (error) {
        res.status(500).send({
            message: "Errore nel server",
            statusCode: 500,
            error
        })
    }
})
module.exports = router;
