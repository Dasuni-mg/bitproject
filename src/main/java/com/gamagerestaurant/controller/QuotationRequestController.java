package com.gamagerestaurant.controller;


import com.gamagerestaurant.model.QuotationRequest;
import com.gamagerestaurant.model.User;
import com.gamagerestaurant.repository.QuotationRequestRepository;
import com.gamagerestaurant.repository.QuotationRequeststatusRepository;
import com.gamagerestaurant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/quotationrequest")
//request services of QuotationRequest
public class QuotationRequestController {

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private UserService userService;
    @Autowired
    //create a object and convert to a instance
    private QuotationRequestRepository dao;

    @Autowired
    private QuotationRequeststatusRepository daostatus;


    //get next QR Code [/quotationrequest/nextqr]
    @GetMapping(value = "/nextqr",produces = "application/json")
    public QuotationRequest nextQR(){
        String nextqrcode = dao.nextQRCode();

        QuotationRequest nextqr = new QuotationRequest(nextqrcode);
        return nextqr;
    }

    @GetMapping(value = "/list",produces = "application/json")
    public List<QuotationRequest> quotationRequestList(){

        return dao.list();
    }

    //Quotation Module-when select supplier auto select quotation requests related to that supplier
    //[/quotationrequest/listbysupplier?supplierid=]
    @GetMapping(value = "/listbysupplier",params ={"supplierid"},produces = "application/json")
    public List<QuotationRequest> qrequestlistBySupplier(@RequestParam("supplierid") int supplierid) {
        return dao.listBySupplier(supplierid);
    }

    //data access object
    //get request mapping for Get QuotationRequest page request given params
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<QuotationRequest> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATIONREQUEST");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;

    }

    //get request mapping for Get QuotationRequest page request given params with search value
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<QuotationRequest> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATIONREQUEST");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;
    }

    //post mapping for insert item object
    @PostMapping
    public String insert(@RequestBody QuotationRequest quotationrequest) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATIONREQUEST");
        //check user null
        if (user != null & priv != null & priv.get("add")) {
            try {
                quotationrequest.setAddeddate(LocalDate.now());
                quotationrequest.setQrstatus_id(daostatus.getById(1));
                dao.save(quotationrequest);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error saving: you have No previlage..!";

    }

    //mapping for update QuotationRequest object
    @PutMapping
    public String update(@RequestBody QuotationRequest quotationrequest) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATIONREQUEST");
        //check user null
        if (user != null & priv != null & priv.get("update")) {
            try {
                dao.save(quotationrequest);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed.." + ex.getMessage();
            }
        } else
            return "Error updating: you have No previlage..!";


    }


    // Delete Mapping for insert item object
    @DeleteMapping
    public String delete(@RequestBody QuotationRequest quotationrequest) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATIONREQUEST");
        //check user null
        if (user != null & priv != null & priv.get("delete")) {
            try {
                quotationrequest.setQrstatus_id(daostatus.getById(3));
                dao.save(quotationrequest);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed.." + ex.getMessage();
            }
        } else
            return "Error deleting: you have No previlage..!";
    }
}


