package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.Menucategory;
import com.gamagerestaurant.repository.MenucategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "menucategory")
public class MenucategoryController {

    @Autowired
    private MenucategoryRepository dao;

    @GetMapping(value="/list",produces= "application/json")
    public List<Menucategory> menucategoryList(){
        return dao.findAll();
    }
}
