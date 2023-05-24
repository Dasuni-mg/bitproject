package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Paymentmethod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentmethodRepository extends JpaRepository<Paymentmethod, Integer> {
}
