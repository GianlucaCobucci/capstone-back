const router = require("express").Router()
const User = require("../models/User.js")
const bcrypt = require("bcrypt")

//update utente
router.patch('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            console.log(req.body.password)
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (error) {
                res.status(500).send({
                    message: "Errore nel server",
                    statusCode: 500,
                    error
                })
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body)
            res.status(200).send({
                message: "l'tente è stato modificato con successo",
                statusCode: 200,
                user
            })
        } catch (error) {
            res.status(500).send({
                error,
                message: "Errore nel server",
                statusCode: 500
            });
        }
    } else {
        res.status(403).send({
            message: "Puoi modificare solo il tuo account",
            statusCode: 403
        })
    }
})

//delete utente
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).send({
                message: "L'utente è stato eliminato con successo",
                statusCode: 200,
                user
            })
        } catch (error) {
            res.status(500).send({
                error,
                message: "Errore nel server",
                statusCode: 500
            })
        }
    }
})

//get utente
router.get("/", async (req, res) => {
    const userId = req.query.userId
    const username = req.query.username

    try {
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username: username })
        res.status(200).send({
            message: "L'utente è stato trovato con successo",
            statusCode: 200,
            user
        })
    } catch (error) {
        res.status(500).send({
            error,
            message: "Errore nel server",
            statusCode: 500
        })
    }
})

//get tutti utenti
router.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send({
            message: "Tutti gli utenti trovati con successo",
            statusCode: 200,
            users,
        });
    } catch (error) {
        res.status(500).send({
            error,
            message: "Errore nel server",
            statusCode: 500,
        });
    }
});

//get amici
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send({
                message: "Utente non trovato",
                statusCode: 404,
            });
        }
        //se l'utente ha degli amici, li cerchiamo tutti in una volta nel database 
        //utilizzando $in di MongoDB. Se "followings" non esiste o è vuoto, 
        //impostiamo friends su un array vuoto
        const friends = user.followings ? await User.find({ _id: { $in: user.followings } }) : [];
        let friendList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend;//estrae _id, username e profilePicture da friend.
            friendList.push({ _id, username, profilePicture });//aggiungo nuovo oggetto con questi dati all'array
        });
        res.status(200).send({
            message: "Amici recuperati con successo",
            friendList
        });
    } catch (error) {
        res.status(500).send({
            error,
            message: "Errore nel server",
            statusCode: 500,
        });
    }
});


//follow utente
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ _id: req.params.id }, { $push: { followers: req.body.userId } });
                await currentUser.updateOne({ _id: req.body.userId }, { $push: { followings: req.params.id } });
                res.status(200).send({
                    message: "Bene, ora segui l'utente",
                    statusCode: 200,
                })
            } else {
                res.status(403).send({
                    message: "Già segui l'utente",
                    statusCode: 403
                })
            }
        } catch (error) {
            res.status(500).send({
                error,
                message: "Errore nel server",
                statusCode: 500
            });
        }
    } else {
        res.status(403).send({
            message: "Non puoi seguire te stesso",
            statusCode: 403
        })
    }
})

//unfollow utente
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ _id: req.params.id }, { $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ _id: req.body.userId }, { $pull: { followings: req.params.id } });
                res.status(200).send({
                    message: "L'utente non è più seguito",
                    statusCode: 200,
                });
            } else {
                res.status(403).send({
                    message: "Non segui più questo utente"
                });
            }
        } catch (error) {
            res.status(500).send({
                error,
                message: "Errore nel server",
                statusCode: 500
            });
        }
    } else {
        res.status(403).send({
            message: "Non puoi non seguire più te stesso",
            statusCode: 403
        });
    }
});

router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const userPosts = await Post.find({ userId: user._id });
        res.status(200).send({
            user,
            posts: userPosts,
            message: "Profilo utente trovato con successo",
            statusCode: 200
        });
    } catch (error) {
        res.status(500).send({
            error,
            message: "Errore nel server",
            statusCode: 500
        });
    }
});

module.exports = router