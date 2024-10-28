package com.toudeuk.server.domain.user.response;

import com.toudeuk.server.domain.user.entity.ProviderType;
import com.toudeuk.server.domain.user.response.impl.GoogleResponse;
import com.toudeuk.server.domain.user.response.impl.KakaoResponse;
import com.toudeuk.server.domain.user.response.impl.NaverResponse;

import java.util.Map;

public class CustomOAuthUserFactory {
    public static OAuth2Response parseOAuth2Response(ProviderType providerType, Map<String, Object> attributes) {
        return switch (providerType) {
            case NAVER -> new NaverResponse(attributes);
            case GOOGLE -> new GoogleResponse(attributes);
            case KAKAO -> new KakaoResponse(attributes);
        };
    }
}
