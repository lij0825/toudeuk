package com.toudeuk.server.core.annotation;

import org.springframework.security.access.annotation.Secured;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
@Secured({"ROLE_ADMIN"})
public @interface IsAdmin {
}
