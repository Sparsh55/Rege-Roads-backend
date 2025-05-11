import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Generate JWT token
export const generateToken = (wallet) => {
  return jwt.sign({ wallet }, JWT_SECRET, { expiresIn: '1h' });
};

// Verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};