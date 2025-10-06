import jwt from "jsonwebtoken"

export function auth(req,res,next){
    const token = req.headers["authorization"]?.split(" ")[1];

    if(!token) return res.status(401).json({error:"Unathorized"});

    try{
        const decoded = jwt.verify(token, "mysupertoken");
        req.user = decoded
    }catch(err){
        res.status(401).json({error: "Invalid token"});
    }
}