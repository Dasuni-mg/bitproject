package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.Dailyusagestatus;
import com.gamagerestaurant.model.Quotationstatus;
import com.gamagerestaurant.repository.DailyusagestatusRepository;
import com.gamagerestaurant.repository.QuotationstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "dailyusage")
public class DailyusagestatusController {

    @Autowired
    private DailyusagestatusRepository dao;

    @GetMapping(value="/list",produces= "application/json")
    public List<Dailyusagestatus> dailyusagestatusList(){
        return dao.findAll();
    }
}
