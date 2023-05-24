package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Spayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SpaymentRepository extends JpaRepository<Spayment, Integer> {

    @Query("select s from Spayment s where (s.billno like concat('%',:searchtext,'%') or "+
            "trim( s.totalamount) like concat('%',:searchtext,'%') or " +
            "trim(s.paidamount)  like concat('%',:searchtext,'%') or " +
            "trim(s.balanceamount) like concat('%',:searchtext,'%') or s.bankname like concat('%',:searchtext,'%') or " +
            "trim(s.paiddate)  like concat('%',:searchtext,'%') or " +
            "s.paymentstatus_id.name like concat('%',:searchtext,'%'))")
    Page<Spayment> findAll(String searchtext, Pageable of);

    //get bill no
    @Query(value = "SELECT concat('SP',lpad(substring(max(sp.billno),3)+1,8,'0')) FROM gamage_restaurant.spayment as sp;",nativeQuery = true)
    String nextBillNo();


}
