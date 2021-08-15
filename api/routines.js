const express           = require("express");
const routinesRouter    = express.Router();
//const {Router}        = require("express");
//const routinesRouter  = Router();
const {verifyToken}     = require('../utils')
const {getAllPublicRoutines,createRoutine, updateRoutine, getRoutineById, destroyRoutine, addActivityToRoutine, getAllRoutinesByUser}                = require("../db");

routinesRouter.use((req, res, next) => {
    console.log("A request is being made to /activities");
    next();
});

routinesRouter.get("/", async(req ,res ,next) => {
    try{
        const routines = await getAllPublicRoutines();
        res.send(routines)
    }catch(error){
        next(error)
    }
});

routinesRouter.post("/", async(req, res, next) => {
    const {name, goal, isPublic } = req.body;
    const headersAuth  = req.headers.authorization;

    try{

    if(!headersAuth) return res.status(403).send({ message: `Please login` });

    const verifiedToken = verifyToken(headersAuth);

    verifiedToken 
    ? res.send(await createRoutine({creatorId: verifiedToken.id, isPublic, name, goal }))
    : res.status(403).send({ message: `Please login` });
            
    }catch(error){
        next(error)
    }
})

routinesRouter.patch("/:routineId", async(req, res, next) => {
    const { routineId }             = req.params;
    const {name, goal, isPublic}    = req.body;
    const headersAuth = req.headers.authorization;

    try{
        if (!headersAuth) return res.status(403).send({ message: `Please login` });

        const verifiedToken     = verifyToken(headersAuth);
        const routineToUpdate   = await getRoutineById(routineId)

        verifiedToken.id === routineToUpdate.creatorId
        ? res.send(await updateRoutine({id: routineId, name, isPublic, goal}))
        : res.status(403).send({ message: `Routine creator not logged in` });
            
    }catch(error){
        next(error)
    }
})

routinesRouter.delete("/:routineId", async(req, res, next) => {

    const { routineId }  = req.params;
    const headersAuth    = req.headers.authorization;

    try{
        if (!headersAuth) return res.status(403).send({ message: `Please login` });
       
        const verifiedToken      = verifyToken(headersAuth);
        const routineToDelete    = await getRoutineById(routineId);

        verifiedToken.id === routineToDelete.creatorId
        ? res.send(await destroyRoutine(routineId))
        : res.status(403).send({ message: `Routine creator not logged in` });
            
        
    }catch(error){
        next(error)
    }
})

routinesRouter.post("/:routineId/activities", async(req, res, next) => {
    const { routineId }                     = req.params;
    const { activityId, duration, count}    = req.body;

    try{
        const activity = await addActivityToRoutine({routineId, activityId, duration, count});
        res.send(activity)
    }catch(error){
        next(error)
    }
})

module.exports = routinesRouter