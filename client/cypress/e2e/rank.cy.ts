// cypress/e2e/rank.cy.ts

describe('Rank Component Tests', () => {
    beforeEach(() => {
        // 테스트할 페이지를 방문합니다.
        cy.visit('/rank'); // 실제 Rank 컴포넌트가 위치한 경로로 수정
    });

    it('should display loading message initially', () => {
        // 로딩 메시지가 표시되는지 확인합니다.
        cy.contains('Loading...').should('be.visible');
    });

    it('should display ranks after data is loaded', () => {
        // 랭크 데이터가 로드된 후 올바른 내용을 표시하는지 확인합니다.
        // mocking API response
        cy.intercept('GET', 'http://localhost:8080/rank', {
            statusCode: 200,
            body: [
                { rank: 1, username: 'UserOne', clicks: 150 },
                { rank: 2, username: 'UserTwo', clicks: 120 },
                { rank: 3, username: 'UserThree', clicks: 100 },
                // 필요한 만큼 추가...
            ],
        }).as('getRanks');

        // API 호출이 완료되기를 기다립니다.
        cy.wait('@getRanks');

        // 랭킹 테이블이 나타나는지 확인합니다.
        cy.get('table').should('exist');
        cy.get('tbody tr').should('have.length', 3); // 데이터 수에 따라 수정
        cy.get('tbody tr').first().contains('UserOne'); // 첫 번째 사용자가 보이는지 확인
    });

    it('should handle error state correctly', () => {
        // 에러 상태를 시뮬레이션합니다.
        cy.intercept('GET', '/rank', {
            statusCode: 500,
            body: { success: false, message: 'Error loading ranks' },
        }).as('getRanks');

        cy.wait('@getRanks');

        // 에러 메시지가 표시되는지 확인합니다.
        cy.contains('Error: Error loading ranks').should('be.visible');
    });
});
