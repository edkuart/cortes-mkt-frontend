// next.config.js
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/ia',
        destination: 'http://localhost:4000/api/ia',
      },
    ];
  },
};
