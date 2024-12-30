import jwt from "jsonwebtoken";
const { TOKEN_SECRET } = process.env;

const authenticate = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
        return res.status(403).json({ error: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, TOKEN_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token is not valid' });
    }
};

export default authenticate;