package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.Submenustatus;
import com.gamagerestaurant.repository.SubmenustatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "submenustatus")
public class SubmenustatusController {

    @Autowired
    private SubmenustatusRepository dao;

    @GetMapping(value="/list",produces= "application/json")
    public List<Submenustatus> submenustatusList(){
        return dao.findAll();
    }
}
