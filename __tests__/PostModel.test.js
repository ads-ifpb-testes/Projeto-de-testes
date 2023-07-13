let {Post, PostModel} = require('../src/models/PostModel');
const mockingoose = require('mockingoose');

// Observação: Por causa do banco de dados
// os testes não vão encerrar sozinhos, porem
// Ligar e desligar o banco pra cada arquivo de
// teste não parece uma boa ideia também
// para encerrar os tester apenas aperte Ctrl + C.

describe("Funções de posts",() =>{

    let testBody = {
        user: "64a3323eb30a754c88ede1c6",
        title: "Titulo de teste",
        content: "Conteudo de Teste"
    };

    beforeEach(() => {
        mockingoose.resetAll()
        // create
        mockingoose(PostModel).toReturn(testBody, 'save');
        // find
        mockingoose(PostModel).toReturn([{
          user: '64a33248b30a754c88ede1cd',
          title: 'Titulo de mock find',
          content: 'Sim, o mock funcionou'
        }], 'find');
        // delete
        mockingoose(PostModel).toReturn([{
          user: '64a33248b30a754c88ede1cd',
          title: 'Titulo de mock delete',
          content: 'Sim, o mock funcionou'
        }], 'findOneAndDelete');
      })

    let post = new Post(testBody);
    let postagem;
    
    test('Criar um post', async () => {
        postagem = await post.create();
        expect(postagem.title).toBe(testBody.title);
    });

    test('Ler todos os posts', async () => {
        let PostList = await Post.readAll();
        let ListLen = PostList.length;
        expect(ListLen >= 0).toBe(true);
    });

    test('Ler todos os posts de um usuário', async () => {
        let PostList = await Post.readByUser(testBody.user);
        let ListLen = PostList.length;
        expect(ListLen >= 0).toBe(true);
    });

    test('Ler todos os posts sobre um tópico', async () => {
        let word = testBody.title.split(" ")[0];
        let PostList = await Post.readFilter(word);
        let ListLen = PostList.length;
        expect(ListLen >= 0).toBe(true);
    });

    test('Deletar um post', async () => {
        let PostList = await Post.readByUser(testBody.user);
        /* console.log(PostList); */
        const id = PostList[0]._id.toString('hex');
        let DelPost = await Post.delete(id);
        /* console.log(DelPost); */
        expect(DelPost[0].title).toBe('Titulo de mock delete');
    });
})
