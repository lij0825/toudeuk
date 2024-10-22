// 1.초기 페이지 UI 확인
// 2.TextField의 유효성검사에 따른 HelperText 와 같은 Formik 확인
// 3.사용 시나리오에 따른 테스트 (API 유효성 검사 표함)

describe("클릭 테스트", () => {
  // 페이지 이동 설정
  beforeEach(() => {
    cy.visit("/toudeuk");
  });

  it("toudeuk 페이지에서 버튼을 클릭하면 숫자가 증가한다.", () => {
    // 버튼의 초기 상태를 확인
    cy.get('[data-cy=button]').should('contain', '0');

    // 버튼을 클릭
    cy.get('[data-cy=button]').click();

    // 클릭 후 숫자가 1로 증가했는지 확인
    cy.get('[data-cy=button]').should('contain', '1');

    // 다시 버튼을 클릭하고 숫자가 2로 증가했는지 확인
    cy.get('[data-cy=button]').click();
    cy.get('[data-cy=button]').should('contain', '2');
  });
});
