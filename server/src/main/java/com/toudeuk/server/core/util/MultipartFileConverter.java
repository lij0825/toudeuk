package com.toudeuk.server.core.util;

import org.springframework.web.multipart.MultipartFile;

public class MultipartFileConverter {
	public static MultipartFile convertToFile(byte[] fileContent, String fileName, String contentType) {
		return new ByteArrayMultipartFile(fileContent, fileName, contentType);
	}
}
