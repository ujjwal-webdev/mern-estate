import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        const err = new Error("Unauthorized");
        err.statusCode = 401;
        return next(err);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            err.statusCode = 403;
            return next(err);
        }

        req.user = user;
        next();
    });
}