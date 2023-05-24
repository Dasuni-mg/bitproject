package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Submenu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubmenuRepository extends JpaRepository<Submenu, Integer> {
    @Query("select s from Submenu s where (s.submenucode like concat('%',:searchtext,'%') or " +
            "s.submenuname like concat('%',:searchtext,'%') or "+
            "s.submenucategory_id.name like concat('%',:searchtext,'%') or "+
            "s.submenustatus_id.name  like concat('%',:searchtext,'%'))")
    Page<Submenu> findAll(String searchtext, Pageable of);

    @Query( value = "select new Submenu (s.id,s.submenucode,s.price,s.submenuname)from Submenu s")
    List<Submenu> list();

    //get bill no
    @Query(value = "SELECT concat('SM',lpad(substring(max(sc.submenucode),3)+1,6,'0')) FROM gamage_restaurant.submenu as sc;",nativeQuery = true)
    String nextSubmenuCode();

    // submenu list by selecting a particular menu category
    @Query(value ="select sm from Submenu sm where sm.submenucategory_id.id=:submenuid and sm.submenustatus_id.name='Available'")
    List<Submenu>listBySubmenu(@Param("submenuid")Integer submenuid);



}
