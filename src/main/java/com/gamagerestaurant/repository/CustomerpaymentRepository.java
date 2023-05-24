package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Customerpayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CustomerpaymentRepository extends JpaRepository<Customerpayment, Integer> {

    @Query("select c from Customerpayment c where (c.billno like concat('%',:searchtext,'%') or "+

            "trim(c.paidamount)  like concat('%',:searchtext,'%') or " +
            "trim(c.balanceamount) like concat('%',:searchtext,'%') or c.bankname like concat('%',:searchtext,'%') or " +
            "trim(c.paiddatetime)  like concat('%',:searchtext,'%') or " +
            "c.cpstatus_id.name like concat('%',:searchtext,'%')or "+

            "c.cpmethod_id.name like concat('%',:searchtext,'%'))")
    Page<Customerpayment> findAll(String searchtext, Pageable of);

    //get bill no
    @Query(value = "SELECT concat('CP',lpad(substring(max(cp.billno),3)+1,6,'0')) FROM gamage_restaurant.customerpayment as cp;",nativeQuery = true)
    String nextBillNo();



}
