const rateLimit = require('express-rate-limit');
const { validateRequest } = require('../utils/request.validator');

// Limitar intentos de requests
const cardRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos por ventana
});

// Validar headers de seguridad
const securityHeaders = (req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
};

// Validar origen de la petición
const validateOrigin = (req, res, next) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
  if (!allowedOrigins.includes(req.headers.origin)) {
    return res.status(403).json({ error: 'Origen no permitido' });
  }
  next();
};

module.exports = {
  cardRateLimiter,
  securityHeaders,
  validateOrigin
};