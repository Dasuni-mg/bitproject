package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.Dailyremovestatus;
import com.gamagerestaurant.repository.DailyRemovestatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "dailyremovestatus")
public class DailyRemovestatusController {

    @Autowired
    private DailyRemovestatusRepository dao;

    @GetMapping(value="/list",produces= "application/json")
    public List<Dailyremovestatus> dailyremovestatusList(){
        return dao.findAll();
    }
}
