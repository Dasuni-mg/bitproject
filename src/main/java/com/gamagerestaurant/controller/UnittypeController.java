package com.gamagerestaurant.controller;


import com.gamagerestaurant.model.Material;
import com.gamagerestaurant.model.Unittype;
import com.gamagerestaurant.model.User;
import com.gamagerestaurant.repository.UnittypeRepository;
import com.gamagerestaurant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "unittype")
public class UnittypeController {

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private UserService userService;

    @Autowired
    private UnittypeRepository dao;

    @GetMapping(value="/list",produces= "application/json")
    public List<Unittype> unittypelist(){
        return dao.findAll();
    }

    //post mapping for insert item object
    @PostMapping
    public String insert(@RequestBody Unittype unittype) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "UNITTYPE");
        //check user null
        if (user != null & priv != null & priv.get("add")) {
            try {


                dao.save(unittype);

                System.out.println(unittypelist());
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error saving: you have No previlage..!";

    }

}