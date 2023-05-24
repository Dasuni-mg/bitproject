package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Grn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GrnRepository extends JpaRepository<Grn, Integer> {
    @Query("select g from Grn g where (g.grncode like concat('%',:searchtext,'%') or " +
            "g.description like concat('%',:searchtext,'%') or "+
            "g.grnstatus_id.name like concat('%',:searchtext,'%') or "+
            "trim(g.addeddate)   like concat('%',:searchtext,'%') or " +
            "trim(g.receiveddate)  like concat('%',:searchtext,'%')  or " +
            "trim(g.totalamount)  like concat('%',:searchtext,'%'))")
    Page<Grn> findAll(String searchtext, Pageable of);

    @Query( value = "select new Grn (g.id,g.grncode)from Grn g")
    List<Grn> list();

    //get GRN Code
    @Query(value = "SELECT concat('SGRN',lpad(substring(max(g.grncode),5)+1,6,'0')) FROM gamage_restaurant.grn as g;",nativeQuery = true)
    String nextGRNCode();
}
