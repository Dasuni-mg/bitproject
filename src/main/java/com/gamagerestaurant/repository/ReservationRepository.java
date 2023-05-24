package com.gamagerestaurant.repository;
import com.gamagerestaurant.model.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
//Reservation -class name,Integer-type of primary key
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    //search query
    @Query("select r from Reservation r where (r.reservationno like concat('%',:searchtext,'%') or " +
            "r.cname like concat('%',:searchtext,'%') or " +
            "r.cmobile like concat('%',:searchtext,'%') or " +
            "trim(r.lastprice) like concat('%',:searchtext,'%') or " +
            "trim(r.totalamount) like concat('%',:searchtext,'%') or " +
            "trim(r.discountratio) like concat('%',:searchtext,'%') or " +
            "r.reservationstatus_id.name like concat('%',:searchtext,'%') )")
    Page<Reservation> findAll(@Param("searchtext") String searchtext, Pageable of);
    //reg no
    @Query(value = "SELECT concat('R',lpad(substring(max(r.reservationno),2)+1,7,'0')) FROM gamage_restaurant.reservation as r;",nativeQuery = true)
    String nextResNo();

    @Query( value = "select new Reservation (r.id,r.reservationno,r.cmobile) from Reservation r")
    List<Reservation> list();

    //get reservation by code
    @Query("select r from Reservation r WHERE r.reservationno =?1 ")
    Reservation getByCode(String code);
}
