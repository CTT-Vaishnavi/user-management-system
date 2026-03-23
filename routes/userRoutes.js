const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// 🔹 Create User (Register)
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// 🔹 Login User
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, "secretkey", {
            expiresIn: "1h"
        });

        res.json({ token });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// 🔹 Get All Users
router.get("/", auth, async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// 🔹 Get Single User
router.get("/:id", auth, async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
});

// 🔹 Update User
router.put("/:id", auth, async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updatedUser);
});

// 🔹 Delete User
router.delete("/:id", auth, async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
});

module.exports = router;