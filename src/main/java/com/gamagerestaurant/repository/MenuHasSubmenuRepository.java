package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.MenuHasSubmenu;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuHasSubmenuRepository extends JpaRepository<MenuHasSubmenu,Integer> {
}
