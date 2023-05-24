package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.Submenucategory;
import com.gamagerestaurant.repository.SubmenucategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "submenucategory")
public class SubmenucategoryController {

    @Autowired
    private SubmenucategoryRepository dao;

    @GetMapping(value="/list",produces= "application/json")
    public List<Submenucategory> submenucategoryList(){
        return dao.findAll();
    }
}
