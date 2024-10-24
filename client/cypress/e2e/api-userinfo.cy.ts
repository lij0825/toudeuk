// cypress는 jest 처럼 mocking을 직접 구현하는 것이 아닌 intercept 기능을 사용할수 있다.
// dummydata를 사용해서 Cypress에 Mocking
// intercept 요청은 반드시 it 안에서 실행해야함
// it() : 개별 테스트 단위
// describe : 여러 테스트 케이스를 그룹화하는 테스트 스위트

describe("더미데이터를 사용한 사용자 정보 반환", () => {
  // 각 테스트마다 페이지를 방문
  beforeEach(() => {
    cy.intercept('GET', `${Cypress.env('API_BASE_URL')}/user/info`, {
      statusCode: 200,
      body: {
        success: true,
        status: 200,
        data: {
          nickName: 'JohnDoe',
          profileImg: "https://picsum.photos/seed/picsum5/150/150",
          cash: 1000,
        },
      },
    }).as('getUserInfo');
    
    cy.visit('/mypage'); // mypage 방문
  });

  // 사용자 정보를 성공적으로 가져오는 테스트
  it('사용자 정보를 성공적으로 fetch', () => {
    // API 요청을 가로채고 mock 데이터 반환

    // API 요청이 완료될 때까지 대기
    cy.wait('@getUserInfo');

    // 화면에 데이터가 제대로 표시되었는지 확인
    cy.contains('JohnDoe').should('be.visible');
    cy.get('img[alt="Profile"]').should('have.attr', 'src', "https://picsum.photos/seed/picsum5/150/150");
    cy.contains('Cash: 1000').should('be.visible');
  });

  // API 요청이 실패하는 경우의 테스트
  it('API 요청이 실패하는 경우', () => {
    // API 오류 응답을 가로채기
    cy.intercept('GET', `${Cypress.env('NEXT_PUBLIC_API_BASE_URL')}/user/info`, {
      statusCode: 500,
      body: {
        success: false,
        status: 500,
        message: 'Internal Server Error',
        data: null,
        errors: { detail: 'Server is down' },
      },
    }).as('getUserInfoError');

    // API 요청이 완료될 때까지 대기
    cy.wait('@getUserInfoError');

    // 오류 메시지가 화면에 제대로 표시되는지 확인
    cy.contains('Internal Server Error').should('be.visible');
  });
});
