// Take in a request which requires authentication.
// If authentication fails, return error 401.
// If authenticated, go next() to process further.
exports.requireAuth = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};