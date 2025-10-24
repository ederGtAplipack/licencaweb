const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        "/api",
        createProxyMiddleware({
            target: "http://localhost:14900",
            changeOrigin: true,
            logLevel: "debug",
            secure: false,
        })
    );
};
