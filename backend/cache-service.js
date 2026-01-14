const redisConnection = require('./redis-config');

class CacheService {
  constructor() {
    this.DEFAULT_TTL = 3600; // 1 heure par défaut
  }

  /**
   * Obtenir une valeur du cache
   */
  async get(key) {
    try {
      const client = redisConnection.getClient();
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du cache:', error);
      return null;
    }
  }

  /**
   * Définir une valeur dans le cache avec TTL
   */
  async set(key, value, ttl = this.DEFAULT_TTL) {
    try {
      const client = redisConnection.getClient();
      await client.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la définition du cache:', error);
      return false;
    }
  }

  /**
   * Supprimer une clé du cache
   */
  async del(key) {
    try {
      const client = redisConnection.getClient();
      await client.del(key);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du cache:', error);
      return false;
    }
  }

  /**
   * Supprimer plusieurs clés correspondant à un pattern
   */
  async delPattern(pattern) {
    try {
      const client = redisConnection.getClient();
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression par pattern:', error);
      return false;
    }
  }

  /**
   * Incrémenter un compteur
   */
  async increment(key) {
    try {
      const client = redisConnection.getClient();
      return await client.incr(key);
    } catch (error) {
      console.error('❌ Erreur lors de l\'incrémentation:', error);
      return 0;
    }
  }

  /**
   * Décrémenter un compteur
   */
  async decrement(key) {
    try {
      const client = redisConnection.getClient();
      return await client.decr(key);
    } catch (error) {
      console.error('❌ Erreur lors de la décrémentation:', error);
      return 0;
    }
  }

  /**
   * Ajouter un élément à un set
   */
  async addToSet(key, value) {
    try {
      const client = redisConnection.getClient();
      return await client.sAdd(key, value);
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout au set:', error);
      return 0;
    }
  }

  /**
   * Récupérer tous les éléments d'un set
   */
  async getSet(key) {
    try {
      const client = redisConnection.getClient();
      return await client.sMembers(key);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du set:', error);
      return [];
    }
  }

  /**
   * Ajouter un élément à un sorted set avec un score
   */
  async addToSortedSet(key, score, member) {
    try {
      const client = redisConnection.getClient();
      return await client.zAdd(key, { score, value: member });
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout au sorted set:', error);
      return 0;
    }
  }

  /**
   * Récupérer les éléments d'un sorted set triés par score (descendant)
   */
  async getSortedSet(key, count = 10) {
    try {
      const client = redisConnection.getClient();
      return await client.zRange(key, 0, count - 1, { REV: true });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du sorted set:', error);
      return [];
    }
  }

  /**
   * Récupérer les éléments d'un sorted set avec leurs scores
   */
  async getSortedSetWithScores(key, count = 10) {
    try {
      const client = redisConnection.getClient();
      return await client.zRangeWithScores(key, 0, count - 1, { REV: true });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du sorted set avec scores:', error);
      return [];
    }
  }

  /**
   * Vérifier si une clé existe
   */
  async exists(key) {
    try {
      const client = redisConnection.getClient();
      return await client.exists(key);
    } catch (error) {
      console.error('❌ Erreur lors de la vérification d\'existence:', error);
      return false;
    }
  }

  /**
   * Définir un TTL sur une clé existante
   */
  async expire(key, ttl) {
    try {
      const client = redisConnection.getClient();
      return await client.expire(key, ttl);
    } catch (error) {
      console.error('❌ Erreur lors de la définition du TTL:', error);
      return false;
    }
  }

  /**
   * Obtenir le TTL d'une clé
   */
  async getTTL(key) {
    try {
      const client = redisConnection.getClient();
      return await client.ttl(key);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du TTL:', error);
      return -1;
    }
  }

  /**
   * Vider tout le cache (ATTENTION: à utiliser avec précaution)
   */
  async flushAll() {
    try {
      const client = redisConnection.getClient();
      await client.flushAll();
      console.log('⚠️ Tout le cache Redis a été vidé');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors du vidage du cache:', error);
      return false;
    }
  }
}

// Instance singleton
const cacheService = new CacheService();

module.exports = cacheService;