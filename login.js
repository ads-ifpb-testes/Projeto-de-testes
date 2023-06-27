let users = [];
let posts = [];

class User {
  constructor(username, password, score, publicName) {
    this.username = username;
    this.password = password;
    this.score = score;
    this.publicName = publicName;
    this.posts = [];
  }
}

class Post {
  constructor(id, content, author) {
    this.id = id;
    this.content = content;
    this.author = author;
    this.comments = [];
  }
}

let createPost = (post) => {
  let p = new Post(
    post.id,
    post.content,
    post.author
  );
  posts.push(p);
  post.author.score++;
}

let isPasswordStrong = (password) => {

  let haveUppercase = password !== password.toLowerCase();
  let haveNumbers = /\d/.test(password);
  let isBigEnough = password.split('').length > 8;

  if (
    haveUppercase &&
    haveNumbers &&
    isBigEnough
  ) return true;
  return false;
}

let getUsers = () => { return users; }

let createUser = (user) => {
  let u = new User(
    user.username,
    user.password,
    user.publicName
  );
  users.push(u);
}

let removeUser = (users, userToRemove) => {
    const userIndex = users.findIndex(user => user.username === userToRemove);
    users.splice(userIndex,1);
}

export default {
  getUsers,
  createUser,
  removeUser,
  createPost,
  isPasswordStrong
}