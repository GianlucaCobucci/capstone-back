const router = require("express").Router()
const Conversation = require("../models/Conversation")

//nuova conversazione
router.post("/", async (req, res)=>{
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    })

    try {
        const savedConversation = await newConversation.save()
        res.status(200).send({
            message: "Conversazione salvata con successo",
            savedConversation,
            statusCode: 200
        })
    } catch (error) {
        res.status(500).send({
            message: "C'è un errore nel server",
            statusCode: 500,
            error
        })
    }
})

//get conversazione di un utente
router.get("/:userId", async (req,res)=>{
    try {
        const conversation = await Conversation.find({
            members: {$in:[req.params.userId]}
        })
        res.status(200).send({
            message: "Conversazione presa con successo",
            conversation,
            statusCode: 200
        })
    } catch (error) {
        res.status(500).send({
            message: "C'è un errore nel server",
            statusCode: 500,
            error
        })
    }
})

//get conversazione che include due utenti attivi
router.get("/find/:firstUserId/:secondUserId", async (req, res)=>{
    try {
        const conversation = await Conversation.findOne({
            members: {$all:[req.params.firstUserId, req.params.secondUserId]}

        })
        res.status(200).send({
            message: "Conversazione con due utenti presa con successo",
            conversation,
            statusCode: 200
        })
    } catch (error) {
        res.status(500).send({
            message: "C'è un errore nel server",
            statusCode: 500,
            error
        })
    }
})

module.exports = router;
