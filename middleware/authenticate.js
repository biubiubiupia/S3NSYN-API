import jwt from "jsonwebtoken";
const { JWT_SECRET } = process.env;

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
        return res.status(403).json({ error: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
    } catch (error) {
        return res.status(401).json({ error: 'Token is not valid' });
    }
};

export default authenticate;