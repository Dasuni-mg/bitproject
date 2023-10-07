package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Cpmethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerPaymentmethodRepository extends JpaRepository<Cpmethod, Integer> {


    @Query(value = "SELECT * FROM gamage_restaurant.cpmethod as cp where cp.id = 2",nativeQuery = true)
    List<Cpmethod> getBymethod();


    @Query(value = "select cp from Cpmethod cp where cp.id=2")
    Cpmethod getCash();
}
