package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Purchaseorder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PurchaseorderRepository extends JpaRepository<Purchaseorder, Integer> {
    @Query("select p from Purchaseorder p where (p.pordercode like concat('%',:searchtext,'%') or " +
            "p.supplier_id.fullname like concat('%',:searchtext,'%')  or " +
            "p.porderstatus_id.name like concat('%',:searchtext,'%')  or " +
            "trim( p.requireddate) like concat('%',:searchtext,'%') or "+
            "trim(p.addeddate)  like concat('%',:searchtext,'%') or " +
            "p.description like concat('%',:searchtext,'%')  or " +
            "trim(p.totalamount)  like concat('%',:searchtext,'%'))")
    Page<Purchaseorder> findAll(String searchtext, Pageable of);

    @Query( value = "select new Purchaseorder (p.id,p.pordercode)from Purchaseorder p")
    List<Purchaseorder> list();

    //get porder code
    @Query(value = "SELECT concat('P',lpad(substring(max(p.pordercode),2)+1,9,'0')) FROM gamage_restaurant.porder as p;",nativeQuery = true)
    String nextPordercode();

    @Query(value = "select new Purchaseorder (p.id,p.pordercode) from Purchaseorder p WHERE p.supplier_id.id=:supplierid and p.porderstatus_id.id= 1")
    List<Purchaseorder>porderlistbysupplier(@Param("supplierid")Integer supplierid);

}
