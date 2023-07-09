let PostModel = require('../src/models/PostModel');
let database = require('../src/database/mongo');

// Observação: Por causa do banco de dados
// os testes não vão encerrar sozinhos, porem
// Ligar e desligar o banco pra cada arquivo de
// teste não parece uma boa ideia também
// para encerrar os tester apenas aperte Ctrl + C.

const dbConn = 'Database connected';
database.connect()
.then(() => {
    console.log(dbConn);
}).catch(err => console.log(err));;

describe("Funções de posts",() =>{

    let testBody = {
        user: "64a3323eb30a754c88ede1c6",
        title: "Titulo de teste",
        content: "Conteudo de Teste"
    };

    let post = new PostModel(testBody);

    test('Criar um post', async () => {
        let postagem = await post.create();
        expect(postagem.title).toBe(testBody.title);
    });
})
