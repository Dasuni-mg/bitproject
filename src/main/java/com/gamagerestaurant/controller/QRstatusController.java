package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.QrStatus;
import com.gamagerestaurant.repository.QuotationRequeststatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "qrstatus")
public class QRstatusController {

    @Autowired
    private QuotationRequeststatusRepository dao;

    @GetMapping(value="/list",produces= "application/json")
    public List<QrStatus> qrStatusList(){
        return dao.findAll();
    }
}
