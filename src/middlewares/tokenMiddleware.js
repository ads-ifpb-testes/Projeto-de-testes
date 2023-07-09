const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  let token;

  if (req.session.token) {
    token = req.session.token;
  } else {
    token = req.headers.authorization;
    token = token.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensagem: 'Token inválido' });
    }

    req.usuario = decoded;
    next();
  });
}

const isAPIAuthenticated = async (req, res, next) => {
  const authorization = req.get('authorization');

  if (authorization) {
    try {
      const [, token] = authorization.split(' ');
      await jwt.verify(token, process.env.SECRET_KEY);

      return next();
    } catch (e) {
      return res.status(401).json({ error: 'Token invalido!.' });
    }
  } else {
    res.status(401).json({ error: 'É preciso de um token de autorização!' });
  }
}

module.exports = {
  isAuthenticated,
  isAPIAuthenticated
};