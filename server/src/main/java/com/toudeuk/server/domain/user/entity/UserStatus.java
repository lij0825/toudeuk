package com.toudeuk.server.domain.user.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum UserStatus {

    INACTIVE("휴면"),
    ACTIVE("활동"),
    DELETED("탈퇴");

    private final String description;


}