package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Materialinventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface MaterialInventoryRepository extends JpaRepository<Materialinventory, Integer> {

    @Query("select mi from Materialinventory mi where (trim(mi.removeqty ) like concat('%',:searchtext,'%') or trim(mi.avaqty)  like concat('%',:searchtext,'%') or " +
            "mi.material_id.materialname like concat('%',:searchtext,'%') or mi.inventorystatus_id.name like concat('%',:searchtext,'%') )")
    Page<Materialinventory> findAll(String searchtext, Pageable of);

    @Query("select mi from Materialinventory mi where mi.material_id.id=:matid")
    Materialinventory getByMaterial(@Param("matid") Integer matid);

//    @Query(value = "SELECT dayname(sp.paiddate),sum(sp.paidamount) FROM gamage_restaurant.spayment as sp WHERE sp.paiddate between ?1 and ?2 group by dayname(sp.paiddate)",nativeQuery = true)
//    List dailyExpencesReportList(LocalDate parse, LocalDate parse1);


}
