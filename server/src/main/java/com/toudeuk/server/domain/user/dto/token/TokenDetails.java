package com.toudeuk.server.domain.user.dto.token;

import java.time.LocalDateTime;

public record TokenDetails(String token, LocalDateTime expireTime) {
}
