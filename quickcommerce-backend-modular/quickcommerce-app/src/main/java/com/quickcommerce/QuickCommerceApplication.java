package com.quickcommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication(
    scanBasePackages = {
        "com.quickcommerce.shared",
        "com.quickcommerce.order",
        "com.quickcommerce.payment",
        "com.quickcommerce.inventory",
        "com.quickcommerce.product",
        "com.quickcommerce.shipment",
        "com.quickcommerce.communication"
    }
)
@EntityScan(basePackages = "com.quickcommerce")
@EnableJpaRepositories(basePackages = "com.quickcommerce")
@EnableTransactionManagement
@EnableScheduling
public class QuickCommerceApplication {
    public static void main(String[] args) {
        SpringApplication.run(QuickCommerceApplication.class, args);
    }
} 