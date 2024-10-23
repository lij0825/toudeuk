package com.toudeuk.server.domain.user.entity;

public enum RoleType {
    // 일반 사용자, 관리자
    USER, ADMIN;

    public static boolean isRoleType(String type) {

        for (RoleType roleType : RoleType.values()) {
            if (roleType.equals(roleType)) {
                return true;
            }
        }

        return false;
    }
}

