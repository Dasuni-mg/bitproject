package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Integer> {

    @Query("select s from Service s where (s.servicecode like concat('%',:searchtext,'%') or " +
            "s.servicename like concat('%',:searchtext,'%') )")
    Page<Service> findAll(String searchtext, Pageable of);

    //get reg no
    @Query(value = "SELECT concat('C',lpad(substring(max(c.regno),2)+1,7,'0')) FROM gamage_restaurant.customer as c;",nativeQuery = true)
    String nextRegNo();

    @Query( value = "select new Service(s.id,s.servicecode,s.servicename)from Service s")
    List<Service> list();

}
