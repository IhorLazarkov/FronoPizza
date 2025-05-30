module.exports = {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8000,
    websocket_port: process.env.WEBSOCKET_PORT || 8001,
    dbFile: process.env.DB_FILE,
    jwtConfig: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN
    },
    googleMapsAPIKey: process.env.MAPS_API_KEY
  };