package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.PurchaseorderHasMaterial;
import com.gamagerestaurant.repository.PurchaseorderHasMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/purchaseorderhasmaterial")
public class PurchaseorderHasMaterialController {

    @Autowired
    private PurchaseorderHasMaterialRepository dao;


    // quotation list by  particular supplier
    //[/purchaseorderhasmaterial/purchaseorderlistbymaterial?porderid=]


    // reservation list by selecting a particular service [/purchaseorderhasmaterial/purchaseorderbymaterial?porderid=1&materialid=1]
    @GetMapping(value = "/purchaseorderbymaterial",params = {"porderid","materialid"},produces = "application/json")
    public PurchaseorderHasMaterial materialbyporder(@RequestParam("porderid") int porderid, @RequestParam("materialid") int materialid){
        return dao.purchaseorderbymaterial(porderid,materialid);
    }

}
