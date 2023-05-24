package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.Reservationstatus;
import com.gamagerestaurant.repository.ReservationstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/resrvationstatus")
public class ReservationStatusController {

    @Autowired
    private ReservationstatusRepository dao;

    @GetMapping(value="/list",produces= "application/json")
    public List<Reservationstatus> reservationstatusList(){
        return dao.findAll();
    }
}
