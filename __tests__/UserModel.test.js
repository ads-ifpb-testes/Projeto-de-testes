let {User, UserModel} = require('../src/models/UserModel');
const mockingoose = require('mockingoose');

describe("Funções de user", () => {

  beforeEach(() => {
    mockingoose.resetAll()
  });

  test('Criar um usuário', async () => {

    let UserObj = {
      username: 'SoupGuy31415',
      email: 'theSoup@email.com',
      password: 'password123',
      score: 10
    }
    mockingoose(UserModel).toReturn(undefined, 'findOne');
    mockingoose(UserModel).toReturn(UserObj, 'save');

    let createUser = new User(UserObj);
    await createUser.register();

    expect(createUser.user.username).toBe(UserObj.username);
    expect(createUser.user.email).toBe(UserObj.email);
  });

  test('Criar um usuário errado', async () => {

    let wrongTestBody = {
      username: "WrongUser",
      email: "wrongemail.com",
      password: "123"
    };
    let wrongUser = new User(wrongTestBody);

    await wrongUser.register();
    expect(wrongUser.errors.length).toBeGreaterThan(0);
  });

  test('Fazer login de um usuário com senha errada', async () => {
    
    let WrongPassword = "SenhaErrada";
    let wrongTestBody = {
      username: "NormalUser",
      email: "Normal@email.com",
      password: "Normal123"
    };

    let login = {
      email: wrongTestBody.email,
      password: WrongPassword
    };

    mockingoose(UserModel).toReturn(wrongTestBody, 'findOne');

    let wrongUser = new User(login);
    await wrongUser.login();

    expect(wrongUser.errors.length).toBeGreaterThan(0);
  });

  test('Fazer login de um usuário', async () => {
    let UserObj = {
      username: 'SoupGuy31415',
      email: 'theSoup@email.com',
      password: 'password123'
    }
    mockingoose(UserModel).toReturn(undefined, 'findOne');
    mockingoose(UserModel).toReturn(UserObj, 'save');

    let RegisterUser = new User(UserObj);
    await RegisterUser.register();

    mockingoose(UserModel).toReturn(RegisterUser.user, 'findOne');

    let loginUser = new User(UserObj);
    await loginUser.login();

    expect(loginUser.errors.length).toBe(0);
  });

  test('Ler todos os usuários', async () => {
    let UserObjList = [{
      username: 'SoupGuy31415',
      email: 'theSoup@email.com',
      password: 'password123'
    }, {
      username: 'PizzaGuy31415',
      email: 'thePizza@email.com',
      password: 'password123'
    }];

    mockingoose(UserModel).toReturn(UserObjList, 'find');

    let userList = await User.readAll();
    let listLen = userList.length;
    expect(listLen).toBeGreaterThanOrEqual(0);
  });
  
  test('Ler um usuário por ID', async () => {
    let UserObj = {
      username: 'SoupGuy31415',
      email: 'theSoup@email.com',
      password: 'password123'
    }
    mockingoose(UserModel).toReturn(UserObj, 'findOne');
    mockingoose(UserModel).toReturn(UserObj, 'findById');

    let userExemplo = await UserModel.findOne();
    let id = userExemplo._id.toString('hex');
    let fetchedUser = await User.readById(id);
    expect(fetchedUser.username).toBe(userExemplo.username);
    expect(fetchedUser.email).toBe(userExemplo.email);
  });
  
  test('Atualizar um usuário', async () => {

    let NameToUpdate = "Novo nome"

    let NewUserObjToUpdate = {
      username: NameToUpdate,
      email: 'mock@email.com',
      password: 'mock1234'
    };

    let OldUserObjToUpdate = {
      username: 'OldBoringName',
      email: 'mock@email.com',
      password: 'mock1234'
    };

    mockingoose(UserModel).toReturn(NewUserObjToUpdate, 'findOneAndUpdate');
    mockingoose(UserModel).toReturn(OldUserObjToUpdate, 'findOne');

    let UpdatedUser = await UserModel.findOne();
    let userClassToUpdate = new User({username: NameToUpdate});
  
    userClassToUpdate.user = UpdatedUser;

    let id = userClassToUpdate.user._id.toString('hex');
    await userClassToUpdate.update(id);
    
    expect(userClassToUpdate.user.username).toBe(NameToUpdate);
    expect(userClassToUpdate.errors).toHaveLength(0);
  });

  test('Verificar se um username existe', async () => {
    let UserObj = {
      username: 'SoupGuy31415',
      email: 'theSoup@email.com',
      password: 'password123'
    }
    mockingoose(UserModel).toReturn(UserObj, 'findOne');
    let user = new User(UserObj);
    let errNum = user.errors.length;
    await user.usernameExists();
    expect(user.errors.length).toBeGreaterThan(errNum);
  });

  test('Verificar se um usuário existe', async () => {
    let UserObj = {
      username: 'SoupGuy31415',
      email: 'theSoup@email.com',
      password: 'password123'
    }
    mockingoose(UserModel).toReturn(UserObj, 'findOne');
    let user = new User(UserObj);
    let errNum = user.errors.length;
    await user.userExists();
    expect(user.errors.length).toBeGreaterThan(errNum);
  });

  test('Verificar se é possivel aumentar o score', async () => {

    let num = 10;

    let UserObjToScore = {
      username: 'SoupGuy31415',
      email: 'theSoup@email.com',
      password: 'password123',
      score: 10
    }

    mockingoose(UserModel).toReturn(UserObjToScore, 'findOne');
    mockingoose(UserModel).toReturn(UserObjToScore, 'findById');

    let userToGivePoints = await UserModel.findOne();

    let userClass = new User();
    userClass.user = userToGivePoints;

    let oldScore = userClass.user.score;

    let id = userClass.user._id.toString('hex');
    let UpdatedUser = await User.addScore(id, num);

    expect(UpdatedUser.score).toBeGreaterThan(oldScore);
  });

  test('Deletar um usuário', async () => {
    let UserObj = {
      username: 'SoupGuy31415',
      email: 'theSoup@email.com',
      password: 'password123'
    }
    mockingoose(UserModel).toReturn(UserObj, 'findOneAndDelete');
    mockingoose(UserModel).toReturn(UserObj, 'find');
    
    let userToDelete = await UserModel.find();
    const id = userToDelete._id.toString('hex');
    let deletedUser = await User.delete(id);
    expect(deletedUser.username).toBe(UserObj.username);
  });
});