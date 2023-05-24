package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.Supplierstatus;
import com.gamagerestaurant.repository.SupplierstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value="supplierstatus")
public class SupplierStatusController {
    @Autowired
    private SupplierstatusRepository dao;

    //[/supplierstatus/list]
    @GetMapping(value="/list", produces= "application/json")
    public List<Supplierstatus> supplierstatusList(){
        return dao.findAll();
    }
}
