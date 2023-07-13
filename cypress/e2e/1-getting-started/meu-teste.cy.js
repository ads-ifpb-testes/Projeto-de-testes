describe('Testes para Usuario', () => {
  const host = 'http://localhost:3000';
  beforeEach(() => {
    cy.viewport(1250, 800)
    cy.visit(host)
  });

  it('Realiza cadastro de usuário com sucesso', () => {

    // Localiza e clica no botão "Entrar"
    cy.contains('Criar conta').click()
    cy.once('uncaught:exception', (err, runnable) => {
      // Ignora um erro não capturado
      return false;
    })

    // Preenche o campo "Nome"
    cy.get('input[name="username"]').type('Exemplo')

    // Preenche o campo "Email"
    cy.get('input[name="email"]').type('example@email.com')

    // Preenche o campo "Senha"
    cy.get('input[name="password"]').type('example123')

    // Preenche o campo "Confirmar senha"
    cy.get('#password-confirm').type('example123')

    // Localiza e clica no botão de enviar
    cy.get('button[type="submit"]').click()

    cy.url().should('eq', `${host}/`)
    cy.contains('Perfil').should('be.visible')

    cy.contains('Sair').click()
    cy.contains('Entrar').should('be.visible')
  })

  it('Realiza login com sucesso', () => {
    // Localiza e clica no botão "Entrar"
    cy.contains('Entrar').click()
    cy.once('uncaught:exception', (err, runnable) => {
      return false;
    })

    // Preenche o campo de email
    cy.get('input[name="email"]').type('example@email.com')

    // Preenche o campo de senha
    cy.get('input[name="password"]').type('example123')

    // Localiza e clica no botão "Login"
    cy.get('button[type="submit"]').click()

    cy.url().should('eq', `${host}/`)
    cy.contains('Perfil').should('be.visible')
  });

  it('Entra na página de perfil', () => {
    cy.contains('Entrar').click()
    cy.get('input[name="email"]').type('example@email.com')
    cy.get('input[name="password"]').type('example123')
    cy.get('button[type="submit"]').click()


    cy.contains('Perfil').click()
    cy.on('uncaught:exception', (err, runnable) => {
      return false;
    })

    cy.url().should('match', new RegExp(`^${host}/profile/`))
  });

  it('Edita informações do usuário com sucesso', () => {
    cy.contains('Entrar').click()
    cy.get('input[name="email"]').type('example@email.com')
    cy.get('input[name="password"]').type('example123')
    cy.get('button[type="submit"]').click()


    cy.contains('Perfil').click()
    cy.on('uncaught:exception', (err, runnable) => {
      return false;
    })

    cy.contains('Editar perfil').click()
    cy.get('input[name="username"]').clear().type('New Example')
    cy.contains('Salvar').click()
    cy.on('uncaught:exception', (err, runnable) => {
      return false;
    })

    cy.url().should('match', new RegExp(`^${host}/profile/`))
    cy.contains('New Example').should('be.visible')
  });

  it('Entrar no perfil de outros usuários', () => {
    cy.contains('Entrar').click()
    cy.get('input[name="email"]').type('example@email.com')
    cy.get('input[name="password"]').type('example123')
    cy.get('button[type="submit"]').click()

    cy.get('.post-user').first().click()
    cy.on('uncaught:exception', (err, runnable) => {
      return false;
    })
    cy.get('.user-email').should('be.visible')
  })
  
  it('Deleta usuário com sucesso', () => {
    cy.contains('Entrar').click()
    cy.get('input[name="email"]').type('example@email.com')
    cy.get('input[name="password"]').type('example123')
    cy.get('button[type="submit"]').click()


    cy.contains('Perfil').click()
    cy.on('uncaught:exception', (err, runnable) => {
      return false;
    })

    cy.contains('Deletar conta').click()
    cy.on('window:confirm', () => true)

    cy.url().should('eq', `${host}/`)
    cy.contains('Entrar').should('be.visible')
  });

  it('Erro ao logar com um usuário inexistente', () => {
    cy.contains('Entrar').click()
    cy.on('uncaught:exception', (err, runnable) => false)
    cy.get('input[name="email"]').type('not_example@email.com')
    cy.get('input[name="password"]').type('notExample123')
    cy.get('button[type="submit"]').click()

    cy.contains('Usuário não cadastrado!').should('be.visible')
  })
});

describe('Testes das Postagens', () => {
  const host = 'http://localhost:3000';
  beforeEach(() => {
    cy.viewport(1250, 800)
    cy.visit(host)
    cy.contains('Entrar').click()
    cy.on('uncaught:exception', (err, runnable) => false)
    cy.get('input[name="email"]').type('alvaro@gmail.com')
    cy.get('input[name="password"]').type('alvaro123')
    cy.get('button[type="submit"]').click()
  });

  it('Cria uma postagem com sucesso', () => {
    cy.get('.create-post-btn').click()

    cy.get('#post-title').type('Título teste')
    cy.get('#post-content').type('Conteúdo teste')
    cy.get('#submit-cp-btn').click()

    cy.contains('Título teste').should('be.visible')
  })

  it('Deleta uma postagem com sucesso', () => {
    cy.contains('Perfil').click()
    
    cy.get('.delete-post').first().click()

    cy.on('window:confirm', () => true)

    cy.contains('Título teste').should('not.exist');
  })
})

describe('Testes para comentários', () => {
  const host = 'http://localhost:3000';
  beforeEach(() => {
    cy.viewport(1250, 800)
    cy.visit(host)
    cy.contains('Entrar').click()
    cy.on('uncaught:exception', (err, runnable) => false)
    cy.get('input[name="email"]').type('alana@gmail.com')
    cy.get('input[name="password"]').type('123456789')
    cy.get('button[type="submit"]').click()
  });

  it('Cria um comentário com sucesso', () => {
    cy.contains('Mostrar comentários').first().click()

    cy.get('#comment-content').first().type('Teste comentário')
    cy.get('.comment-submit').first().click()

    cy.contains('Mostrar comentários').first().click()
    cy.contains('Teste comentário').should('be.visible')
  })
})