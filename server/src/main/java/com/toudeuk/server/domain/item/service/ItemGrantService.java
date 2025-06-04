package com.toudeuk.server.domain.item.service;

import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.domain.item.entity.Item;
import com.toudeuk.server.domain.item.repository.ItemRepository;
import com.toudeuk.server.domain.payment.service.PaymentService;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.entity.UserItem;
import com.toudeuk.server.domain.user.repository.UserItemRepository;
import com.toudeuk.server.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import static com.toudeuk.server.core.exception.ErrorCode.ITEM_NOT_FOUND;
import static com.toudeuk.server.core.exception.ErrorCode.USER_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ItemGrantService {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final UserItemRepository userItemRepository;
    private final PaymentService paymentService;

    /**
     * 결제 성공 후 아이템을 지급하는 핵심 로직
     * - 별도의 트랜잭션으로 처리되며, 실패 시 외부에서 핸들링
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW, timeout = 3)
    public void giveItemAfterPayment(Long userId, Long itemId, String partnerOrderId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BaseException(USER_NOT_FOUND));
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new BaseException(ITEM_NOT_FOUND));

        UserItem userItem = UserItem.create(user, item);
        userItemRepository.save(userItem);

        // 지급 완료 상태로 변경
        paymentService.markItemSuccess(partnerOrderId);
    }
}
