const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { createUser, getUserByUsername } = require("../db");
// const {hash} = require('../db/hash')

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");
  next();
});

usersRouter.post("/register", async (req, res, next) => {
  console.log("/register body :", req.body);
  const { username, password } = req.body;
    
  try {
    const _user = await getUserByUsername(username);
    if (_user) {
      next({
        name: "UserExistsError",
        message: "A user by that username already exists.",
      });
    };

    if(password.length < 8 ){
        next({
            name: "PasswordLengthError",
            message: "Password must be at least 8 characters.",
          });
    };


    const user = await createUser({ username, password });
    console.log("new user: ", user);
    const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, {expiresIn: "1w"});

    res.send(
        {
        user:{id: user.id, username: user.username},
        message: "Thank you for signing up",
        token,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = usersRouter;
