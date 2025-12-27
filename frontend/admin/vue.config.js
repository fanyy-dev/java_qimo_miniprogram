module.exports = {
  devServer: {
    port: 8083,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  lintOnSave: false
};
