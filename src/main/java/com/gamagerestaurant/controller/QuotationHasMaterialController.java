package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.QuotationHasMaterial;
import com.gamagerestaurant.repository.QuotationHasMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/quotationhasmaterial")
public class QuotationHasMaterialController {

    @Autowired
    private QuotationHasMaterialRepository dao;

    // reservation list by selecting a particular service [/quotationhasmaterial/quotaionmaterial?quotationid=1&materialid=1]
    @GetMapping(value = "/quotaionmaterial",params = {"quotationid","materialid"},produces = "application/json")
    public List<QuotationHasMaterial> materialbyporder(@RequestParam("quotationid") int quotationid, @RequestParam("materialid") int materialid){
        return dao.quotationnmaterial(quotationid,materialid);
    }


}
