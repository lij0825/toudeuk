package com.toudeuk.server.domain.user.event;

import org.springframework.web.multipart.MultipartFile;

import com.toudeuk.server.domain.user.entity.User;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class S3UploadEvent {
	User user;
	MultipartFile file;
}
