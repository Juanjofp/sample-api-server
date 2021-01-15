let getTokenFromHeader = function getTokenFromHeader(req) {
    if (req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};
let getTokenFromQuerystring = function getTokenFromQuerystring(req) {
    if (req.query && req.query.token) {
       return req.query.token;
    }
    return null;
};

let authHelper = {
    getToken: function getTokenFromHeaderOrQuerystring(req) {
        let token = getTokenFromHeader(req);
        if (!token) {
            token = getTokenFromQuerystring(req);
        }
        console.log('token', req.originalUrl, token);
        return token;
    },
    handleUnauthorizedRequest: function handleUnauthorizedRequest(err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            res.status(401).json({
                code: 401,
                message: 'Unauthorized'
            });
        }
    }
};
export default authHelper;
