package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
    @Query("select s from Supplier s where (s.regno like concat('%',:searchtext,'%') or " +
            "s.fullname like concat('%',:searchtext,'%') or "+
            "s.cpname like concat('%',:searchtext,'%') or " +
            "s.email like concat('%',:searchtext,'%') or s.address like concat('%',:searchtext,'%') or " +
            "s.bankholdername like concat('%',:searchtext,'%') or s.bankname like concat('%',:searchtext,'%') or " +
            "s.employee_id.callingname like concat('%',:searchtext,'%') or " +
            "s.supplierstatus_id.name like concat('%',:searchtext,'%'))")
    Page<Supplier> findAll(String searchtext, Pageable of);

    @Query( value = "select new Supplier(s.id,s.regno,s.fullname)from Supplier s")
    List<Supplier> list();

    //get reg no
    @Query(value = "SELECT concat('S',lpad(substring(max(s.regno),2)+1,7,'0')) FROM gamage_restaurant.supplier as s;",nativeQuery = true)
    String nextRegNo();

}
