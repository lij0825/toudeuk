package com.toudeuk.server.domain.payment.domain;

public enum PaymentStatus {
    READY,
    ITEM_FAILED,    // 결제 승인 OK + 아이템 지급 실패
    ITEM_SUCCESS,   // 아이템 지급 완료
    CANCELLED,      // 사용자가 취소했거나, 결제 만료
    FAIL_EXTERNAL   // 외부 결제 실패 (결제 시도는 했지만 KakaoPay 에러 응답)
}