describe('Meu teste', () => {
  it('Descrição do que está sendo testado', () => {
    cy.visit('http://localhost:3000') // Visita o URL especificado
    cy.contains('Entrar') // Procura por um elemento que contém o texto 'Exemplo'
      .should('be.visible') // Verifica se o elemento é visível na página
  });
});