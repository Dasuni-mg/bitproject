package com.gamagerestaurant.controller;


import com.gamagerestaurant.model.*;
import com.gamagerestaurant.repository.MenuRepository;
import com.gamagerestaurant.repository.MenustatusRepository;
import com.gamagerestaurant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/menu")
public class MenuController {

    @Autowired //create a object and convert to a instance
    private PrevilageController previlageController;

    @Autowired //create a object and convert to a instance
    private UserService userService;
    @Autowired //create a object and convert to a instance
    //create a object and convert to a instance
    private MenuRepository dao;

    @Autowired //create a object and convert to a instance
    //in delete only change the status id to delete.so status repository is needed
    private MenustatusRepository daostatus;

   

    //get next service bill [/service/nextmc
    @GetMapping(value = "/nextmc", produces = "application/json")
    public Menu nextMenuCode() {
        String nextmcode = dao.nextMenuCode();

        Menu nextmc = new Menu(nextmcode);
        return nextmc;
    }

    //get next menuname
    @GetMapping(value="/nextmenuname",produces = "application/json")
    public Menu nextmenuname(){
        String nextmenuname = dao.getnextmenuname();
        Menu nxtmenuname = new Menu(nextmenuname);
        return nxtmenuname;

    }

    // menu list by selecting a particular menu category
    @GetMapping(value = "/listbymenucategory",params = "menucategoryid",produces = "application/json")
    public List<Menu> menuBycategory(@RequestParam("menucategoryid") Integer menucategoryid){
        return dao.menulistbymenucatagory(menucategoryid);
    }

    @GetMapping(value = "/list", produces = "application/json")
    public List<Menu> menuList() {
        return dao.list();
    }

    //data access object
    //get request mapping for Get menu page request given params
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Menu> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "MENU");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;

    }

    //get request mapping for Get submenu page request given params with search value
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Menu> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "MENU");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;
    }


    //post mapping for insert submenu object
    @PostMapping
    public String insert(@RequestBody Menu menu) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        System.out.println("USER Name "+user.getUserName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "MENU");
        //check user null
        if (priv != null & priv.get("add")) {
            try {
                menu.setMenucode(dao.nextMenuCode());
                menu.setAddeddate(LocalDate.now());
                menu.setMenustatus_id(daostatus.getById(1));
                menu.setEmployee_id(user.getEmployeeId());
                for (MenuHasSubmenu mhs : menu.getMenuHasSubmenuList()) {
                    mhs.setMenu_id(menu);
                }
                dao.save(menu);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error saving: you have No previlage..!";

    }

    //mapping for update submenu object
    @PutMapping
    public String update(@RequestBody Menu menu) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "MENU");
        //check user null
        if (user != null & priv != null & priv.get("update")) {
            try {

                for (MenuHasSubmenu mhs : menu.getMenuHasSubmenuList()) {
                    mhs.setMenu_id(menu);
                }
                dao.save(menu);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error updating: you have No previlage..!";


    }



    // Delete Mapping for insert item object
    @DeleteMapping
    public String delete(@RequestBody  Menu menu) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "MENU");
        //check user null
        if (user != null & priv != null & priv.get("delete")) {
            try {
                menu.setMenustatus_id(daostatus.getById(3));


                for (MenuHasSubmenu mhs : menu.getMenuHasSubmenuList()) {
                    mhs.setMenu_id(menu);
                }
                dao.save(menu);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed.." + ex.getMessage();
            }
        } else
            return "Error deleting: you have No previlage..!";
    }
}


