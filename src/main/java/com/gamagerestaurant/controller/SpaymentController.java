package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.*;
import com.gamagerestaurant.repository.GrnRepository;
import com.gamagerestaurant.repository.GrnstatusRepository;
import com.gamagerestaurant.repository.PaymentstatusRepository;
import com.gamagerestaurant.repository.SpaymentRepository;
import com.gamagerestaurant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping(value = "/spayment")
public class SpaymentController {

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private UserService userService;

    //create a object and convert to a instance
    @Autowired
    private SpaymentRepository dao;

    @Autowired
    private PaymentstatusRepository daostatus;


    //cross validaion-when grn status change after spayment has done
    @Autowired
    private GrnRepository daogrn;

    @Autowired
    private GrnstatusRepository daogrnstatus;

    //get next supplier bill [/spayment/nextsp]
    @GetMapping(value = "/nextsp", produces = "application/json")
    public Spayment nextSP() {
        String nextbillno = dao.nextBillNo();

        Spayment nextsp = new Spayment(nextbillno);
        return nextsp;
    }


    //data access object
    //get request mapping for Get spayment page request given params
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Spayment> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SPAYMENT");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;

    }

    //get request mapping for Get spayment page request given params with search value
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Spayment> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SPAYMENT");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;
    }

    //post mapping for insert spayment object
    @PostMapping
    public String insert(@RequestBody Spayment spayment) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SPAYMENT");
        //check user null
        if (user != null & priv != null & priv.get("delete")) {
            try {

                dao.save(spayment);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed.." + ex.getMessage();
            }
        } else
            return "Error deleting: you have No previlage..!";

    }

    //mapping for update item object
    @PutMapping
    public String update(@RequestBody Spayment spayment) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SPAYMENT");
        //check user null
        if (user != null & priv != null & priv.get("delete")) {
            try {
                dao.save(spayment);


                //cross validaion-when grn status change after spayment has done
                Grn grn = daogrn.getById(spayment.getGrn_id().getId());

                grn.setGrnstatus_id(daogrnstatus.getById(2));
                for (GrnHasMaterial shi : grn.getGrnHasMaterialList()) {
                    shi.setGrn_id(grn);
                }
                daogrn.save(grn);


                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed.." + ex.getMessage();
            }
        } else
            return "Error deleting: you have No previlage..!";

    }


    // Delete Mapping for insert item object
    @DeleteMapping
    public String delete(@RequestBody Spayment spayment) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SPAYMENT");
        //check user null
        if (user != null & priv != null & priv.get("delete")) {
            try {
                spayment.setPaymentstatus_id(daostatus.getById(3));
                dao.save(spayment);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed.." + ex.getMessage();
            }
        } else
            return "Error deleting: you have No previlage..!";
    }
}


