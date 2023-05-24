package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.Purchaseorderstatus;
import com.gamagerestaurant.repository.PurchaseorderstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "porderstatus")
public class PurchaseorderstatusController {

    @Autowired
    private PurchaseorderstatusRepository dao;

    @GetMapping(value="/list",produces= "application/json")
    public List<Purchaseorderstatus> purchaseorderstatusList(){
        return dao.findAll();
    }
}
