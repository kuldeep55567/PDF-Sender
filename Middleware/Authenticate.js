const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Missing token" });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET);
        req.email = decodedToken.email;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = { verifyToken };
