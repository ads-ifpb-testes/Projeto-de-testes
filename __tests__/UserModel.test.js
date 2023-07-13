let {User, UserModel} = require('../src/models/UserModel');
const mockingoose = require('mockingoose');

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

    beforeEach(() => {
      mockingoose.resetAll()
      // create
      mockingoose(UserModel).toReturn(testBody, 'save');
      // find
      mockingoose(UserModel).toReturn([{
        username: 'Mock find',
        email: 'mock@email.com',
        password: 'mock1234',
        score: 0
      }], 'find');
      // findOne
      mockingoose(UserModel).toReturn([{
        username: 'Mock find',
        email: 'mock@email.com',
        password: 'mock1234',
        score: 0
      }], 'findOne');
      // FindById
      mockingoose(UserModel).toReturn([{
        username: 'Mock find',
        email: 'mock@email.com',
        password: 'mock1234',
        score: 0
      }], 'findById');
      // delete
      mockingoose(UserModel).toReturn([{
        username: 'MockDeleted',
        email: 'mock@email.com',
        password: 'mock1234',
        score: 0
      }], 'findOneAndDelete');
      mockingoose(UserModel).toReturn([{
        username: 'MockUpdate',
        email: 'mock@email.com',
        password: 'mock1234',
        score: 0
      }], 'update');
    })

    let createdUser;
    let user = new User(testBody);

    let wrongUser = new User(wrongTestBody);
  
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
      let userList = await User.readAll();
      let listLen = userList.length;
      expect(listLen >= 0).toBe(true);
    });
    
    test('Ler um usuário por ID', async () => {
      let fetchedUser = await User.readById(user.user._id.toString('hex'));
      expect(fetchedUser.username).toBe(testBody.username);
      expect(fetchedUser.email).toBe(testBody.email);
    });
    
    test('Atualizar um usuário', async () => {
      let updatedUsername = "Novo nome"
      let UpdatedUser= new User({
        username: 'AntigoNome',
        email: "AntigoNome@gmail.com",
        password: "senha12345"
      });
      await user.register();
      await UpdatedUser.update(UpdatedUser.user._id.toString('hex'));
      expect(UpdatedUser.user.username).toBe(updatedUsername);
      expect(UpdatedUser.errors).toHaveLength(0);
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
      await User.addScore(user.user._id.toString('hex'), num);
      let UpdatedUser = await User.readById(user.user._id.toString('hex'));
      expect(UpdatedUser.score === oldScore + num).toBe(true);
    });

    test('Deletar um usuário', async () => {

      let delUser = await User.readById(user.user._id.toString('hex'));
      const id = delUser._id.toString('hex');
      let deletedUser = await User.delete(id); 
      expect(deletedUser[0].username).toBe('MockDeleted');
     /*  expect(deletedUser.email).toBe(user.user.email); */
    });
});