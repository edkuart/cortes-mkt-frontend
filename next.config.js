// next.config.js
module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/ia',
          destination: 'http://localhost:4000/api/ia',
        },
      ];
    },
  };
  