package com.gamagerestaurant.controller;


import com.gamagerestaurant.model.Purchaseorder;
import com.gamagerestaurant.model.PurchaseorderHasMaterial;
import com.gamagerestaurant.model.User;
import com.gamagerestaurant.repository.PurchaseorderRepository;
import com.gamagerestaurant.repository.PurchaseorderstatusRepository;
import com.gamagerestaurant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/purchaseorder")
public class PurchaseorderController {

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private UserService userService;
    @Autowired
    //create a object and convert to a instance
    private PurchaseorderRepository dao;

    @Autowired
    private PurchaseorderstatusRepository daostatus;
    // get mapping for get porder list [/purchaseorder/list]

    @GetMapping(value = "list",produces = "application/json")
    public List<Purchaseorder> purchaseorderList(){
        return dao.list();
    }

    //[/purchaseorder/porderlistbysupplier?supplierid=]
    // pordercode filtered by supplier
    @GetMapping(value = "/porderlistbysupplier",produces = "application/json")
    public List<Purchaseorder> porderByservice(@RequestParam("supplierid") Integer supplierid){
        return dao.porderlistbysupplier(supplierid);
    }

    //get next porder code [/purchaseorder/nextpo]
    @GetMapping(value = "/nextpo",produces = "application/json")
    public Purchaseorder  nextPordercode(){
        String nextpordercode = dao.nextPordercode();

        Purchaseorder nextpo = new Purchaseorder(nextpordercode);
        return nextpo;
    }

    //data access object
    //get request mapping for Get porder page request given params
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Purchaseorder> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PORDER");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;

    }

    //get request mapping for Get porder page request given params with search value
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Purchaseorder> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PORDER");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;
    }

    //post mapping for insert porder object
    @PostMapping
    public String insert(@RequestBody Purchaseorder purchaseorder) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PORDER");
        //check user null
        if (priv != null & priv.get("add")) {
            try {
                System.out.println(purchaseorder);
                for(PurchaseorderHasMaterial shi : purchaseorder.getPurchaseorderHasMaterialList()){
                    shi.setPorder_id(purchaseorder);
                }
                dao.save(purchaseorder);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error saving: you have No previlage..!";

    }

    //mapping for update porder object
    @PutMapping
    public String update(@RequestBody  Purchaseorder purchaseorder) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PORDER");
        //check user null
        if (user != null & priv != null & priv.get("update")) {
            try {
                System.out.println(purchaseorder);
                for(PurchaseorderHasMaterial shi : purchaseorder.getPurchaseorderHasMaterialList()){
                    shi.setPorder_id(purchaseorder);
                }
                dao.save(purchaseorder);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error updating: you have No previlage..!";


    }


    // Delete Mapping for insert porder object
    @DeleteMapping
    public String delete(@RequestBody  Purchaseorder purchaseorder) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PORDER");
        //check user null
        if (user != null & priv != null & priv.get("delete")) {
            try {

                purchaseorder.setPorderstatus_id(daostatus.getById(3));
                for(PurchaseorderHasMaterial shi : purchaseorder.getPurchaseorderHasMaterialList()){
                    shi.setPorder_id(purchaseorder);
                }
                dao.save(purchaseorder);



                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error deleting: you have No previlage..!";
    }



}


