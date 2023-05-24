package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.ReservationHasService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReservationHasServiceRepository extends JpaRepository<ReservationHasService,Integer> {

}
