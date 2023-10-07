package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Tabledetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TableddetailRepository extends JpaRepository<Tabledetail, Integer>{
    @Query("select t from Tabledetail t where t.tabledetailstatus_id.id=1")
    List<Tabledetail> detailsbystatus();
}
