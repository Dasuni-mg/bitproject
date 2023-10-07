package com.gamagerestaurant.controller;


import com.gamagerestaurant.model.Supplier;
import com.gamagerestaurant.model.Supplierhasmaterial;
import com.gamagerestaurant.model.User;
import com.gamagerestaurant.repository.SupplierRepository;
import com.gamagerestaurant.repository.SupplierstatusRepository;
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
@RequestMapping(value = "/supplier")
public class SupplierController {

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private UserService userService;
    @Autowired
    //create a object and convert to a instance
    private SupplierRepository dao;

    @Autowired
    private SupplierstatusRepository daostatus;

    @GetMapping(value = "/list",produces = "application/json")
    public List<Supplier> supplierList(){
        return dao.list();
    }

    //get next customer reg no [/customer/nextcu]
    @GetMapping(value = "/nextsup",produces = "application/json")
    public Supplier nextRegNo(){
        String nextregno = dao.nextRegNo();

        Supplier nextsup = new Supplier(nextregno);
        return nextsup;
    }

    //data access object
    //get request mapping for Get supplier page request given params
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Supplier> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIER");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;

    }

    //get request mapping for Get supplier page request given params with search value
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Supplier> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIER");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;
    }

    //post mapping for insert supplier object
    @PostMapping
    public String insert(@RequestBody Supplier supplier) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIER");
        //check user null
        if (priv != null & priv.get("add")) {
            try {
                System.out.println(supplier);
                supplier.setAddeddate(LocalDate.now());
                supplier.setSupplierstatus_id(daostatus.getById(1));
                supplier.setEmployee_id(user.getEmployeeId());
                supplier.setRegno(dao.nextRegNo());

                for(Supplierhasmaterial shi : supplier.getSupplierhasmaterialList()){
                    shi.setSupplier_id(supplier);
                }
                dao.save(supplier);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error saving: you have No previlage..!";

    }

    //mapping for update item object
    @PutMapping
    public String update(@RequestBody  Supplier supplier) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIER");
        //check user null
        if (user != null & priv != null & priv.get("update")) {
            try {

                for(Supplierhasmaterial shi : supplier.getSupplierhasmaterialList()){
                    shi.setSupplier_id(supplier);
                }
                dao.save(supplier);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed.." + ex.getMessage();
            }
        } else
            return "Error updating: you have No previlage..!";


    }


    // Delete Mapping for insert item object
    @DeleteMapping
    public String delete(@RequestBody  Supplier supplier) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIER");
        //check user null
        if (user != null & priv != null & priv.get("delete")) {
            try {
                supplier.setSupplierstatus_id(daostatus.getById(2));

                for(Supplierhasmaterial shi: supplier.getSupplierhasmaterialList())
                    shi.setSupplier_id(supplier);

                dao.save(supplier);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed.." + ex.getMessage();
            }
        } else
            return "Error deleting: you have No previlage..!";
    }
}


