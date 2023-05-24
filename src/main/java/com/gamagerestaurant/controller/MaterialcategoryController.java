package com.gamagerestaurant.controller;


import com.gamagerestaurant.model.Materialcategory;
import com.gamagerestaurant.repository.MaterialcategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "materialcategory")
public class MaterialcategoryController {

    @Autowired
    private MaterialcategoryRepository dao;
    @GetMapping(value="/list",produces= "application/json")
    public List<Materialcategory> materialcategorylist(){
        return dao.findAll();
    }
}

