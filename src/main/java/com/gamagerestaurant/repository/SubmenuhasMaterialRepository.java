package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.SubmenuHasMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SubmenuhasMaterialRepository extends JpaRepository<SubmenuHasMaterial,Integer> {

    @Query(value = "SELECT shm FROM gamage_restaurant.submenu_has_material as shm where shm.submenu_id in(select sm.submenu_id from gamage_restaurant.menu_has_submenu as sm where sm.menu_id =: menuid)",nativeQuery = true)
    SubmenuHasMaterial getQty(int menuid);
}
