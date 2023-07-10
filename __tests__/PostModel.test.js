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
    let postagem;
    
    test('Criar um post', async () => {
        postagem = await post.create();
        expect(postagem.title).toBe(testBody.title);
    });

    test('Ler todos os posts', async () => {
        let PostList = await PostModel.readAll();
        let ListLen = PostList.length;
        expect(ListLen >= 0).toBe(true);
    });

    test('Ler todos os posts de um usuário', async () => {
        let PostList = await PostModel.readByUser(testBody.user);
        let ListLen = PostList.length;
        expect(ListLen >= 0).toBe(true);
    });

    test('Ler todos os posts sobre um tópico', async () => {
        let word = testBody.title.split(" ")[0];
        let PostList = await PostModel.readFilter(word);
        let ListLen = PostList.length;
        expect(ListLen >= 0).toBe(true);
    });

    test('Deletar um post', async () => {
        const id = postagem._id.toString('hex');
        let DelPost = await PostModel.delete(id);
        expect(DelPost.title).toBe(testBody.title);
    });
})
