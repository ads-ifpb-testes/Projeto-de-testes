let UserModel = require('../src/models/UserModel');
let database = require('../src/database/mongo');

const dbConn = 'Database connected';
database.connect()
.then(() => {
    console.log(dbConn);
}).catch(err => console.log(err));

describe("Funções de user", () => {
    let testBody = {
        username: "arroz",
        email: "arroz@gmail.com",
        password: "senha12345"
    }; 

    let wrongTestBody = {
      username: "WrongUser",
      email: "wrongemail.com",
      password: "123"
    }; 

    let createdUser;
    let user = new UserModel(testBody);

    let wrongUser = new UserModel(wrongTestBody);
  
    test('Criar um usuário', async () => {
      await user.register();
      createdUser = user.user;
      expect(createdUser.username).toBe(testBody.username);
      expect(createdUser.email).toBe(testBody.email);
    });

    test('Criar um usuário errado', async () => {
      await wrongUser.register();
      expect(wrongUser.errors.length > 0).toBe(true);
    });

    test('Fazer login de um usuário com senha errada', async () => {
      user.body.password = "SenhaErrada";
      await user.login();
      console.log(user.errors);
      expect(user.errors.length > 0).toBe(true);
      user.errors = [];
      user.body.password = testBody.password;
    });

    test('Fazer login de um usuário', async () => {
      user.body.password = testBody.password;
      await user.login();
      expect(user.errors.length === 0).toBe(true);
    });
  
    test('Ler todos os usuários', async () => {
      let userList = await UserModel.readAll();
      let listLen = userList.length;
      expect(listLen >= 0).toBe(true);
    });
    
    test('Ler um usuário por ID', async () => {
      let fetchedUser = await UserModel.readById(user.user._id.toString('hex'));
      expect(fetchedUser.username).toBe(testBody.username);
      expect(fetchedUser.email).toBe(testBody.email);
    });
    
    test('Atualizar um usuário', async () => {
      let updatedUsername = "Novo nome"
      user.body.username = updatedUsername;
      await user.update(user.user._id.toString('hex'));
      expect(user.user.username).toBe(updatedUsername);
      expect(user.errors).toHaveLength(0);
    });

    test('Verificar se um username existe', async () => {
      let errNum = user.errors.length;
      await user.usernameExists();
      expect(user.errors.length === errNum + 1).toBe(true);
    });

    test('Verificar se um usuário existe', async () => {
      let errNum = user.errors.length;
      await user.userExists();
      expect(user.errors.length === errNum + 1).toBe(true);
    });

    test('Verificar se é possivel aumentar o score', async () => {
      let num = 10;
      let oldScore = user.user.score;
      await UserModel.addScore(user.user._id.toString('hex'), num);
      let UpdatedUser = await UserModel.readById(user.user._id.toString('hex'));
      expect(UpdatedUser.score === oldScore + num).toBe(true);
    });

    test('Deletar um usuário', async () => {
      const id = createdUser._id.toString('hex');
      let deletedUser = await UserModel.delete(id);
      expect(deletedUser.username).toBe(user.user.username);
      expect(deletedUser.email).toBe(user.user.email);
    });
});