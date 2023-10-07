package com.gamagerestaurant.controller;


import com.gamagerestaurant.model.SubmenuHasMaterial;
import com.gamagerestaurant.repository.SubmenuhasMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/submenuhasmaterial")
public class SubmenuhasmaterialController {

    @Autowired
    private SubmenuhasMaterialRepository dao;


    //submenuhasmaterial/getqty?menuid=1
    @GetMapping(value = "/getqty",params = {"menuid"},produces = "application/json")
    public SubmenuHasMaterial submenuHasMaterial(@RequestParam("menuid") int menuid){
        return dao.getQty(menuid);
    }
}
