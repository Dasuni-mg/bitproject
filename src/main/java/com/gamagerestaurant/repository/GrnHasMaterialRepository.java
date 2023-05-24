package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.MenuHasSubmenu;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrnHasMaterialRepository extends JpaRepository<MenuHasSubmenu,Integer> {
}
