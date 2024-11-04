package com.toudeuk.server.domain.user.response.impl;

import java.util.Map;

import com.toudeuk.server.domain.user.entity.ProviderType;
import com.toudeuk.server.domain.user.response.OAuth2Response;

public class GoogleResponse implements OAuth2Response {
	private final Map<String, Object> attribute;

	public GoogleResponse(Map<String, Object> attribute) {
		this.attribute = attribute;
	}

	@Override
	public ProviderType getProvider() {
		return ProviderType.GOOGLE;
	}

	@Override
	public String getProviderId() {
		return attribute.get("sub").toString();
	}

	@Override
	public String getEmail() {
		return attribute.get("email").toString();
	}

	@Override
	public String getName() {
		return attribute.get("name").toString();
	}

	@Override
	public String getProfileImage() {
		return "";
	}
}
