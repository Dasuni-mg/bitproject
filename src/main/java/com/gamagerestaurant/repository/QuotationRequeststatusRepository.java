package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.QrStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuotationRequeststatusRepository  extends JpaRepository<QrStatus,Integer> {
}
