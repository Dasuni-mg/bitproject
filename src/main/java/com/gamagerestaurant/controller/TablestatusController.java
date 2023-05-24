package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.Tablestatus;
import com.gamagerestaurant.repository.TablestatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "tablestatus")
public class TablestatusController {

    @Autowired
    private TablestatusRepository dao;

    @GetMapping(value="/list",produces= "application/json")
    public List<Tablestatus> tablestatusList(){
        return dao.findAll();
    }
}
