
import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication token is required',
            });
        }

        const token = authHeader.split(' ')[1];
        const tokenSecret = process.env.JWT_SECRET;

        if (!tokenSecret) {
            return res.status(500).json({
                success: false,
                message: 'Server authentication is not configured',
            });
        }

        const decoded = jwt.verify(token, tokenSecret);

        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};
