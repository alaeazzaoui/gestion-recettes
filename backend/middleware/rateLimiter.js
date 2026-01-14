const cacheService = require('../cache-service');

/**
 * Middleware de rate limiting
 * @param {number} maxRequests - Nombre maximum de requêtes
 * @param {number} windowSeconds - Fenêtre de temps en secondes
 */
const rateLimiter = (maxRequests = 100, windowSeconds = 60) => {
  return async (req, res, next) => {
    try {
      // Utiliser l'adresse IP comme identifiant
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const key = `rate:${ip}`;

      // Incrémenter le compteur
      const requests = await cacheService.increment(key);

      // Si c'est la première requête, définir l'expiration
      if (requests === 1) {
        await cacheService.expire(key, windowSeconds);
      }

      // Vérifier si la limite est dépassée
      if (requests > maxRequests) {
        return res.status(429).json({
          success: false,
          message: 'Trop de requêtes. Veuillez réessayer plus tard.',
          retryAfter: windowSeconds
        });
      }

      // Ajouter les headers de rate limiting
      res.set({
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': Math.max(0, maxRequests - requests),
        'X-RateLimit-Reset': Date.now() + (windowSeconds * 1000)
      });

      next();
    } catch (error) {
      console.error('Erreur dans le rate limiter:', error);
      // En cas d'erreur Redis, laisser passer la requête
      next();
    }
  };
};

/**
 * Rate limiter strict pour les actions sensibles (création, modification)
 */
const strictRateLimiter = rateLimiter(10, 60); // 10 requêtes par minute

/**
 * Rate limiter normal pour les lectures
 */
const normalRateLimiter = rateLimiter(100, 60); // 100 requêtes par minute

/**
 * Rate limiter léger pour les endpoints publics
 */
const lightRateLimiter = rateLimiter(200, 60); // 200 requêtes par minute

module.exports = {
  rateLimiter,
  strictRateLimiter,
  normalRateLimiter,
  lightRateLimiter
};