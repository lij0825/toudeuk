package com.toudeuk.configuration;

import java.sql.Connection;
import java.sql.SQLException;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

public class ConnectionPool {
	private static HikariDataSource dataSource;

	static {
		HikariConfig config = new HikariConfig();
		config.setJdbcUrl("jdbc:mysql://43.203.141.23:3306/toudeuk?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Seoul");
		config.setUsername("toudeuk");
		config.setPassword("toudeuk");
		config.setMaximumPoolSize(10);
		config.setMinimumIdle(5);
		config.setIdleTimeout(300000);
		config.setMaxLifetime(1800000);

		dataSource = new HikariDataSource(config);
	}

	public static Connection getConnection() throws SQLException {
		return dataSource.getConnection();
	}
}