package com.toudeuk.server.domain.user.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(staticName = "of")
public class JwtToken {
    private String accessToken;
    private String refreshToken;
}
