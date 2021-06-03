const express           = require("express");
const routinesRouter    = express.Router();
const jwt               = require("jsonwebtoken");
const {getAllPublicRoutines,createRoutine, updateRoutine, getRoutineById, destroyRoutine, addActivityToRoutine}                = require("../db");

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
    const {name, goal, isPublic } = req.body
    try{
    if(req.headers.authorization){
        const [, token]         = req.headers.authorization.split("Bearer ");
        const validatedToken    = jwt.verify(token, process.env.JWT_SECRET);

        if(validatedToken){
            const routine = await createRoutine({creatorId:validatedToken.id, isPublic, name, goal });
            res.send(routine)
        }else{
            res.status(403).send({ message: `Please login` });
        }
    }else{
        res.status(403).send({ message: `Please login` });
    }
    }catch(error){
        next(error)
    }
})

routinesRouter.patch("/:routineId", async(req, res, next) => {
    const { routineId }             = req.params;
    const {name, goal, isPublic}    = req.body;

    try{
        if(req.headers.authorization){

            const [, token]         = req.headers.authorization.split("Bearer ");
            const validatedToken    = jwt.verify(token, process.env.JWT_SECRET);
            const routineToUpdate   = await getRoutineById(routineId)

            if(validatedToken.id === routineToUpdate.creatorId){
                const routine       = await updateRoutine({id: routineId, name, isPublic, goal});
                res.send(routine)
            }else{
                res.status(403).send({ message: `Routine creator not logged in` });
            } 
        }
    }catch(error){
        next(error)
    }
})

routinesRouter.delete("/:routineId", async(req, res, next) => {

    const { routineId }  = req.params;
    
    try{
        if(req.headers.authorization){
            const [, token]             = req.headers.authorization.split("Bearer ");
            const validatedToken        = jwt.verify(token, process.env.JWT_SECRET);
            const routineToUpdate       = await getRoutineById(routineId)

            if(validatedToken.id === routineToUpdate.creatorId){
                const routine       = await destroyRoutine(routineId);
                res.send(routine)
            }else{
                res.status(403).send({ message: `Routine creator not logged in` });
            } 
        }
    }catch(error){

    }
})

routinesRouter.post("/:routineId/activities", async(req, res, next) => {
    //console.log("params: ",req.params);
    console.log("body: ", req.body);
    const {routineId} = req.params;
    const { activityId, duration, count} = req.body;

    try{
        const activity = await addActivityToRoutine({routineId, activityId, duration, count});
        res.send(activity)
    }catch(error){
        next(error)
    }
})

module.exports = routinesRouter