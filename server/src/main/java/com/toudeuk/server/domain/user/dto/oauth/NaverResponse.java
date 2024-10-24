package com.toudeuk.server.domain.user.dto.oauth;

import com.toudeuk.server.core.util.SHA256Util;
import com.toudeuk.server.domain.user.entity.RoleType;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.entity.UserStatus;
import lombok.RequiredArgsConstructor;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

public class NaverResponse implements OAuth2Response{

    private final Map<String, Object> attributes;

    public NaverResponse(Map<String, Object> attributes) {
        System.out.println(attributes);
        this.attributes = (Map<String, Object>) attributes.get("response");
    }

    @Override
    public String getProvider() {
        return "naver";
    }

    @Override
    public String getProviderId() {
        return attributes.get("id").toString();
    }

    @Override
    public String getEmail() {
        return attributes.get("email").toString();
    }

    @Override
    public String getName() {
        return attributes.get("name").toString();
    }

    public String makeNickname() {
        String email = getEmail();
        return hashString(email);
    }


    private String hashString(String input) {
        return SHA256Util.hashString(input);
    }

    @Override
    public User toEntity() {

        return User.builder()
                .email(getEmail())
                .name(getName())
                .roleType(RoleType.USER)
                .userStatus(UserStatus.ACTIVE)
                .nickname(makeNickname())
                .build();
    }
}
