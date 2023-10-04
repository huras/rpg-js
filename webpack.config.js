const path = require( 'path' );
const ForkTsCheckerWebpackPlugin = require( 'fork-ts-checker-webpack-plugin' );

module.exports = {
    devtool: 'source-map',  // generate source map

    // bundling mode
    mode: 'development',

    // entry files
    entry: {
        'rpg': './src/rpg.js',
    },

    // output bundles (location)
    output: {
        path: path.resolve( __dirname, '.' ),
        filename: '[name].js',
    },

    // file resolutions
    resolve: {
        extensions: [ '.ts', '.js', '.tsx', '.json' ],
    },

    performance : {
        hints : false,
    },

    // loaders
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    }
                },
                exclude: /node_modules/,
            }
        ]
    },

    // set watch mode to `true`
    watch: false
};
