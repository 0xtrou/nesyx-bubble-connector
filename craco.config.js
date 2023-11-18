const baseExports = {
    webpack: {
        ignoreWarnings: [
            {
                module: /node_modules\/@walletconnect/,
            },
            {
                module: /node_modules\/eth-rpc-errors/,
            },
            {
                module: /node_modules\/json-rpc-engine/,
            },
            {
                module: /node_modules\/@metamask/,
            },
            {
                module: /node_modules\/@gnosis.pm/,
            },
        ],
    },
    plugins: [
        {
            plugin: require("craco-plugin-scoped-css"),
        },
    ],
};

if (process.env.NODE_ENV === "production") {
    return (module.exports = {
        ...baseExports,
        webpack: {
            ...baseExports.webpack,
            configure: {
                devtool: false,
                entry: "./src/lib.entrypoint.ts",
                output: {
                    filename: "library/lib.entrypoint.js",
                    library: "NesyxConnect", // Important
                    libraryTarget: "umd", // Important
                    umdNamedDefine: true, // Important
                },
                module: {
                    rules: [
                        {
                            test: /\.(png|jpg|gif|otf)$/i,
                            type: "asset/inline",
                        },
                    ],
                },
            },
        },
    });
}

return (module.exports = baseExports);
