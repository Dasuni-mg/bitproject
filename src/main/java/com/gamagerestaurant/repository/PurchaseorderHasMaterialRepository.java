package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.PurchaseorderHasMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PurchaseorderHasMaterialRepository extends JpaRepository<PurchaseorderHasMaterial,Integer> {


    //eka porder ekakin material fgodak enawa enisa object ekak ganna oona.parameter 2k oona.param 2 tma data pass karanna oona browser eke
    @Query(value = "select phm from PurchaseorderHasMaterial phm WHERE phm.porder_id.id=:porderid and  phm.material_id.id=:materialid")
    PurchaseorderHasMaterial purchaseorderbymaterial(@Param("porderid") Integer porderid , @Param("materialid") Integer materialid);


}
