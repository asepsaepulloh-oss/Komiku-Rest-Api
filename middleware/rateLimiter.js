const rateLimit = require("express-rate-limit");

// Rate limiting middleware configured for cloud proxies (Vercel, Cloud Run, etc.)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    trustProxy: false,
    xForwardedForHeader: false,
    forwardedHeader: false,
    default: false,
  },
  keyGenerator: (req) => {
    return (
      req.ip ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.headers["forwarded"] ||
      req.socket?.remoteAddress ||
      "127.0.0.1"
    );
  },
  message: {
    error:
      "Terlalu banyak request dari IP ini, silakan coba lagi setelah 15 menit",
  },
});

module.exports = limiter;
