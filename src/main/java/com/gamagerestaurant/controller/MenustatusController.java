package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.Menustatus;
import com.gamagerestaurant.repository.MenustatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "menustatus")
public class MenustatusController {

    @Autowired
    private MenustatusRepository dao;

    @GetMapping(value="/list",produces= "application/json")
    public List<Menustatus> menustatusList(){
        return dao.findAll();
    }
}
