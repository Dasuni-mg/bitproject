package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.ReservationHasService;
import com.gamagerestaurant.repository.ReservationHasServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/reservationhasservice")
public class ReservationHasServiceController {

    @Autowired
    private ReservationHasServiceRepository dao;

    @GetMapping(value="/list",produces= "application/json")
    public List<ReservationHasService> reservationHasServiceList(){
        return dao.findAll();
    }


}
