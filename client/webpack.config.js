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

//Verificando a variavel setado na hora da execução, se for prod nós criamos um plugin e adicionamos nas configs do module
//dessa forma fazemos build de prod com arquios minificados etc...
let plugins = [];
if(process.env.NODE_ENV == 'production') {
    plugins.push(new babiliPlugin());
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
            }
        ]
    },
    plugins
}