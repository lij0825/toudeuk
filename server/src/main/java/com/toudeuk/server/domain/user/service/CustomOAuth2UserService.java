package com.toudeuk.server.domain.user.service;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.toudeuk.server.domain.user.entity.ProviderType;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.repository.UserRepository;
import com.toudeuk.server.domain.user.response.CustomOAuth2User;
import com.toudeuk.server.domain.user.response.CustomOAuthUserFactory;
import com.toudeuk.server.domain.user.response.OAuth2Response;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
	private final UserRepository userRepository;
	private final ApplicationEventPublisher eventPublisher;

	@Transactional
	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User oauth2User = super.loadUser(userRequest);

		String registrationId = userRequest.getClientRegistration().getRegistrationId();
		ProviderType providerType = ProviderType.valueOf(registrationId.toUpperCase());
		OAuth2Response oauth2Response = CustomOAuthUserFactory.parseOAuth2Response(providerType,
			oauth2User.getAttributes());

		String username = oauth2Response.getEmail();

		User user = userRepository.findByUsername(username).orElseGet(() -> userRepository.save(User.createUser(
			username,
			oauth2Response.getName(),
			oauth2Response.getProvider(),
			oauth2Response.getProviderId(),
			oauth2Response.getProfileImage()
		)));

		return new CustomOAuth2User(user);
	}
}
