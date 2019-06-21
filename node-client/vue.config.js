module.exports = {
    lintOnSave:false,
    baseUrl:"./",
    devServer: {
        overlay: {
            warnings: false,
            errors: false
        },
        proxy:{
            '/api': {
                target: 'http://localhost:3000/',
                changeOrigin: true,
                secure: false
            },
            '/thum': {
                target: 'http://localhost:3000/',
                changeOrigin: true,
                secure: false
            }
        }
    },
    productionSourceMap:false
  }