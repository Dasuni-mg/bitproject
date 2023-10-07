package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.BankBranch;
import com.gamagerestaurant.model.Supplierstatus;
import com.gamagerestaurant.repository.BankBranchRepository;
import com.gamagerestaurant.repository.SupplierstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value="bankbranch")
public class BankBranchController {
    @Autowired
    private BankBranchRepository dao;

    //[/bankbranch/list]
    @GetMapping(value="/list", produces= "application/json")
    public List<BankBranch> bankbranchList(){
        return dao.findAll();
    }
}
