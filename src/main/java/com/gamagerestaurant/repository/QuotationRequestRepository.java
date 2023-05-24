package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.QuotationRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuotationRequestRepository extends JpaRepository<QuotationRequest,Integer> {
    @Query("select q from QuotationRequest q where q.qrcode like concat('%',:searchtext,'%') or " +
            "q.supplier_id.fullname like concat('%',:searchtext,'%') or " +
            "q.description like concat('%',:searchtext,'%') or " +
            "q.qrstatus_id.name like concat('%',:searchtext,'%')")

            Page<QuotationRequest> findAll(String searchtext, Pageable of);

    @Query(value= "select new QuotationRequest(q.id,q.qrcode,q.supplier_id)from QuotationRequest q")
    List<QuotationRequest> list();

    //get qrcode
    @Query(value = "SELECT concat('QR',lpad(substring(max(qr.qrcode),3)+1,8,'0')) FROM gamage_restaurant.quotationrequest as qr;",nativeQuery = true)
    String nextQRCode();

    //when select supplier auto select quotation requests related to that supplier
    @Query(value ="SELECT new QuotationRequest( qr.id,qr.qrcode) FROM QuotationRequest qr WHERE qr.supplier_id.id=:supplierid and qr.qrstatus_id.name='Requested'")
    List<QuotationRequest>listBySupplier(@Param("supplierid")Integer supplierid);


}
