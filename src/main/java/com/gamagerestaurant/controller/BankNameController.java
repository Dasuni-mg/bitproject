package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.BankName;
import com.gamagerestaurant.model.Supplierstatus;
import com.gamagerestaurant.repository.BankNameRepository;
import com.gamagerestaurant.repository.SupplierstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value="bankname")
public class BankNameController {
    @Autowired
    private BankNameRepository dao;

    //[/bankname/list]
    @GetMapping(value="/list", produces= "application/json")
    public List<BankName> banknameList(){
        return dao.findAll();
    }
}
