package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Quotation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuotationRepository extends JpaRepository<Quotation,Integer> {
    @Query("select q from Quotation q where q.quotationcode like concat('%',:searchtext,'%') or " +
            "q.quotationrequest_id.qrcode like concat('%',:searchtext,'%') or " +
            "q.quotationrequest_id.supplier_id.fullname like concat('%',:searchtext,'%') or " +
            "q.quotationstatus_id.name like concat('%',:searchtext,'%') or " +
            "q.description like concat('%',:searchtext,'%') or " +
            "trim(q.addeddate) like concat('%',:searchtext,'%') or " +
            "trim(q.receiveddate)  like concat('%',:searchtext,'%')")
            Page<Quotation> findAll(String searchtext, Pageable of);

    @Query(value= "select new Quotation(q.id,q.quotationcode)from Quotation q")
    List<Quotation> list();


    //get Quotation code
    @Query(value = "SELECT concat('Q',lpad(substring(max(q.quotationcode),2)+1,9,'0')) FROM gamage_restaurant.quotation as q;",nativeQuery = true)
    String nextQCode();

    @Query(value = "select new Quotation (q.id,q.quotationcode) from Quotation q WHERE q.quotationrequest_id.supplier_id.id=:supplierid and q.quotationstatus_id.id=1")
    List<Quotation>quotationlistbysupplier(@Param("supplierid")Integer supplierid);

}
