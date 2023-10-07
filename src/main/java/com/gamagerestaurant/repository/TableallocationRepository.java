package com.gamagerestaurant.repository;


import com.gamagerestaurant.model.Tableallocation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TableallocationRepository extends JpaRepository<Tableallocation, Integer> {

    @Query("select t from Tableallocation t where (t.tableallocationcode like concat('%',:searchtext,'%') or "+
            "trim( t.reserveddate) like concat('%',:searchtext,'%') or " +
            "trim(t.reserveouttime)  like concat('%',:searchtext,'%') or " +
            "trim(t.addeddate) like concat('%',:searchtext,'%') or" +
            " t.tablestatus_id.name like concat('%',:searchtext,'%') or " +
            " t.reservation_id.cname like concat('%',:searchtext,'%'))")
    Page<Tableallocation> findAll(String searchtext, Pageable of);

    //get bill no
    @Query(value = "SELECT concat('TA',lpad(substring(max(ta.tableallocationcode),3)+1,8,'0')) FROM gamage_restaurant.tableallocation as ta;",nativeQuery = true)
    String nextTblAllocationCode();



    @Query( value = "select new Tableallocation (t.tableallocationcode)from Tableallocation t")
    List<Tableallocation> list();
}
