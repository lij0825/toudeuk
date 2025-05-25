package com.toudeuk.server.domain.kapay.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.toudeuk.server.core.kafka.Producer;
import com.toudeuk.server.domain.game.repository.ClickGameCacheRepository;
import com.toudeuk.server.domain.kapay.dto.ApproveRequest;
import com.toudeuk.server.domain.kapay.dto.ApproveResponse;
import com.toudeuk.server.domain.kapay.dto.ReadyRequest;
import com.toudeuk.server.domain.kapay.dto.ReadyResponse;
import com.toudeuk.server.domain.user.entity.ProviderType;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.client.MockRestServiceServer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@RestClientTest(KapayService.class)
class KapayServiceTest {

    @Autowired
    private MockRestServiceServer mockServer;

    @Autowired
    private KapayService kapayService;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private Producer producer;

    @Value("${cid}")
    private String cid;

    @Value("${T1234567890}")
    private String tid;

    @Value("${kakaopay.api.host}")
    private String sampleHost;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private ClickGameCacheRepository clickGameCacheRepository;

    private String host = "https://open-api.kakaopay.com/online";

    @DisplayName("카카오페이 결제 준비 요청을 성공적으로 수행한다.")
    @Test
    void ready() throws JsonProcessingException {
        String endpoint = "/v1/payment/ready";
        String agent = "pc";
        String openType = "default";
        User user = User.createUser(
                "testuser@example.com",
                "테스트유저",
                ProviderType.KAKAO,
                "kakao_123456",
                "https://example.com/profile.png"
        );

        ReadyRequest readyRequest = ReadyRequest.builder()
                .cid(cid)
                .partnerOrderId("1")
                .partnerUserId("1")
                .itemName("아이템")
                .quantity(1)
                .totalAmount(1000)
                .taxFreeAmount(0)
                .vatAmount(100)
                .approvalUrl(sampleHost + "/api/v1/kapay/approve/" + agent + "/" + openType)
                .cancelUrl(sampleHost + "/api/v1/kapay/cancel/" + agent + "/" + openType)
                .failUrl(sampleHost + "/api/v1/kapay/fail/" + agent + "/" + openType)
                .build();

        ReadyResponse expected = ReadyResponse.builder()
            .tid(tid)
            .next_redirect_mobile_url("https://mock.kakaopay.com/redirect/mobile")
            .next_redirect_pc_url("https://mock.kakaopay.com/redirect/pc")
            .next_redirect_app_url("https://mock.kakaopay.com/redirect/app")
            .created_at("2025-05-19T10:00:00")
            .build();

        mockServer.expect(requestTo(host + endpoint))
                .andExpect(method(HttpMethod.POST))
                .andExpect(content().json(objectMapper.writeValueAsString(readyRequest)))
                .andRespond(withSuccess(objectMapper.writeValueAsString(expected), MediaType.APPLICATION_JSON));

        ReadyResponse result = kapayService.ready(user, "pc", "default", "아이템", 1000);

        assertThat(result.getNext_redirect_pc_url()).isEqualTo(expected.getNext_redirect_pc_url());
    }

    @DisplayName("카카오페이 결제 승인 요청을 성공적으로 수행한다.")
    @Test
    void approve() throws JsonProcessingException {

        //given
        String endpoint = "/v1/payment/approve";
        User user = User.createUser(
                "testuser@example.com",
                "테스트유저",
                ProviderType.KAKAO,
                "kakao_123456",
                "https://example.com/profile.png"
        );
        ReflectionTestUtils.setField(kapayService, "tid", tid);
        ReflectionTestUtils.setField(kapayService, "user", user);


        ApproveRequest request = ApproveRequest.builder()
            .cid(cid)
            .partnerOrderId("1")
            .partnerUserId("1")
            .pgToken("pg_token")
            .tid(tid)
            .build();

        ApproveResponse expected = ApproveResponse.builder()
                .aid("A1234567890")
                .tid(tid)
                .cid("TC0ONETIME")
                .partnerOrderId("partner_order_id_1234")
                .partnerUserId("partner_user_id_5678")
                .itemName("초코파이")
                .quantity(1)
                .amount(ApproveResponse.Amount.builder()
                        .total(2200)
                        .taxFree(0)
                        .vat(200)
                        .point(0)
                        .discount(0)
                        .greenDeposit(0)
                        .build())
                .paymentMethodType("CARD")
                .approvedAt("2025-05-19T10:00:00")
                .createdAt("2025-05-19T09:55:00")
                .build();

        mockServer.expect(requestTo(host + endpoint))
                .andExpect(method(HttpMethod.POST))
                .andExpect(content().json(objectMapper.writeValueAsString(request)))
                .andRespond(withSuccess(objectMapper.writeValueAsString(expected), MediaType.APPLICATION_JSON));

        //when
        ResponseEntity<?> response = kapayService.approve("pg_token", "partner_order_id_1234");


        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isInstanceOf(ApproveResponse.class);
        ApproveResponse result = (ApproveResponse) response.getBody();

        //then
        assertThat(result.getTid()).isEqualTo(expected.getTid());
    }
}