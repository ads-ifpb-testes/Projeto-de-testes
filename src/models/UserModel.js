const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  pfPicture: { type: String, default: '/img/emojii1.png' },
  score: { type: Number, default: 0 }
});

const UserModel = mongoose.model('User', UserSchema);

class User {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.validate();
    if (this.errors.length > 0) return;

    this.user = await UserModel.findOne({ email: this.body.email });
    if (!this.user) {
      this.errors.push('Usuário não cadastrado!');
      return;
    }

    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida!');
      this.user = null;
      return;
    }
  }

  async register() {
    this.validate();
    if (this.errors.length > 0) return;

    await this.userExists();
    if (this.errors.length > 0) return;

    await this.usernameExists();
    if (this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    let number = Math.ceil(Math.random() * 4);
    this.body.pfPicture = `/img/emojii${number}.png`;

    this.user = await UserModel.create(this.body);
  }

  validate() {
    this.cleanUp();
    if (!validator.isEmail(this.body.email)) this.errors.push('Email inválido!');
    if (this.body.password.length < 8 || this.body.password.length > 20) this.errors.push('A senha deve possuir entre 8 e 20 caracteres!');
  }

  cleanUp() {
    for (const key in this.body)
      if (typeof this.body[key] !== 'string') this.body[key] = '';

    this.body = {
      username: this.body.username,
      email: this.body.email,
      password: this.body.password
    };
  }

  async usernameExists() {
    const name = await UserModel.findOne({ username: this.body.username });
    if (name) this.errors.push('Nome de usuário indisponível!');
  }

  async userExists() {
    const user = await UserModel.findOne({ email: this.body.email });
    if (user) this.errors.push('Usuário já cadastrado!');
  }

  static async readAll() {
    return await UserModel.find().sort({ score: -1, name: 1 });
  }

  static async readById(id) {
    if (typeof id !== 'string') return;
    const user = await UserModel.findById(id);
    return user;
  }

  static async delete(id) {
    if (typeof id !== 'string') return;
    const user = await UserModel.findByIdAndDelete(id);
    return user;
  }

  async update(id) {
    if (typeof id !== 'string') return;
    if (this.errors.length > 0) return;
    const user = await UserModel.findById(id);
    if (!this.body.pfPicture) this.body.pfPicture = user.pfPicture;
    const edit = {
      username: this.body.username,
      email: user.email,
      password: user.password,
      pfPicture: this.body.pfPicture,
      score: user.score
    };
    this.user = await UserModel.findByIdAndUpdate(id, edit, { new: true });
  }

  static async addScore(id, score) {
    if (typeof id !== 'string') return;
    const user = await UserModel.findById(id);
    user.score += score;
    await UserModel.findByIdAndUpdate(id, user);
    return user;
  }
}

module.exports = {User, UserModel}