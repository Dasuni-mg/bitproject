package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Customer;
import com.gamagerestaurant.model.Deletedcustomer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DeletedcustomerRepository extends JpaRepository<Deletedcustomer, Integer> {



    //get reg no

}
