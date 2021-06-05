const express           = require('express');
const activitiesRouter  = express.Router();
const {verifyToken}          = require("../utils");
const {getAllActivities, createActivity, updateActivity, getPublicRoutinesByActivity} = require('../db');

activitiesRouter.use((req, res, next) => {
    console.log("A request is being made to /activities");
    next();
  });

activitiesRouter.get("/", async(req, res, next) => {
    try{
        const activities = await getAllActivities()
        res.send(activities)
    }catch(error){
        next(error);
    }
})

activitiesRouter.post("/", async(req, res, next)=>{
    const {name, description} = req.body;
    const headersAuth = req.headers.authorization;

    try{
        if (!headersAuth) return res.status(403).send({ message: `Please login` });
        const verifiedToken = verifyToken(headersAuth);
       
        verifiedToken 
        ? res.send(await createActivity({name, description}))
        : res.status(403).send({ message: `Please login` });

    }catch(error){
        next(error);
    }
})

activitiesRouter.patch("/:activityId", async (req, res, next) => {
    const { activityId }            = req.params;
    const { name, description }     = req.body;
    const headersAuth = req.headers.authorization;

    try{
        if (!headersAuth) return res.status(403).send({ message: `Please login` });
            const verifiedToken = verifyToken(headersAuth);

            verifiedToken
            ? res.send(await updateActivity({id: activityId, name, description}))
            :res.status(403).send({ message: `Please login` });
    }catch(error){
        next(error)
    }
});

activitiesRouter.get("/:activityId/routines", async(req, res, next)=>{
    const { activityId } = req.params;
    try{
        const activities = await getPublicRoutinesByActivity({id: activityId});
        res.send(activities);
    }catch(error){
        next(error)
    }
});


module.exports = activitiesRouter