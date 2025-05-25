package com.toudeuk.server.domain.kapay.controller;

import static com.toudeuk.server.core.exception.ErrorCode.*;

import com.toudeuk.server.domain.payment.entity.Payment;
import com.toudeuk.server.domain.payment.service.PaymentService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.toudeuk.server.core.annotation.CurrentUser;
import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.core.response.SuccessResponse;
import com.toudeuk.server.domain.item.service.ItemService;
import com.toudeuk.server.domain.kapay.dto.ReadyResponse;
import com.toudeuk.server.domain.kapay.service.KapayService;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.repository.UserRepository;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/kapay")
@Tag(name = "카카오 페이 관련 API ")
public class KapayController {

	@Value("${kakaopay.redirect.url}")
	private String baseUrl;

	private final KapayService kapayService;
	private final UserRepository userRepository; // KapayService에서 User를 찾으므로 직접 사용은 줄어들 수 있음
	private final ItemService itemService;
	private final PaymentService paymentService; // Payment 상태 업데이트를 위해 추가

	@GetMapping("/ready/{agent}/{openType}")
	public SuccessResponse<String> ready(
		@CurrentUser Long userId,
		@PathVariable String agent,
		@PathVariable String openType,
		@RequestParam("itemName") String itemName,
		@RequestParam("totalAmount") Integer totalAmount
	) {

		User user = userRepository.findById(userId).orElseThrow(() -> new BaseException(
			USER_NOT_FOUND));

		ReadyResponse readyResponse = kapayService.ready(user, agent, openType, itemName, totalAmount);
		String redirectUrl = getRedirectUrl(agent, openType, readyResponse);

		return SuccessResponse.of(redirectUrl);
	}

	@GetMapping("/approve/{agent}/{openType}")
	public RedirectView approve(
		@PathVariable String agent,
		@PathVariable String openType,
		@RequestParam("pg_token") String pgToken,
		@RequestParam(value = "partnerOrderId") String partnerOrderId
	) {
		// kapayService.approve는 내부적으로 Payment의 상태를 APPROVE로 변경하고 저장합니다.
		ResponseEntity<?> approveResponseEntity = kapayService.approve(pgToken, partnerOrderId);

		if (approveResponseEntity.getStatusCode() == HttpStatus.OK) {
			// partnerOrderId가 아이템 구매 패턴(userId_itemId_timestamp)을 따르는지 확인
			// 캐시 충전의 경우 partnerOrderId가 "1" 등으로 단순할 수 있음
			boolean isItemPurchase = partnerOrderId != null && partnerOrderId.contains("_");

			if (isItemPurchase) {
				try {
					String[] parts = partnerOrderId.split("_");
					if (parts.length >= 2) { // userId_itemId_timestamp
						Long userId = Long.parseLong(parts[0]);
						Long itemId = Long.parseLong(parts[1]);

						// 아이템 즉시 지급 시도
						try {
							itemService.giveItemAfterPayment(userId, itemId);
							// 지급 성공 시 Payment 상태를 ITEM_SUCCESS로 변경
							Payment payment = paymentService.findByPartnerOrderId(partnerOrderId);
							payment.markAsItemSuccess();
							paymentService.save(payment); // PaymentService의 save는 REQUIRES_NEW 트랜잭션
							log.info("아이템 즉시 지급 및 Payment 상태 업데이트 성공: userId={}, itemId={}, partnerOrderId={}", userId, itemId, partnerOrderId);
						} catch (Exception e) {
							// 아이템 즉시 지급 실패. Payment 상태는 'APPROVE'로 유지됨.
							// 스케줄러가 이 'APPROVE' 상태를 보고 재시도할 것임.
							log.error("아이템 즉시 지급 실패. 스케줄러가 재시도합니다. userId={}, itemId={}, partnerOrderId={}, error: {}", userId, itemId, partnerOrderId, e.getMessage(), e);
						}
					} else {
						log.warn("아이템 구매로 추정되나 partnerOrderId 형식 오류: {}", partnerOrderId);
					}
				} catch (NumberFormatException e) {
					log.error("partnerOrderId 파싱 실패 (아이템 구매 처리 중): {}. 오류: {}", partnerOrderId, e.getMessage());
				} catch (Exception e) {
					log.error("아이템 구매 후 처리 중 예외 발생: partnerOrderId={}. 오류: {}", partnerOrderId, e.getMessage(), e);
				}
			} else {
				// 아이템 구매가 아닌 경우 (예: 캐시 충전)
				log.info("캐시 충전 또는 일반 결제 승인 완료: partnerOrderId={}", partnerOrderId);
			}
			return new RedirectView(baseUrl + "/kapay/approve");
		} else {
			log.warn("카카오페이 승인 실패: partnerOrderId={}, status={}, body={}", partnerOrderId, approveResponseEntity.getStatusCode(), approveResponseEntity.getBody());
			return new RedirectView(baseUrl + "/kapay/fail");
		}
	}

	@GetMapping("/cancel/{agent}/{openType}")
	public RedirectView cancel(
		@PathVariable String agent,
		@PathVariable String openType
	) {
		log.info("카카오페이 결제 취소: agent={}, openType={}", agent, openType);
		return new RedirectView(baseUrl + "/kapay/cancel");
	}

	@GetMapping("/fail/{agent}/{openType}")
	public RedirectView fail(
		@PathVariable String agent,
		@PathVariable String openType
	) {
		log.info("카카오페이 결제 실패: agent={}, openType={}", agent, openType);
		return new RedirectView(baseUrl + "/kapay/fail");
	}

	public static String getRedirectUrl(String agent, String openType, ReadyResponse readyResponse) {
		switch (agent) {
			case "mobile":
				return readyResponse.getNext_redirect_mobile_url();
			case "app":
				// 앱스킴 URL 인코딩 필요 여부 확인
				return readyResponse.getNext_redirect_app_url(); // 예: "app://webview?url=" + encodedAppUrl
			default:
				return readyResponse.getNext_redirect_pc_url();
		}
	}
}