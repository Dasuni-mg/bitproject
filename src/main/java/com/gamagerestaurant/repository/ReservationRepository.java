package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

//Reservation -class name,Integer-type of primary key
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    //search query for DELIVERY RESERVATIONS
    @Query("select r from Reservation r where (r.reservationno like concat('%',:searchtext,'%') or " +
            "r.cname like concat('%',:searchtext,'%') or " +
            "trim(r.totalamount) like concat('%',:searchtext,'%')  ) and r.deliveryaddress is not null")
    Page<Reservation> finddeliverysearch(@Param("searchtext") String searchtext, Pageable of);

    //To get next RESERVATION NO
    @Query(value = "SELECT concat('R',lpad(substring(max(r.reservationno),2)+1,7,'0')) FROM gamage_restaurant.reservation as r;", nativeQuery = true)
    String nextResNo();

    @Query(value = "select new Reservation (r.id,r.reservationno,r.cmobile) from Reservation r")
    List<Reservation> list();

    //get reservation by code
    @Query("select r from Reservation r WHERE r.reservationno =?1 ")
    Reservation getByCode(String code);
//
//    @Query(value = "SELECT cp.paidamount, r.balanceamount, cp.reservationamount FROM gamage_restaurant.reservation as r inner join gamage_restaurant.customerpayment as cp on r.id = cp.reservation_id",nativeQuery = true)
//    Page<Reservation> findAlleservationwithpayment(PageRequest id);


    @Query(value = "SELECT cp.paidamount as padidamount,cp.reservationamount,r.reservationstatus_id as reservationstatus_id,r.balanceamount as balanceamount from Reservation r inner join Customerpayment cp on r.id=cp.reservation_id.id")
    Page findAlleservationwithpayment(PageRequest id);

    @Query(value = "select r from Reservation r where r.deliveryaddress is not null")
    Page finddelivery(PageRequest of);


    //delivery table
    @Query(value = "SELECT * FROM gamage_restaurant.reservation as r where r.deliveryaddress is not null", nativeQuery = true)
    List<Reservation> deliveryList();


    //dinein table
    @Query(value = "SELECT r FROM gamage_restaurant.reservation as r where r.id in (select rhs.reservation_id from gamage_restaurant.reservation_has_service as rhs where rhs.reserveddate is not null)", nativeQuery = true)
    Page finddinein(PageRequest id);


    //dine in search
    @Query("select r from Reservation r where r.receiveddate is not null and (r.reservationno like concat('%',:searchtext,'%') or " +
            "r.cname like concat('%',:searchtext,'%') or " +


            "trim(r.totalamount) like concat('%',:searchtext,'%')  ) ")
    Page<Reservation> finddineinsearch(@Param("searchtext") String searchtext, Pageable of);


    //take-away
    @Query("select r from Reservation r where  r.deliveryaddress is null and r.receiveddate is null")
    Page findtakeway(PageRequest id);


    //take-away search
    @Query("select r from Reservation r where  r.deliveryaddress is null and r.receiveddate is null and (r.reservationno like concat('%',:searchtext,'%') or " +
            "r.cname like concat('%',:searchtext,'%') or " +
            "trim(r.totalamount) like concat('%',:searchtext,'%')  ) ")
    Page<Reservation> findtakeawaysearch(@Param("searchtext") String searchtext, Pageable of);

    //Dine in customer list
    @Query(value = "SELECT * FROM gamage_restaurant.reservation as r where r.receiveddate is not null", nativeQuery = true)
    List<Reservation> getbyDineIn();

    //AVDANCE PAID CUSTOMERS
    //get reservation numbers of AVDANCE PAID CUSTOMERS to CUSTOMER PAYMENT
    @Query(value = "SELECT * FROM gamage_restaurant.reservation as r where r.isadvance=1", nativeQuery = true)
    List<Reservation> getbyIsAdvance();


//    @Query("select r from Reservation r  where  (r.reservationno like concat('%',:searchtext,'%') or " +
//            "r.cname like concat('%',:searchtext,'%') or " +
//            "trim(r.totalamount) like concat('%',:searchtext,'%'))")
//    Page<Reservation> findAlldelivery(String searchtext, PageRequest id);
}