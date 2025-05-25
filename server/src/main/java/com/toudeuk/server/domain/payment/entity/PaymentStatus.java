package com.toudeuk.server.domain.payment.entity;

public enum PaymentStatus {
    READY,
    APPROVE,    // 결제 승인만 된 상태 - 아이템 미지급
    ITEM_SUCCESS,   // 아이템 지급 완료
    ITEM_FAILED, // 아이템 지급 실패
    CANCELLED,      // 사용자가 취소
    // 했거나, 결제 만료
    FAIL_EXTERNAL   // 외부 결제 실패 (결제 시도는 했지만 KakaoPay 에러 응답)

    /**
     * 결제 되었는데 롤백되서 READY상태로 되어있으면 어떻게 구분해서 스케쥴러가 잡아내지?
     */
}