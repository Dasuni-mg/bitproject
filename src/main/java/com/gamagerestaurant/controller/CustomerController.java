package com.gamagerestaurant.controller;


import com.gamagerestaurant.model.Customer;
import com.gamagerestaurant.model.User;
import com.gamagerestaurant.repository.CustomerRepository;
import com.gamagerestaurant.repository.CustomerstatusRepository;
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
@RequestMapping(value = "/customer")

//request services of customer
public class CustomerController {

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private UserService userService;
    @Autowired
    //create a object and convert to a instance
    private CustomerRepository dao;

    @Autowired
    private CustomerstatusRepository daostatus;


    @GetMapping(value = "/list",produces = "application/json")
    public List<Customer> customerList(){
        return dao.list();
    }


    //get next customer reg no [/customer/nextcu]
    @GetMapping(value = "/nextcu",produces = "application/json")
    public Customer nextRegNo(){
        String nextregno = dao.nextRegNo();

        Customer nextcu = new Customer(nextregno);
        return nextcu;
    }

    //data access object
    //get request mapping for Get customer page request given params
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Customer> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMER");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;

    }

    //get request mapping for Get customer page request given params with search value
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Customer> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
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
    public String insert(@RequestBody Customer customer) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMER");
        //check user null
        if (user != null & priv != null & priv.get("add")) {
            try {
                customer.setAddeddate(LocalDate.now());
                customer.setCustomerstatus_id(daostatus.getById(1));
                customer.setEmployee_id(user.getEmployeeId());
                dao.save(customer);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error saving: you have No previlage..!";

    }

    //mapping for update item object
    @PutMapping
    public String update(@RequestBody Customer customer) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMER");
        //check user null
        if (user != null & priv != null & priv.get("update")) {
            try {
                dao.save(customer);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed.." + ex.getMessage();
            }
        } else
            return "Error updating: you have No previlage..!";


    }


    // Delete Mapping for delete item object
    @DeleteMapping
    public String delete(@RequestBody Customer customer) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMER");
        //check user null
        if (user != null & priv != null & priv.get("delete")) {
            try {
                customer.setCustomerstatus_id(daostatus.getById(2));
                dao.save(customer);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed.." + ex.getMessage();
            }
        } else
            return "Error deleting: you have No previlage..!";
    }
}


