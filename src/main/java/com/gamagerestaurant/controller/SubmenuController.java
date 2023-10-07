package com.gamagerestaurant.controller;


import com.gamagerestaurant.model.Employee;
import com.gamagerestaurant.model.Submenu;
import com.gamagerestaurant.model.SubmenuHasMaterial;
import com.gamagerestaurant.model.User;
import com.gamagerestaurant.repository.SubmenuRepository;
import com.gamagerestaurant.repository.SubmenustatusRepository;
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
@RequestMapping(value = "/submenu")
public class SubmenuController {

    @Autowired //create a object and convert to a instance
    private PrevilageController previlageController;

    @Autowired //create a object and convert to a instance
    private UserService userService;
    @Autowired //create a object and convert to a instance
    //create a object and convert to a instance
    private SubmenuRepository dao;

    @Autowired //create a object and convert to a instance
    //in delete only change the status id to delete.so status repository is needed
    private SubmenustatusRepository daostatus;

    //get next supplier bill [/submenu/nextsm]
    @GetMapping(value = "/nextsm",produces = "application/json")
    public Submenu nextSM(){
        String nextsubmenucode = dao.nextSubmenuCode();

        Submenu nextsm = new Submenu(nextsubmenucode);
        return nextsm;
    }


    @GetMapping(value = "/list",produces = "application/json")
    public List<Submenu>submenuList(){
        return dao.list();
    }

    @GetMapping(value = "/ListBySubmenu",params ={"submenuid"},produces = "application/json")
    public List<Submenu> submenulistBySubmenu(@RequestParam("submenuid") int submenuid) {
        return dao.listBySubmenu(submenuid);
    }




    //data access object
    //get request mapping for Get submenu page request given params
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Submenu> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUBMENU");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;

    }

    //get request mapping for Get submenu page request given params with search value
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Submenu> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUBMENU");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;
    }


    //post mapping for insert submenu object
    @PostMapping
    public String insert(@RequestBody Submenu submenu) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUBMENU");
        //check user null
        if (priv != null & priv.get("add")) {
            try {
                System.out.println(submenu);
                submenu.setAddeddate(LocalDate.now());
                submenu.setSubmenustatus_id(daostatus.getById(1));
                submenu.setEmployee_id(user.getEmployeeId());
                submenu.setSubmenucode(dao.nextSubmenuCode());
             // submenu.setEmployee_id();
                for(SubmenuHasMaterial shi : submenu.getSubmenuHasMaterialList()){
                    shi.setSubmenu_id(submenu);
                }
                dao.save(submenu);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error saving: you have No previlage..!";

    }

    //mapping for update submenu object
    @PutMapping
    public String update(@RequestBody  Submenu submenu) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "GRN");
        //check user null
        if (user != null & priv != null & priv.get("update")) {
            try {
                System.out.println(submenu);
                for(SubmenuHasMaterial shi : submenu.getSubmenuHasMaterialList()){
                    shi.setSubmenu_id(submenu);
                }
                dao.save(submenu);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error updating: you have No previlage..!";


    }


    // Delete Mapping for insert submenu object
    @DeleteMapping
    public String delete(@RequestBody Submenu submenu) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "GRN");
        //check user null
        if (user != null & priv != null & priv.get("delete")) {

            try {
                submenu.setSubmenustatus_id(daostatus.getById(3));
                for(SubmenuHasMaterial shi : submenu.getSubmenuHasMaterialList()){
                    shi.setSubmenu_id(submenu);
                }
                dao.save(submenu);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed.." + ex.getMessage();
            }
        } else
            return "Error deleting: you have No previlage..!";
    }


}


