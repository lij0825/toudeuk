package com.toudeuk.server.domain.user.response;

import com.toudeuk.server.domain.user.entity.ProviderType;

public interface OAuth2Response {
	ProviderType getProvider();

	String getProviderId();

	String getEmail();

	String getName();

	String getGender();
}
