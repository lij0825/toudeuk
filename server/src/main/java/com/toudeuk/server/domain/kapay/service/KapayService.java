package com.toudeuk.server.domain.kapay.service;

import com.toudeuk.server.domain.payment.domain.Payment;
import com.toudeuk.server.domain.payment.service.PaymentService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.core.exception.ErrorCode;
import com.toudeuk.server.core.kafka.Producer;
import com.toudeuk.server.core.kafka.dto.KafkaChargingDto;
import com.toudeuk.server.core.response.ErrorResponse;
import com.toudeuk.server.domain.game.repository.ClickGameCacheRepository;
import com.toudeuk.server.domain.kapay.dto.ApproveRequest;
import com.toudeuk.server.domain.kapay.dto.ApproveResponse;
import com.toudeuk.server.domain.kapay.dto.ReadyRequest;
import com.toudeuk.server.domain.kapay.dto.ReadyResponse;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.event.UserPaymentEvent;
import com.toudeuk.server.domain.user.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class KapayService {

	private final Producer producer;
	private final UserRepository userRepository;
	private final ClickGameCacheRepository clickGameCacheRepository;
	private final PaymentService paymentService;
	private final RestTemplate restTemplate;

	public KapayService(Producer producer, UserRepository userRepository, ClickGameCacheRepository clickGameCacheRepository, PaymentService paymentService, RestTemplateBuilder restBuilder, ApplicationEventPublisher eventPublisher) {
		this.producer = producer;
		this.userRepository = userRepository;
		this.clickGameCacheRepository = clickGameCacheRepository;
		this.restTemplate = restBuilder.build();
		this.paymentService = paymentService;
		this.eventPublisher = eventPublisher;
	}

	@Value("${kakaopay.api.secret.key}")
	private String kakaopaySecretKey;

	@Value("${cid}")
	private String cid;

	@Value("${kakaopay.api.host}")
	private String sampleHost;

	private final ApplicationEventPublisher eventPublisher;

	public ReadyResponse ready(User user, String agent, String openType, String itemName, Integer totalAmount) {

		// 요청 헤더 설정
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "DEV_SECRET_KEY " + kakaopaySecretKey);
		headers.setContentType(MediaType.APPLICATION_JSON);

		// 요청 파라미터 설정
		ReadyRequest readyRequest = ReadyRequest.builder()
			.cid(cid)
			.partnerOrderId("1")
			.partnerUserId("1")
			.itemName(itemName)
			.quantity(1)
			.totalAmount(totalAmount)
			.taxFreeAmount(0)
			.vatAmount(100)
			.approvalUrl(sampleHost + "/api/v1/kapay/approve/" + agent + "/" + openType)
			.cancelUrl(sampleHost + "/api/v1/kapay/cancel/" + agent + "/" + openType)
			.failUrl(sampleHost + "/api/v1/kapay/fail/" + agent + "/" + openType)
			.build();

		// 요청 전송
		HttpEntity<ReadyRequest> entityMap = new HttpEntity<>(readyRequest, headers);
		ResponseEntity<ReadyResponse> response = restTemplate.postForEntity(
			"https://open-api.kakaopay.com/online/v1/payment/ready",
			entityMap,
			ReadyResponse.class
		);

		paymentService.createPayment(readyRequest, response.getBody().getTid(), user);

		return response.getBody();
	}

	/**
	 * 아이템 구매용 카카오페이 결제 준비 메소드
	 */
	public ReadyResponse readyForItem(User user, String agent, String openType, String itemName, Integer totalAmount, Long itemId) {

	    // 아이템 구매용 파트너 주문 ID 형식: userId_itemId_timestamp
	    String partnerOrderId = user.getId() + "_" + itemId + "_" + System.currentTimeMillis();
	    String partnerUserId = String.valueOf(user.getId());

	    // 요청 헤더 설정
	    HttpHeaders headers = new HttpHeaders();
	    headers.add("Authorization", "DEV_SECRET_KEY " + kakaopaySecretKey);
	    headers.setContentType(MediaType.APPLICATION_JSON);

	    // 요청 파라미터 설정 - 아이템 구매용 URL에는 partnerOrderId 추가
	    ReadyRequest readyRequest = ReadyRequest.builder()
	        .cid(cid)
	        .partnerOrderId(partnerOrderId)
	        .partnerUserId(partnerUserId)
	        .itemName(itemName)
	        .quantity(1)
	        .totalAmount(totalAmount)
	        .taxFreeAmount(0)
	        .vatAmount(100)
	        .approvalUrl(sampleHost + "/api/v1/kapay/approve/" + agent + "/" + openType + "?partnerOrderId=" + partnerOrderId)
	        .cancelUrl(sampleHost + "/api/v1/kapay/cancel/" + agent + "/" + openType)
	        .failUrl(sampleHost + "/api/v1/kapay/fail/" + agent + "/" + openType)
	        .build();

	    // 요청 전송
	    HttpEntity<ReadyRequest> entityMap = new HttpEntity<>(readyRequest, headers);
	    ResponseEntity<ReadyResponse> response = restTemplate.postForEntity(
	        "https://open-api.kakaopay.com/online/v1/payment/ready",
	        entityMap,
	        ReadyResponse.class
	    );

		paymentService.createPayment(readyRequest, response.getBody().getTid(), user);
	    return response.getBody();
	}

	@Transactional
	public ResponseEntity<?> approve(String pgToken, String partnerOrderId) {
		try {

			/**
			 * 사전 결제정보를 찾음
			 */
			// 여기서 pgToken이랑 partnerUserId를 받아와야함 내가 알기론
			Payment findPayment = paymentService.findByPartnerOrderId(partnerOrderId);
			User user = findPayment.getUser();

			// 요청 헤더 설정
			HttpHeaders headers = new HttpHeaders();
			headers.add("Authorization", "SECRET_KEY " + kakaopaySecretKey);
			headers.setContentType(MediaType.APPLICATION_JSON);

			// 요청 파라미터 설정
			ApproveRequest approveRequest = ApproveRequest.builder()
				.cid(cid)
				.tid(findPayment.getTid())
				.partnerOrderId(findPayment.getPartnerOrderId())
				.partnerUserId(findPayment.getPartnerUserId())
				.pgToken(pgToken)
				.build();

			// 요청 전송
			HttpEntity<ApproveRequest> entityMap = new HttpEntity<>(approveRequest, headers);
			ResponseEntity<String> response = restTemplate.postForEntity(
				"https://open-api.kakaopay.com/online/v1/payment/approve",
				entityMap,
				String.class
			);

			// 상태코드 확인 후 성공 시만 파싱
			if (response.getStatusCode().is2xxSuccessful()) {
				ObjectMapper objectMapper = new ObjectMapper();
				ApproveResponse approveResponse = objectMapper.readValue(response.getBody(), ApproveResponse.class);

				Integer totalAmount = approveResponse.getAmount().getTotal();
				producer.occurChargeCash(new KafkaChargingDto(user.getId(), totalAmount, user.getCash() + totalAmount));
				clickGameCacheRepository.updateUserCash(user.getId(), totalAmount);

				return ResponseEntity.ok(approveResponse);
			}

			// 실패일 경우 error json 그대로 파싱해서 반환
			JsonNode errorNode = new ObjectMapper().readTree(response.getBody());
			String errorMessage = errorNode.has("error_message") ? errorNode.get("error_message").asText() : "승인 실패";
			return ResponseEntity.status(response.getStatusCode())
					.body(ErrorResponse.of(ErrorCode.KAKAO_PAY_API_ERROR, errorMessage));
		} catch (HttpStatusCodeException ex) {
			String responseBody = ex.getResponseBodyAsString();
			ObjectMapper objectMapper = new ObjectMapper();
			JsonNode jsonNode;
			try {
				jsonNode = objectMapper.readTree(responseBody);
			} catch (JsonProcessingException e) {
				return ResponseEntity.status(ex.getStatusCode())
					.body(ErrorResponse.of(ErrorCode.KAKAO_PAY_API_ERROR, "Error processing JSON", null));
			}

			JsonNode extrasNode = jsonNode.get("extras");
			String errorMessage =
				jsonNode.has("error_message") ? jsonNode.get("error_message").asText() : "Unknown error";

			return ResponseEntity.status(ex.getStatusCode())
				.body(ErrorResponse.of(ErrorCode.KAKAO_PAY_API_ERROR, errorMessage, extrasNode));
		} catch (Exception ex) {
			return ResponseEntity.status(500).body(ErrorResponse.of(ErrorCode.SERVER_ERROR, ex.getMessage()));
		}
	}

	public void saveChargeCash(KafkaChargingDto kafkaChargingDto) {

		User user = userRepository.findById(kafkaChargingDto.getUserId()).orElseThrow(
			() -> new BaseException(ErrorCode.USER_NOT_FOUND)
		);

		eventPublisher.publishEvent(new UserPaymentEvent(user, kafkaChargingDto.getTotalAmount()));
	}
}
