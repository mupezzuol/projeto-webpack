/*

entry -> Qual primeiro módulo que será carregado na minha aplicação
output -> Onde será a saída do meu bundle...

module -> Adiciono módulo, dentro dele regras, posso ter várias regras (rules)
- test é para considerar todos os arquivos com finais .js
- exclude é para excluir tudo que ta dentro dessa pasta 'node_modules'
- use é onde passamos que loader iremos usar, nesse caso o babel

*/


//Módulo do webpack para nos retornar o caminho de onde está o módulo
// __dirname -> Pega o caminho do módulo e concatena com o 'dist' passado, montando o path que nós importaremos no 'index.html'
const path = require('path');
const babiliPlugin = require('babili-webpack-plugin');//Plugin do babili
const extractTextPlugin = require('extract-text-webpack-plugin');//plugin para usar com o CSS para jogar no link
const optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');//plugin para comprimir meu css
const webpack = require('webpack'); //Webpack


//Verificando a variavel setado na hora da execução, se for prod nós criamos um plugin e adicionamos nas configs do module
//dessa forma fazemos build de prod com arquios minificados etc...
let plugins = [];

plugins.push(
    new webpack.ProvidePlugin({
        '$': 'jquery/dist/jquery.js',
        'jQuery': 'jquery/dist/jquery.js'
    })
);


//Adc plugin do CSS com o nome que será o arquivo CSS que recebrá todo conteúdo do CSS que o bundle.js gerar
plugins.push(
    new extractTextPlugin("styles.css")
);

if (process.env.NODE_ENV == 'production') {

    plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
    plugins.push(new babiliPlugin());
    
    plugins.push(new optimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { 
            discardComments: {
                removeAll: true 
            }
        },
        canPrint: true
     }));    
}


    //Criando nosso módulo do webpack passando as configurações em forma de objeto
    module.exports = {
        entry: './app-src/app.js',
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: 'dist'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },

                //Loader -> será chamado sempre da DIREITA para ESQUERDA
                //Uso o resultado do 'extractTextPlugin' como loade.. fallback se der ruim chamará o style, caso contrário chamara o css-loader
                {
                    test: /\.css$/,
                    use: extractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader'
                    })
                },

                //Abaixo segue LOADERS para tratar arquivos do bootstrap de fontes... (woff, ttf, eot, svg)
                {
                    test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url-loader?limit=10000&mimetype=application/font-woff'
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
                },
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'file-loader'
                },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
                }
            ]
        },
        plugins
    }