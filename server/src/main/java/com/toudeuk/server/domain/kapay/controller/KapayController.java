package com.toudeuk.server.domain.kapay.controller;

import static com.toudeuk.server.core.exception.ErrorCode.*;

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
	private final UserRepository userRepository;
	private final ItemService itemService;

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
		@RequestParam(value = "partnerOrderId", required = false) String partnerOrderId // 선택적 파라미터
	) {
		ResponseEntity<?> approveResponseEntity = kapayService.approve(pgToken);

		if (approveResponseEntity.getStatusCode() == HttpStatus.OK) {
			// partnerOrderId가 있으면 아이템 구매 처리
			if (partnerOrderId != null && !partnerOrderId.isEmpty()) {
				try {
					// userId_itemId_timestamp 형식에서 필요한 정보 추출
					String[] parts = partnerOrderId.split("_");
					if (parts.length >= 2) {
						Long userId = Long.parseLong(parts[0]);
						Long itemId = Long.parseLong(parts[1]);

						// 아이템 지급
						itemService.giveItemAfterPayment(userId, itemId);
						log.info("아이템 결제 완료: userId={}, itemId={}", userId, itemId);
					}
				} catch (Exception e) {
					log.error("아이템 지급 중 오류 발생: {}", e.getMessage(), e);
				}
			} else {
				log.info("캐시 충전 완료");
			}

			return new RedirectView(baseUrl + "/kapay/approve");
		} else {
			return new RedirectView(baseUrl + "/kapay/fail");
		}
	}

	@GetMapping("/approve/{agent}/{openType}")
	public RedirectView approve(
		@PathVariable String agent,
		@PathVariable String openType,
		@RequestParam("pg_token") String pgToken
	) {
		ResponseEntity<?> approveResponseEntity = kapayService.approve(pgToken);

		if (approveResponseEntity.getStatusCode() == HttpStatus.OK) {
			return new RedirectView(baseUrl + "/kapay/approve");
		} else {
			return new RedirectView(baseUrl + "/kapay/fail");
		}
	}

	@GetMapping("/cancel/{agent}/{openType}")
	public RedirectView cancel(
		@PathVariable String agent,
		@PathVariable String openType
	) {
		System.out.println("cancel");

		String redirectUrl = baseUrl + "/kapay/cancel";

		return new RedirectView(redirectUrl);
	}

	@GetMapping("/fail/{agent}/{openType}")
	public RedirectView fail(
		@PathVariable String agent,
		@PathVariable String openType
	) {
		System.out.println("fail");
		return new RedirectView(baseUrl + "/kapay/fail");
	}

	public static String getRedirectUrl(String agent, String openType, ReadyResponse readyResponse) {
		switch (agent) {
			case "mobile":
				return readyResponse.getNext_redirect_mobile_url();
			case "app":
				return "app://webview?url=" + readyResponse.getNext_redirect_app_url();
			default:
				return readyResponse.getNext_redirect_pc_url();
		}
	}
}
