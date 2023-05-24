package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.QuotationHasMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuotationHasMaterialRepository extends JpaRepository<QuotationHasMaterial,Integer> {

    @Query("select qhm from QuotationHasMaterial qhm where qhm.quotation_id.id=:quotationid and qhm.material_id.id=:materialid")
    List<QuotationHasMaterial> quotationnmaterial(@Param("quotationid") Integer quotationid , @Param("materialid") Integer materialid);


}
