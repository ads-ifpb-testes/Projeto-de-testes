const mockingoose = require('mockingoose');
let { Comment, CommentModel } = require('../src/models/CommentModel');

describe("Funções de comentarios", () => {

  let testBody = {
    user: "64a33248b30a754c88ede1cd",
    post: "64a332ddb30a754c88ede202",
    content: 'console.log("Hello Word");'
  }

  beforeEach(() => {
    mockingoose.resetAll()
    // create
    mockingoose(CommentModel).toReturn(testBody, 'save');
    // find
    mockingoose(CommentModel).toReturn([{
      user: '64a33248b30a754c88ede1cd',
      post: 'Conteudo de mock find',
      content: 'Sim, o mock funcionou'
    }], 'find');
    // delete
    mockingoose(CommentModel).toReturn([{
      user: '64a33248b30a754c88ede1cd',
      post: 'Conteudo de mock delete',
      content: 'Sim, o mock funcionou'
    }], 'findOneAndDelete');
  })

  test('Criar um comentário', async () => {

    let comment = new Comment(testBody);

    await comment.create();
    expect(comment.comment.content).toBe(testBody.content);
  });

  test('Ler todos os comentários de uma postagem', async () => {

    let commentList = await Comment.readByPost('64a332ddb30a754c88ede202');
    let listLen = commentList.length;
    expect(listLen).toBeGreaterThanOrEqual(0);
  });

  test('Ler todos os comentários de um usuário', async () => {
    let commentList = await Comment.readByUser("64a33248b30a754c88ede1cd");
    let listLen = commentList.length;
    expect(listLen).toBeGreaterThanOrEqual(0);
  });

  test('Deletar um comentário', async () => {
    let commentToDelete = await Comment.readByUser("64a33248b30a754c88ede1cd");
    const id = commentToDelete[0]._id.toString('hex');
    let deletedComment = await Comment.delete(id);
    expect(deletedComment[0].content).toBe('Sim, o mock funcionou');
  });
})