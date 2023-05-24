package com.gamagerestaurant.controller;


import com.gamagerestaurant.model.Cpmethod;
import com.gamagerestaurant.repository.CustomerPaymentmethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/cpmethod")
public class CustomerPaymentmethodController {

    @Autowired
    private CustomerPaymentmethodRepository dao;



    @GetMapping(value="/list",produces= "application/json")
    public List<Cpmethod> cPstatusList(){
        return dao.findAll();
    }


    //cpmethod/listbymethod
    @GetMapping(value = "/listbymethod", produces = "application/json")
    public List<Cpmethod> cpmethods(){
        return dao.getBymethod();
    }



}
