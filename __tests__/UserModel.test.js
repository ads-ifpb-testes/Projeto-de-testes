let UserModel = require('../src/models/UserModel');
let database = require('../src/database/mongo');

const dbConn = 'Database connected';
database.connect()
.then(() => {
    console.log(dbConn);
}).catch(err => console.log(err));;

describe("Funções de user", () =>{
    let testBody = {
        username: "arroz",
        email: "arroz@gmail.com",
        password: "senha123"
    }; 

    let createdUser;
    let user = new UserModel(testBody);
  
    test('Criar um usuário', async () => {
      await user.register();
      createdUser = user.user;
      expect(createdUser.username).toBe(testBody.username);
      expect(createdUser.email).toBe(testBody.email);
    });
  
    test('Ler todos os usuários', async () => {
      let userList = await UserModel.readAll();
      let listLen = userList.length;
      expect(listLen >= 0).toBe(true);
    });
  
    test('Deletar um usuário', async () => {
      const id = createdUser._id.toString();
      let deletedUser = await UserModel.delete(id);
      expect(deletedUser.username).toBe(testBody.username);
      expect(deletedUser.email).toBe(testBody.email);
    });

    test('Atualizar um usuário', async () => {
      let updatedUsername = "Novo nome";
      user.body.username = updatedUsername;
      await user.update(user.user._id);
      expect(user.user.username).toBe(updatedUsername);
      expect(user.errors).toHaveLength(0);
    });

      test('Ler um usuário por ID', async () => {
        let fetchedUser = await UserModel.readById(user.user._id);
        expect(fetchedUser.username).toBe(testBody.username);
        expect(fetchedUser.email).toBe(testBody.email);
      });

})