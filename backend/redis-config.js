const { createClient } = require('redis');

class RedisConnection {
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.log('❌ Trop de tentatives de reconnexion Redis. Connexion terminée.');
            return new Error('Trop de tentatives de reconnexion.');
          }
          return retries * 500; // Attendre 500ms * nombre de tentatives
        }
      }
    });

    // Gestion des événements
    this.client.on('error', (err) => {
      console.error('❌ Erreur Redis Client:', err);
    });

    this.client.on('connect', () => {
      console.log('🔄 Connexion à Redis en cours...');
    });

    this.client.on('ready', () => {
      console.log('✅ Redis connecté avec succès');
    });

    this.client.on('reconnecting', () => {
      console.log('🔄 Reconnexion à Redis...');
    });

    this.client.on('end', () => {
      console.log('⚠️ Connexion Redis fermée');
    });
  }

  /**
   * Connecter à Redis
   */
  async connect() {
    if (!this.client.isOpen) {
      try {
        await this.client.connect();
        console.log('✅ Redis prêt à être utilisé');
      } catch (error) {
        console.error('❌ Erreur lors de la connexion à Redis:', error);
        throw error;
      }
    }
  }

  /**
   * Déconnecter de Redis
   */
  async disconnect() {
    if (this.client.isOpen) {
      try {
        await this.client.disconnect();
        console.log('✅ Redis déconnecté proprement');
      } catch (error) {
        console.error('❌ Erreur lors de la déconnexion Redis:', error);
      }
    }
  }

  /**
   * Obtenir le client Redis
   */
  getClient() {
    return this.client;
  }

  /**
   * Vérifier si Redis est connecté
   */
  isConnected() {
    return this.client.isOpen;
  }

  /**
   * Ping Redis pour vérifier la connexion
   */
  async ping() {
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch (error) {
      console.error('❌ Erreur lors du ping Redis:', error);
      return false;
    }
  }
}

// Instance singleton
const redisConnection = new RedisConnection();

module.exports = redisConnection;