package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Menucategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenucategoryRepository extends JpaRepository<Menucategory,Integer> {
}
