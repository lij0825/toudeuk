package com.toudeuk.server.core.response;


import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;

@Getter
public class SuccessResponse<T> extends BaseResponse<T> {
    private final static SuccessResponse<Void> EMPTY = new SuccessResponse<>();
    private final static SuccessResponse<Void> CREATED = new SuccessResponse<>(201);

    @JsonIgnore
    private Object errors;

    private SuccessResponse(T data) {
        this.success = true;
        this.status = 200;
        this.message = "success";
        this.data = data;
    }

    private SuccessResponse() {
        this.success = true;
        this.status = 200;
        this.message = "success";
    }

    private SuccessResponse(int status) {
        this.success = true;
        this.status = status;
        this.message = "success";
    }

    public static <T> SuccessResponse<T> of(T data) {
        return new SuccessResponse<>(data);
    }

    public static SuccessResponse<Void> empty() {
        return EMPTY;
    }

    public static SuccessResponse<Void> created() {
        return CREATED;
    }
}
