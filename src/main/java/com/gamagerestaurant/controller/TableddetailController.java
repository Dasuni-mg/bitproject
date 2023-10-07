package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.Tabledetail;
import com.gamagerestaurant.repository.TableddetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/tabledetail")
public class TableddetailController {

    @Autowired
    private TableddetailRepository dao;

    ///tabledetail/list
    @GetMapping(value="/list",produces= "application/json")
    public List<Tabledetail> tabledetailList(){
        return dao.detailsbystatus();
    }
}
