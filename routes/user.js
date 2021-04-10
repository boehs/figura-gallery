const express = require("express");
const {
    check,
    validationResult
} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");

const User = require("../model/User");
const Link = require("../model/Link");

router.post(
    "/signup",
    [
        check("username", "Please Enter a Valid Username")
        .not()
        .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 8
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            username,
            email,
            password
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }

            user = new User({
                username,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

router.post(
    "/login",
    [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 8
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            email,
            password
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (!user)
                return res.status(400).json({
                    message: "User Not Exist"
                });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({
                    message: "Incorrect Password !"
                });

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 3600
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: "Server Error"
            });
        }
    }
);

router.get("/me", auth, async (req, res) => {
    try {
        // request.user is getting fetched from Middleware after token authentication
        const user = await User.findById(req.user.id);
        return res.status(200).json(user);
    } catch (e) {
        return res.status(400).json({
            message: "Error in Fetching user"
        });
    }
});

router.post("/start-link", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const code = await generateCode()
        const email = user.email;
        const {
            username
        } = req.body;

        let link = await Link.findOne({
            email
        });

        if (link) {
            return res.status(400).json({
                message: "User already linking"
            });
        }

        link = await Link.findOne({
            username
        });

        if (link) {
            return res.status(400).json({
                message: "User already getting linked"
            });
        }

        link = new Link({
            code,
            email,
            username,
        })
        await link.save();
        return res.status(200).json({
            message: "Success!"
        });
    } catch (e) {
        return res.status(500).json({
            message: "Error in starting link"
        });
    }
});

router.post("/stop-link", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const code = await generateCode()
        const email = user.email;
        const {
            code,
            username
        } = req.body;

        let link = await Link.findOne({
            email
        });

        if (!link) {
            return res.status(404).json({
                message: "Link not found"
            });
        }

        if (link.code != code) {
            return res.status(400).json({
                message: "Wrong code"
            });
        }

        let user = await User.findOne({
            email
        });

        user.uuid = link.uuid

        await user.save();
        return res.status(200).json({
            message: "Success!"
        });
    } catch (e) {
        return res.status(500).json({
            message: "Error in stopping link"
        });
    }
});

router.get("/code/:username", async (req, res) => {
    if (req.header("token") == process.env.token) {
        try {
            let username = req.params.username;
            const link = await Link.findOne({
                username
            });

            if (link) {
                link.uuid = req.header("uuid");
                link.save()
                return res.status(200).json(link);
            } else {
                return res.status(404).json({
                    message: "No pending links"
                });
            }
        } catch (e) {
            return res.status(500).json({
                message: "Error in Fetching link"
            });
        }
    } else {
        return res.status(401).json({
            message: "Authentication failed"
        });
    }
});

module.exports = router;

async function generateCode() {
    code = Math.floor(100000 + Math.random() * 900000);
    link = await Link.findOne({
        code
    });
    if (link) {
        await generateCode();
    } else {
        return code
    }
}