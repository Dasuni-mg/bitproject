package com.gamagerestaurant.controller;


import com.gamagerestaurant.model.Materialstatus;
import com.gamagerestaurant.repository.MaterialstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "materialstatus")
public class MaterialstatusController {

    @Autowired
    private MaterialstatusRepository dao;
    @GetMapping(value="/list",produces= "application/json")
    public List<Materialstatus> materialstatuslist(){
        return dao.findAll();
    }
}
