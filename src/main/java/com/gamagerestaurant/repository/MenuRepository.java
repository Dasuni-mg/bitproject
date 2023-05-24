package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Menu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MenuRepository extends JpaRepository<Menu, Integer> {
    @Query("select m from Menu m where (m.menucode like concat('%',:searchtext,'%') or " +
            "m.menuname like concat('%',:searchtext,'%') or "+
            "m.menustatus_id.name  like concat('%',:searchtext,'%'))")
    Page<Menu> findAll(String searchtext, Pageable of);

    @Query( value = "select new Menu (m.id,m.menucode,m.price,m.menuname)from Menu m")
    List<Menu> list();

    // menu list by selecting a particular menu category
    @Query( value = "select m from Menu m where m.menucategory_id.id=:menucategoryid and m.menustatus_id.name ='Available'")
    List<Menu> menulistbymenucatagory(@Param("menucategoryid") Integer menucategoryid);

    //get MENU CODE
    @Query(value = "SELECT concat('MC',lpad(substring(max(mc.menucode),3)+1,6,'0')) FROM gamage_restaurant.menu as mc;",nativeQuery = true)
    String nextMenuCode();


}
