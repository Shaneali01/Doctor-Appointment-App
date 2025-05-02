import jwt from 'jsonwebtoken';

// Named function with export default
const verifyToken = (req, res, next) => {
  // Get the Authorization header
  const authHeader = req.headers.authorization;

  // Check if header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided or invalid format" });
  }

  // Extract token by splitting and taking the second part
  const token = authHeader.split(" ")[1];

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Attach decoded payload to req.user
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    } else {
      return res.status(500).json({ message: "Server error during token verification",error });
    }
  }
};

export default verifyToken;