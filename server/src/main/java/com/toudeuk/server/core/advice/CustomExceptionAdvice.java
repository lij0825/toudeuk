package com.toudeuk.server.core.advice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.core.exception.ErrorCode;
import com.toudeuk.server.core.response.CustomValidationError;
import com.toudeuk.server.core.response.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class CustomExceptionAdvice {
	@ExceptionHandler(Exception.class)
	public ErrorResponse exception(Exception e) {
		if (!e.getMessage().contains("No static resource")) {
			log.error("message: {}", e.getMessage(), e);
		}
		return ErrorResponse.of(ErrorCode.SERVER_ERROR);
	}

	@ExceptionHandler({AuthorizationDeniedException.class})
	public ResponseEntity<ErrorResponse> authenticateException(Exception e) {
		log.error("access exception: {}", e.getMessage());
		ErrorCode errorCode = ErrorCode.ACCESS_DENIED;
		return ResponseEntity
			.status(errorCode.getStatus())
			.body(ErrorResponse.of(errorCode, e.getMessage()));
	}

	@ExceptionHandler(BaseException.class)
	public ResponseEntity<ErrorResponse> baseException(BaseException e) {
		log.error("message: {}", e.getMessage());
		ErrorCode errorCode = e.getErrorCode();
		return ResponseEntity
			.status(errorCode.getStatus())
			.body(ErrorResponse.of(errorCode, e.getMessage()));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<CustomValidationError> handleMethodArgumentNotValidException(
		MethodArgumentNotValidException e) {
		CustomValidationError customValidationError = new CustomValidationError(e.getBindingResult());
		return ResponseEntity
			.status(HttpStatus.BAD_REQUEST)
			.body(customValidationError);
	}
}

