import { Request, Response, NextFunction } from "express";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });
if (token=='k5s1c7v58g1f6j2m7t9b3q5' || 'g5h2j8n8e9w3s54af17t5hf1c7'){
    console.log(token)
    next();
}else{
  return res.status(401).json({ message: "Unauthorized" });
}
};
export const patnerAuthToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });
if (token=='k5s1c7v58g1f6j2m7t9b3q5'){
    next();
}else{
    return res.status(401).json({ message: "Unauthorized" });
}
};
export default authenticateToken;
