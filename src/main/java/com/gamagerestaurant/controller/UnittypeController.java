package com.gamagerestaurant.controller;


import com.gamagerestaurant.model.Unittype;
import com.gamagerestaurant.repository.UnittypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "unittype")
public class UnittypeController {

    @Autowired
    private UnittypeRepository dao;
    @GetMapping(value="/list",produces= "application/json")
    public List<Unittype> unittypelist(){
        return dao.findAll();
    }
}