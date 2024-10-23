export interface WinnerInfo {
  nickname: string;
  imageSrc: string;
}

export interface PrizeInfo {
  roundId: number; //회차
  date: string; //이벤트 일시
  point: number; // 당첨금
  nickName: string; // 당첨자 이름//winnerInfo로 오는지?
  imageSrc: string; // 백이랑 맞춰보기
  participant: number; // 몇명중에 일등했다!
  clicks: number; //당첨자가 몇번 클릭했는지
}
