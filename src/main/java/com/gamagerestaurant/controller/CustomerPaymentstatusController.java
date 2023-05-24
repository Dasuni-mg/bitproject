package com.gamagerestaurant.controller;


import com.gamagerestaurant.model.CPstatus;
import com.gamagerestaurant.repository.CustomerpaymentstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "cpstatus")
public class CustomerPaymentstatusController {

    @Autowired
    private CustomerpaymentstatusRepository dao;
    @GetMapping(value="/list",produces= "application/json")
    public List<CPstatus> CpmethodList(){
        return dao.findAll();
    }
}
