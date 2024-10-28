// cypress/integration/rank.spec.js
describe('Rank Component', () => {
    beforeEach(() => {
      // Mocking the API response
      cy.intercept('GET', `${Cypress.env('API_BASE_URL')}/rank`,{
        statusCode: 200,
        body: [
          { rank: 1, username: 'UserOne', clicks: 150 },
          { rank: 2, username: 'UserTwo', clicks: 120 },
          { rank: 3, username: 'UserThree', clicks: 100 },
        ],
      }).as('fetchRanks');
  
      // Visit the page where the Rank component is rendered
      cy.visit('/rank'); // Adjust the path based on your routing
    });
  
    it('displays loading state', () => {
      // Before the request resolves, you might see a loading state
      cy.get('div').contains('Loading...').should('exist');
    });
  
    it('displays ranks correctly', () => {
      // Wait for the ranks to be fetched
      cy.wait('@fetchRanks');
  
      // Check if the table headers are displayed
      cy.get('th').contains('rank').should('exist');
      cy.get('th').contains('username').should('exist');
      cy.get('th').contains('clicks').should('exist');
  
      // Check if the ranks are displayed correctly
      cy.get('tbody tr').should('have.length', 3);
      cy.get('tbody tr').eq(0).within(() => {
        cy.get('td').eq(0).should('contain', 1);
        cy.get('td').eq(1).should('contain', 'UserOne');
        cy.get('td').eq(2).should('contain', 150);
      });
      cy.get('tbody tr').eq(1).within(() => {
        cy.get('td').eq(0).should('contain', 2);
        cy.get('td').eq(1).should('contain', 'UserTwo');
        cy.get('td').eq(2).should('contain', 120);
      });
    });
  
    it('displays error state', () => {
      // Mocking a failure response
      cy.intercept('GET', '/api/rank', {
        statusCode: 500,
        body: { message: 'Internal Server Error' },
      }).as('fetchError');
  
      cy.visit('/rank'); // Revisit to trigger the error
      cy.wait('@fetchError');
  
      // Check if the error message is displayed
      cy.get('div').contains('Error: Internal Server Error').should('exist');
    });
  });
  