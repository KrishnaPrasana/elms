import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import dotenv from "dotenv";

dotenv.config();

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findByPk(decoded.id);
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Not authorized, token invalid" });
    }
};
