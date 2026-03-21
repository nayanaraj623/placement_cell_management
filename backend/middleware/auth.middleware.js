const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(' ')[1];
    }
    
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized / Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Require Admin Role' });
    }
};

exports.isCompany = (req, res, next) => {
    if (req.user && req.user.role === 'Company') {
        next();
    } else {
        res.status(403).json({ message: 'Require Company Role' });
    }
};

exports.isStudent = (req, res, next) => {
    if (req.user && req.user.role === 'Student') {
        next();
    } else {
        res.status(403).json({ message: 'Require Student Role' });
    }
};

exports.isAdminOrCompany = (req, res, next) => {
    if (req.user && (req.user.role === 'Admin' || req.user.role === 'Company')) {
        next();
    } else {
        res.status(403).json({ message: 'Require Admin or Company Role' });
    }
};
