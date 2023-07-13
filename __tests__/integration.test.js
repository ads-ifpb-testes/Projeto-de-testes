// DATABASE
const path = require('path');

const url = ['http://localhost:3000', 'https://projeto-forum.onrender.com'];

describe("Funções de posts", () => {

  test('Dar um fetch em todos os posts', async () => {
    let response = await fetch(`${url[0]}/post/readAll`);
    let posts = await response.json();
    let postsLen = posts.length;
    expect(postsLen).toBeGreaterThanOrEqual(0);
  });

  test('Dar um fetch em todos os posts de um usuário', async () => {
    let user = '64a3323eb30a754c88ede1c6';
    let response = await fetch(`${url[0]}/post/readByUser/${user}`);
    let posts = await response.json();
    let postsLen = posts.length;
    expect(postsLen).toBeGreaterThanOrEqual(0);
  });

  test('Dar um fetch nas informações de um usuário', async () => {
    let user = '64a3323eb30a754c88ede1c6';
    let response = await fetch(`${url[0]}/user/getById/${user}`);
    let userinfo = await response.json();
    expect(typeof userinfo.username).toBe('string');
  });

  test('Dar um fetch em todos os usuários', async () => {
    let response = await fetch(`${url[0]}/user/readAll`);
    let allusers = await response.json();
    let userLen = allusers.length;
    expect(userLen).toBeGreaterThanOrEqual(0);
  });
});