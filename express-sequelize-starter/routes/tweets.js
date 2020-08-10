const express = require("express");
const router = express.Router();
const db = require("../db/models");
const { Tweet } = db;
const { asyncHandler, handleValidationErrors } = require("../utils.js")
const { check, validationResult } = require("express-validator");




router.get("/", asyncHandler(async (req, res) => {
        const tweets = await Tweet.findAll();
        res.json({tweets});
    })
);
const validateTask = [
    check("message")
        .exists( { checkFalsy: true} )
        .withMessage("Tweet message can't be empty."),
    check("message")
        .isLength({max: 280})
        .withMessage("Tweet must be less than 280 charachters")
]



const tweetNotFoundError = (id) => {
    const err = Error(`Tweet with id of ${id} could not be found.`);
    err.title = "Tweet not found.";
    err.status = 404;
    return err;
};


router.get("/:id(\\d+)", asyncHandler(async (req, res) => {
    const tweet = await Tweet.findOne({
        where: {
            id: req.params.id
        }
    });
    res.json({ tweet });
    })
);

router.post("/",
    validateTask,
    handleValidationErrors,
    asyncHandler( async (req, res) => {
        console.log(req.body);
        const { message } = req.body ;
        const tweet = await Tweet.create( { message });
        res.status(201).json({ message });
    })
)

router.put("/:id(\\d+)",
    validateTask,
    handleValidationErrors,
    asyncHandler(async (req, res, next) => {
        const tweetId = Number(req.params.id);
        const tweet = await Tweet.findByPk(tweetId);
        if(tweet) {
           const updated = await tweet.update({ message: req.body.message});
           res.json(updated);

        } else {
            next(tweetNotFoundError(tweetId));
        }
    })
)

router.delete(
    "/:id(\\d+)",
    asyncHandler(async (req, res, next) => {
        const tweetId = Number(req.params.id);
        const tweet = await Tweet.findByPk(tweetId);
        if (tweet) {
            await tweet.destroy();
            res.status(204).end()
        } else {
            next(tweetNotFoundError(tweetId));
        }
    })
)


module.exports = router;
