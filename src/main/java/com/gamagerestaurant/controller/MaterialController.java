package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.Material;
import com.gamagerestaurant.model.User;

import com.gamagerestaurant.repository.MaterialRepository;
import com.gamagerestaurant.repository.MaterialstatusRepository;
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
@RequestMapping(value = "/material")
//request services of material
public class MaterialController{
    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private UserService userService;
    @Autowired
    //create a object and convert to a instance
    private MaterialRepository dao;

    @Autowired
    private MaterialstatusRepository daostatus;


    //get next supplier bill [/material/nextm]
    @GetMapping(value = "/nextm",produces = "application/json")
    public Material nextSP(){
        String nextmaterialcode = dao.nextMaterialcode();

        Material nextm = new Material(nextmaterialcode);
        return nextm;
    }


    @GetMapping(value = "/list" , produces="application/json")
    public List<Material> materialList() {
        return dao.List();
    }



    // material list by selecting a particular material category
    //[/material/materiallistbysupplier?supplierid=]
    @GetMapping(value = "/materiallistbysupplier",params = "supplierid",produces = "application/json")
    public List<Material> materialBysupplier(@RequestParam("supplierid") Integer supplierid){
        return dao.materiallistbysupplier(supplierid);
    }

    // material list by selecting a particular quotation
    //[/material/materiallistbyquotation?quotationid=]
    @GetMapping(value = "/materiallistbyquotation",params = "quotationid",produces = "application/json")
    public List<Material> materialByQuotation(@RequestParam("quotationid") Integer quotationid){
        return dao.materiallistbyquotation(quotationid);
    }
    // material list by selecting a particular quotation
    //[/material/materiallistbyporder?porderid=]
    @GetMapping(value = "/materiallistbyporder",params = "porderid",produces = "application/json")
    public List<Material> materialByPorder(@RequestParam("porderid") Integer porderid){
        return dao.materiallistbyporder(porderid);
    }


    //data access object
    //get request mapping for Get material page request given params
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Material> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "MATERIAL");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;

    }

    //get request mapping for Get material page request given params with search value
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Material> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMER");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;
    }

    //post mapping for insert item object
    @PostMapping
    public String insert(@RequestBody Material material) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "MATERIAL");
        //check user null
        if (user != null & priv != null & priv.get("add")) {
            try {
                material.setAddeddate(LocalDate.now());
                material.setMaterialstatus_id(daostatus.getById(1));


                dao.save(material);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error saving: you have No previlage..!";

    }

    //mapping for update item object
    @PutMapping
    public String update(@RequestBody Material material) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "MATERIAL");
        //check user null
        if (user != null & priv != null & priv.get("update")) {
            try {
                dao.save(material);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed.." + ex.getMessage();
            }
        } else
            return "Error updating: you have No previlage..!";


    }


    // Delete Mapping for insert item object
    @DeleteMapping
    public String delete(@RequestBody Material material) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "MATERIAL");
        //check user null
        if (user != null & priv != null & priv.get("delete")) {
            try {
                material.setMaterialstatus_id(daostatus.getById(3));
                dao.save(material);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed.." + ex.getMessage();
            }
        } else
            return "Error deleting: you have No previlage..!";
    }
}


