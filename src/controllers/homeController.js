const path = require('path');
const Post = require(path.resolve(__dirname, '..', 'models', 'PostModel'));
const url = ['http://localhost:3000','https://projeto-forum.onrender.com'];

const index = async (req, res) => {

  const token = req.session.token;

  try {
    let response, posts;

    if (req.body.text) {
      response = await fetch(`${url[0]}/post/readFilter/${req.body.text}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      response = await fetch(`${url[0]}/post/readAll`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    posts = await response.json();
    posts = posts.reverse();

    let res2 = await fetch(`${url[0]}/user/readAll`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    let users = await res2.json();

    if (req.session.user) {
      let currentUser = await fetch(`${url[0]}/user/getById/${req.session.user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      req.session.user = await currentUser.json();
    }

    res.render('index', { posts, users, pfUser: null });
    
  } catch (e) { console.error(e) };
};

const login = (req, res) => {
  res.render('login');
};

const signin = (req, res) => {
  res.render('signin');
};

const profile = async (req, res) => {

  const token = req.session.token;

  const user = req.params.id;
  let response = await fetch(`${url[0]}/user/getById/${user}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  let pfUser = await response.json();

  let res2 = await fetch(`${url[0]}/post/readByUser/${user}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  let posts = await res2.json();
  posts = posts.reverse();

  let res3 = await fetch(`${url[0]}/user/readAll`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  let users = await res3.json();

  if (req.session.user) {
    let currentUser = await fetch(`${url[0]}/user/getById/${req.session.user._id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    req.session.user = await currentUser.json();
  }

  res.render('profile', { pfUser, posts, users });
};

module.exports = {
  index,
  login,
  signin,
  profile
};