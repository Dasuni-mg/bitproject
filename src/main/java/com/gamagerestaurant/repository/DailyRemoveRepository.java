package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Dailyremove;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DailyRemoveRepository extends JpaRepository<Dailyremove,Integer> {
    @Query("select d from Dailyremove d where d.dailyremovecode like concat('%',:searchtext,'%') or " +
            "trim(d.removeqty)  like concat('%',:searchtext,'%') or " +
            "d.dailyremovestatus_id.name like concat('%',:searchtext,'%')" )

            Page<Dailyremove> findAll(String searchtext, Pageable of);

   /* @Query(value= "select new Dailyremove (d.id,d.dailyremovecode)from Dailyremove d")
    List<Dailyremove> list();*/

    //get bill no
    @Query(value = "SELECT concat('MDR',lpad(substring(max(dr.dailyremovecode),4)+1,7,'0')) FROM gamage_restaurant.dailyremove AS dr;",nativeQuery = true)
    String nextDRCode();

}
