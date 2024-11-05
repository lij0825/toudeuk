package com.toudeuk.server.domain.game.listener;

import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.core.exception.ErrorCode;
import com.toudeuk.server.domain.game.service.ClickGameService;
import com.toudeuk.server.domain.user.service.JWTService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final ClickGameService clickGameService;

    private final JWTService jwtService;

    @EventListener
    public void handleWebSocketConnectListener(SessionSubscribeEvent event) {
        // 클라이언트가 연결되었을 때 호출됨
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        List<String> authorizationHeaders = headerAccessor.getNativeHeader("Authorization");
        if (authorizationHeaders != null && !authorizationHeaders.isEmpty()) {
            String accessToken = authorizationHeaders.get(0).replace("Bearer ", "");
            System.out.println("Received accessToken: " + accessToken);

            Long userId = resolveToken(accessToken);
            System.out.println(userId);
            // accessToken을 이용해 추가 처리를 수행
            // 예: 유효성 검사 또는 사용자 정보 조회

            clickGameService.checkGame(userId);
        } else {
            throw new BaseException(ErrorCode.INVALID_ACCESS_TOKEN);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        // 클라이언트가 연결 해제되었을 때 호출됨
        // 필요에 따라 연결 해제 시 처리 로직을 추가할 수 있음
    }

    private Long resolveToken(String accessToken) {
        Claims claims = jwtService.parseClaims(accessToken);
        return Long.parseLong(claims.getSubject());
    }
}