const jwt = require('jsonwebtoken');

const authMiddleware = (roles) => (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (roles && !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
