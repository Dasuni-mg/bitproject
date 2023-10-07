package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.DailyUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DailyUsageReopistory extends JpaRepository<DailyUsage,Integer> {

    @Query("select du from DailyUsage du where du.material_id.id=:matid")
    DailyUsage getByMaterial(@Param("matid") Integer matid);
}
