package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.Grnstatus;
import com.gamagerestaurant.repository.GrnstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "grnstatus")
public class GrnstatusController {

    @Autowired
    private GrnstatusRepository dao;

    @GetMapping(value="/list",produces= "application/json")
    public List<Grnstatus> grnstatusList(){
        return dao.findAll();
    }
}
