const path = require("path");

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "src"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "/",
    },
    resolve: {
        extensions: [".js", ".jsx", ".css"],
    },
    devServer: {
        historyApiFallback: true,
    },
    module: {
        rules: [{
            test: /\.jsx?/,
            loader: "babel-loader",
        },
        {
            test: /\.css$/,
            use: [
                "style-loader",
                {
                    loader: "css-loader",
                    options: {
                        importLoaders: 1,
                        modules: true,
                    },
                },
            ],
            include: /\.module\.css$/,
        },
        {
            test: /\.css?/,
            use: ["style-loader", "css-loader"],
            exclude: /\.module\.css$/,
        },
        {
            test: /\.(png|svg|jpg|gif|jpeg)$/,
            use: [
                "file-loader",
            ],
        },

        {
            test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
            loader: require.resolve("file-loader"),
            options: {
                name: "static/media/[name].[hash:8].[ext]",
            },
        },
        ],
    },
};
