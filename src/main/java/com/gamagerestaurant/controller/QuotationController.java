package com.gamagerestaurant.controller;


import com.gamagerestaurant.model.Quotation;
import com.gamagerestaurant.model.QuotationHasMaterial;
import com.gamagerestaurant.model.QuotationRequest;
import com.gamagerestaurant.model.User;
import com.gamagerestaurant.repository.QuotationRepository;
import com.gamagerestaurant.repository.QuotationRequestRepository;
import com.gamagerestaurant.repository.QuotationRequeststatusRepository;
import com.gamagerestaurant.repository.QuotationstatusRepository;
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
@RequestMapping(value = "/quotation")
public class QuotationController {

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private UserService userService;
    @Autowired
    //create a object and convert to a instance
    private QuotationRepository dao;

    @Autowired
    private QuotationstatusRepository daostatus;

    @Autowired
    //create a object and convert to a instance
    private QuotationRequestRepository daoqr;

    @Autowired
    private QuotationRequeststatusRepository daoqrstatus;

    //get next Quotation code [/quotation/nextqt]
    @GetMapping(value = "/nextqt",produces = "application/json")
    public Quotation nextQC(){
        String nextqcode = dao.nextQCode();

        Quotation nextqt = new Quotation(nextqcode);
        return nextqt;
    }

    @GetMapping(value = "list",produces = "application/json")
    public List<Quotation> quotationList(){
        return dao.list();
    }


    // quotation list by  particular supplier
    //[/quotation/quotationlistbysupplier?supplierid=]

    @GetMapping(value = "/quotationlistbysupplier",produces = "application/json")
    public List<Quotation> reservationByservice(@RequestParam("supplierid") Integer supplierid){
        return dao.quotationlistbysupplier(supplierid);
    }

    //data access object
    //get request mapping for Get quotation page request given params
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Quotation> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATION");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;

    }

    //get request mapping for Get quotation page request given params with search value
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Quotation> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATION");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;
    }


    //post mapping for insert quotation object
    @PostMapping
    public String insert(@RequestBody Quotation quotation) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATION");
        //check user null
        if (priv != null & priv.get("add")) {
            try {
                quotation.setQuotationcode(dao.nextQCode());
                quotation.setAddeddate(LocalDate.now());
                quotation.setQuotationstatus_id(daostatus.getById(1));
                quotation.setEmployee_id(user.getEmployeeId());

                System.out.println(quotation);
                for(QuotationHasMaterial shi : quotation.getQuotationHasMaterialList()){
                    shi.setQuotation_id(quotation);
                }
                dao.save(quotation);

                QuotationRequest quotationrequest = daoqr.getById(quotation.getQuotationrequest_id().getId());

                quotationrequest.setQrstatus_id(daoqrstatus.getById(2));

                daoqr.save(quotationrequest);

                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error saving: you have No previlage..!";

    }

    //mapping for update quotation object
    @PutMapping
    public String update(@RequestBody  Quotation quotation) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATION");
        //check user null
        if (user != null & priv != null & priv.get("update")) {
            try {
                System.out.println(quotation);
                for(QuotationHasMaterial shi : quotation.getQuotationHasMaterialList()){
                    shi.setQuotation_id(quotation);
                }
                dao.save(quotation);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed.." + ex.getMessage();
            }
        } else
            return "Error updating: you have No previlage..!";


    }


    // Delete Mapping for insert item object
    @DeleteMapping
    public String delete(@RequestBody  Quotation quotation) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "Quotation");
        //check user null
        if (user != null & priv != null & priv.get("delete")) {
            try {

                System.out.println(quotation);
                for(QuotationHasMaterial shi : quotation.getQuotationHasMaterialList()){
                    shi.setQuotation_id(quotation);
                }
                quotation.setQuotationstatus_id(daostatus.getById(3));

                for(QuotationHasMaterial shi: quotation.getQuotationHasMaterialList())
                    shi.setQuotation_id(quotation);

                dao.save(quotation);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed.." + ex.getMessage();
            }
        } else
            return "Error deleting: you have No previlage..!";
    }


}


