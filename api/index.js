// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express                   = require('express');
const apiRouter                 = express.Router();
const usersRouter               = require('./users')
const activitiesRouter          = require('./activities')
const routinesRouter            = require('./routines')
const routineActivitiesRouter   = require('./routine_activities')
require('dotenv').config();

apiRouter.get("/health", (req,res,next) => {
    res.send({message:"All is good on /api/health!"});
    next();
})

apiRouter.use('/users', usersRouter);
apiRouter.use('/activities', activitiesRouter);
apiRouter.use('/routines', routinesRouter);
apiRouter.use('/routine_activities', routineActivitiesRouter);

module.exports = apiRouter
