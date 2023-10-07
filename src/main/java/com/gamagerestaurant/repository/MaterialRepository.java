package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Material;
import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MaterialRepository extends JpaRepository<Material,Integer> {

    @Query("select m from Material m where (m.materialcode like concat('%',:searchtext,'%') or " +
            "m.materialname like concat('%',:searchtext,'%') or "+
            "m.description like concat('%',:searchtext,'%') or " +
            "m.materialstatus_id.name like concat('%',:searchtext,'%') or m.materialcategory_id.name like concat('%',:searchtext,'%') or " +
            "m.unittype_id.name like concat('%',:searchtext,'%'))")
    Page<Material> findAll(String searchtext, Pageable of);

    //Query for get Material list with id,material code,material name
    @Query("select new Material(m.id,m.materialcode,m.materialname) from Material m")
    List<Material> List();

    //get bill no
    @Query(value = "SELECT concat('M',lpad(substring(max(m.materialcode),2)+1,7,'0')) FROM gamage_restaurant.material as m;",nativeQuery = true)
    String nextMaterialcode();


    @Query(value = "select new Material (m.id,m.materialcode,m.materialname) from Material m WHERE m.id " +
            "in(SELECT shm.material_id.id FROM Supplierhasmaterial shm WHERE shm.supplier_id.id =:supplierid) and " +
            "m.materialstatus_id.id=1")
    List<Material> materiallistbysupplier(@Param("supplierid") Integer supplierid);

    @Query(value = "select new Material (m.id,m.materialcode,m.materialname) from Material m WHERE m.id " +
            "in(SELECT qhm.material_id.id FROM QuotationHasMaterial qhm WHERE qhm.quotation_id.id =:quotationid) and " +
            "m.materialstatus_id.id=1")
    List<Material> materiallistbyquotation(@Param("quotationid") Integer quotationid);

    @Query(value = "select new Material (m.id,m.materialcode,m.materialname) from Material m WHERE m.id " +
            "in(SELECT phm.material_id.id FROM PurchaseorderHasMaterial phm WHERE phm.porder_id.id =:porderid) and " +
            "m.materialstatus_id.id=1")
    List<Material> materiallistbyporder(@Param("porderid") Integer porderid);

    @Query(value = "SELECT * FROM gamage_restaurant.material as m where m.materialcategory_id=:materialcategoryid",nativeQuery = true)
    List<Material> materiallistbymatCategory(@Param("materialcategoryid")int materialcategoryid);


}
