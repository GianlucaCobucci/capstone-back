const router = require("express").Router()
const Post = require("../models/Post")
const User = require("../models/User")

//crea un post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).send({
            statusCode: 200,
            message: "Post creato con successo",
            savedPost
        })
    } catch (error) {
        res.status(500).send({
            error,
            message: "Errore nel server",
            statusCode: 500
        })
    }
})

//aggiorna un post
router.patch("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).send({
                message: "Il post è stato modificato con successo",
                statusCode: 200,
                post
            });
        } else {
            res.status(403).send({
                message: "Puoi modificare solo il tuo post",
                statusCode: 403
            });
        }
    } catch (error) {
        res.status(500).send({
            error,
            message: "Errore nel server",
            statusCode: 500
        })
    }
});

//cancella un post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne({ $set: req.body });
            res.status(200).send({
                message: "Il post è stato eliminato con successo",
                statusCode: 200,
                post
            });
        } else {
            res.status(403).send({
                message: "Puoi eliminare solo il tuo post",
                statusCode: 403
            });
        }
    } catch (error) {
        res.status(500).send({
            error,
            message: "Errore nel server",
            statusCode: 500
        })
    }
});

//mi piace o non mi piace un post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).send({
                statusCode: 200,
                message: "Hai messo mi piace al post",
                post
            })
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).send({
                statusCode: 200,
                message: "Hai tolto mi piace al post"
            })
        }
    } catch (error) {
        res.status(500).send({
            error,
            message: "Errore nel server",
            statusCode: 500
        })
    }
})

//recupera un post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).send({
            statusCode: 200,
            message: "Post trovato con successo",
            post,
        })
    } catch (error) {
        res.status(500).send({
            error,
            message: "Errore nel server",
            statusCode: 500
        })
    }
})

//recupera tutti i post di un autore
router.get("/timeline/:userId", async (req, res) => {
    try {
        const userPosts = await Post.find({ userId: req.params.userId });
        res.status(200).send({
            statusCode: 200,
            message: "Post trovati con successo",
            userPosts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            error,
            message: "Errore nel server",
            statusCode: 500
        });
    }
});

//recupera tutti i post 
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find()
        res.status(200).send({
            statusCode: 200,
            message: "Tutti i post trovati con successo",
            posts,
        })
    } catch (error) {
        res.status(500).send({
            error,
            message: "Errore nel server",
            statusCode: 500
        })
    }
})

router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
        const posts = await Post.find({ userId: user.id });
        res.status(200).send({
            message: "Profilo utente trovato con successo",
            posts,
            statusCode: 200
        })

    } catch (error) {
        res.status(500).send({
            error,
            message: "Errore nel server",
            statusCode: 500
        });
    }
});

module.exports = router;
