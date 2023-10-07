package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    @Query("select cr from Customer cr where (cr.regno like concat('%',:searchtext,'%') or " +
            "cr.fname like concat('%',:searchtext,'%') or cr.lname like concat('%',:searchtext,'%') or " +
            "cr.mobileno like concat('%',:searchtext,'%') or cr.secondno like concat('%',:searchtext,'%') or " +
            "cr.nic like concat('%',:searchtext,'%') or cr.address like concat('%',:searchtext,'%') or " +
            "cr.customerstatus_id.name like concat('%',:searchtext,'%'))")
    Page<Customer> findAll(String searchtext, Pageable of);

    //get reg no
    @Query(value = "SELECT concat('C',lpad(substring(max(c.regno),2)+1,7,'0')) FROM gamage_restaurant.customer as c;",nativeQuery = true)
    String nextRegNo();

    @Query( value = "select new Customer (c.id,c.fname,c.lname,c.mobileno,c.address) from Customer c")
    List<Customer> list();

    @Query("select c from Customer c where c.nic=:nic")
    Customer findByNic(@Param("nic") String nic);

    @Query("select c from Customer c where c.mobileno=:mobileno")
    Customer findByMobileNo(@Param("mobileno") String mobileno);

    @Query("select c from  Customer c where  c.customerstatus_id.id=1")
    List<Customer> activecustomers();
}
