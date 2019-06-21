module.exports = {
    apps: [{
      name: "node-blog",
      script: "./dist/index.js",
      error_file:"./logs/logs-error.log",
      out_file:"./logs/logs-out.log",
      env: {
        NODE_ENV: "production",
      },
      env_dev: {
        NODE_ENV: "development"
      }
    }]
}
