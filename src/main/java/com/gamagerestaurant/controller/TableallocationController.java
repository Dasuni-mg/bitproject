package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.*;
import com.gamagerestaurant.repository.TableallocationRepository;
import com.gamagerestaurant.repository.TablestatusRepository;
import com.gamagerestaurant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/tableallocation")
public class TableallocationController {

    @Autowired //create a object and convert to a instance
    private PrevilageController previlageController;

    @Autowired //create a object and convert to a instance
    private UserService userService;

    @Autowired //create a object and convert to a instance
    private TableallocationRepository dao;

    @Autowired //create a object and convert to a instance
    //in delete only change the status id to delete.so status repository is needed
    private TablestatusRepository daostatus;


    @GetMapping(value = "/list", produces = "application/json")
    public List<Tableallocation> tableallocationList() {
        return dao.list();
    }


    //get next table allocation code [/tableallocation/nextta]
    @GetMapping(value = "/nextta", produces = "application/json")
    public Tableallocation nextTA() {
        String nexttblallocationcode = dao.nextTblAllocationCode();

        Tableallocation nextta = new Tableallocation(nexttblallocationcode);
        return nextta;
    }


    //data access object
    //get request mapping for Get tableallocation page request given params
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Tableallocation> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "TABLEALLOWCATION");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;

    }

    //get request mapping for Get tableallocation page request given params with search value
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Tableallocation> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "TABLEALLOWCATION");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;
    }

    //post mapping for insert tableallocation object
    @PostMapping
    public String insert(@RequestBody Tableallocation tableallocation) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "TABLEALLOWCATION");
        //check user null
        if (priv != null & priv.get("add")) {
            try {
                System.out.println(tableallocation);
                for (TableallocationHasTableddetail thd : tableallocation.getTableallocationHasTableddetailList()) {
                    thd.setTableallocation_id(tableallocation);
                }
                dao.save(tableallocation);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error saving: you have No previlage..!";

    }


    //mapping for update porder object
    @PutMapping
    public String update(@RequestBody Tableallocation tableallocation) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "TABLEALLOWCATION");
        //check user null
        if (priv != null & priv.get("update")) {
            try {
                System.out.println(tableallocation);
                for (TableallocationHasTableddetail thd : tableallocation.getTableallocationHasTableddetailList()) {
                    thd.setTableallocation_id(tableallocation);
                }
                dao.save(tableallocation);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error updating: you have No previlage..!";


    }


    // Delete Mapping for insert grn object
    @DeleteMapping
    public String delete(@RequestBody Tableallocation tableallocation) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "TABLEALLOWCATION");
        //check user null
        if (user != null & priv != null & priv.get("delete")) {

            try {
                tableallocation.setTablestatus_id(daostatus.getById(3));
                for (TableallocationHasTableddetail thd : tableallocation.getTableallocationHasTableddetailList()) {
                    thd.setTableallocation_id(tableallocation);
                }
                dao.save(tableallocation);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed.." + ex.getMessage();
            }
        } else
            return "Error deleting: you have No previlage..!";
    }


}

