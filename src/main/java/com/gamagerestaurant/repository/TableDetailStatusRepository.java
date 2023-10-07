package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Customerstatus;
import com.gamagerestaurant.model.TableDetailStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TableDetailStatusRepository extends JpaRepository<TableDetailStatus, Integer>{
}
