let CommentModel = require('../src/models/CommentModel');
let database = require('../src/database/mongo');

const dbConn = 'Database connected';
database.connect()
.then(() => {
    console.log(dbConn);
}).catch(err => console.log(err));

describe("Funções de comentarios", ()=>{
    let testBody = {
        user:"64a33248b30a754c88ede1cd",
        post: "64a332ddb30a754c88ede202",
        content: 'console.log("Hello Word");'
    }

    let comment = new CommentModel(testBody);

    test('Criar um comentário', async () => {
      await comment.create();
      expect(comment.comment.content).toBe(testBody.content);
    });
  
    test('Ler todos os comentários de uma postagem', async () => {
      await comment.create();
      let commentList = await CommentModel.readByPost(testBody.post);
      let listLen = commentList.length;
      expect(listLen >= 0).toBe(true);
    });
  
    test('Ler todos os comentários de um usuário', async () => {
      await comment.create();
      let commentList = await CommentModel.readByUser(testBody.user);
      let listLen = commentList.length;
      expect(listLen >= 0).toBe(true);
    });
  
    test('Deletar um comentário', async () => {
      await comment.create();
      const id = comment.comment._id.toString();
      let deletedComment = await CommentModel.delete(id);
      expect(deletedComment.content).toBe(testBody.content);
    });
})