package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.Removereason;
import com.gamagerestaurant.repository.RemovereasonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "removereason")
public class RemoveReasonController {

    @Autowired
    private RemovereasonRepository dao;

    @GetMapping(value="/list",produces= "application/json")
    public List<Removereason> removereasonList(){
        return dao.findAll();
    }
}
