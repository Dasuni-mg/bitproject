package com.gamagerestaurant.controller;


import com.gamagerestaurant.model.*;
import com.gamagerestaurant.repository.*;
import com.gamagerestaurant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/grn")
public class GrnController {

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private UserService userService;
    @Autowired
    //create a object and convert to a instance
    private GrnRepository dao;

    @Autowired
    private GrnstatusRepository daostatus;

    @Autowired
    //create a object and convert to a instance
    private PurchaseorderRepository daopo;

    @Autowired
    private PurchaseorderstatusRepository daopostatus;

    @Autowired
    private MaterialRepository daomaterial;


    @Autowired
    private InventorystatusRepository daoinventroy;

    @Autowired
    private MaterialInventoryRepository daomaterialinventroy;

    @Autowired
    private GrnstatusRepository daogstatus;


    @GetMapping(value = "list",produces = "application/json")
    public List<Grn> grnList(){
        return dao.list();
    }


    //get next supplier grncode [/grn/nextgrn]
    @GetMapping(value = "/nextgrn",produces = "application/json")
    public Grn nextSP(){
        String nextgrnCode = dao.nextGRNCode();

        Grn nextgrn = new Grn(nextgrnCode);
        return nextgrn;
    }

    //data access object
    //get request mapping for Get porder page request given params
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Grn> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "GRN");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;

    }

    //get request mapping for Get porder page request given params with search value
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Grn> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "GRN");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;
    }

    //post mapping for insert porder object
    @PostMapping
    public String insert(@RequestBody Grn grn) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "GRN");
        //check user null
        if (priv != null & priv.get("add")) {
            try {
                grn.setAddeddate(LocalDate.now());
                grn.setGrnstatus_id(daostatus.getById(1));
                grn.setEmployee_id(user.getEmployeeId());
                System.out.println(grn);
                for(GrnHasMaterial shi : grn.getGrnHasMaterialList()){
                    shi.setGrn_id(grn);
                }
                dao.save(grn);

                // need to update material inventory when grn receied
                for(GrnHasMaterial shi : grn.getGrnHasMaterialList()){
                    Material material = daomaterial.getById(shi.getMaterial_id().getId());
                    Materialinventory matinventory = daomaterialinventroy.getByMaterial(material.getId());

                    if(matinventory != null){

                        matinventory.setAvaqty(matinventory.getAvaqty().add(shi.getQty()));
                        matinventory.setTotalqty(matinventory.getTotalqty().add(shi.getQty()));

                        if(matinventory.getAvaqty().compareTo(BigDecimal.valueOf(0)) == 0 ){
                            matinventory.setInventorystatus_id(daoinventroy.getById(2));
                        }else {
                            if(matinventory.getAvaqty().compareTo(BigDecimal.valueOf(0)) == 1){
                                matinventory.setInventorystatus_id(daoinventroy.getById(1));
                            }
                        }
                        daomaterialinventroy.save(matinventory);
                    }else{
                        Materialinventory newmatinventory = new Materialinventory();
                        newmatinventory.setInventorystatus_id(daoinventroy.getById(1));
                        newmatinventory.setTotalqty(shi.getQty());
                        newmatinventory.setAvaqty(shi.getQty());
                        newmatinventory.setRemoveqty(BigDecimal.valueOf(0));
                        newmatinventory.setMaterial_id(material);
                        daomaterialinventroy.save(newmatinventory);
                    }
                }


                //change the  porder stATUS WHEN RECEIVED THE grn
                Purchaseorder purchaseorder = daopo.getById(grn.getPorder_id().getId());
                purchaseorder.setPorderstatus_id(daopostatus.getById(5));
                for(PurchaseorderHasMaterial shi : purchaseorder.getPurchaseorderHasMaterialList()){
                    shi.setPorder_id(purchaseorder);
                }
                daopo.save(purchaseorder);

                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error saving: you have No previlage..!";

    }

    //mapping for update porder object
    @PutMapping
    public String update(@RequestBody  Grn grn) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "GRN");
        //check user null
        if (user != null & priv != null & priv.get("update")) {
            try {
                System.out.println(grn);
                for(GrnHasMaterial shi : grn.getGrnHasMaterialList()){
                    shi.setGrn_id(grn);
                }
                dao.save(grn);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error updating: you have No previlage..!";


    }


    // Delete Mapping for insert grn object
    @DeleteMapping
    public String delete(@RequestBody Grn grn) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "GRN");
        //check user null
        if (user != null & priv != null & priv.get("delete")) {

            try {
                grn.setGrnstatus_id(daostatus.getById(3));
                for(GrnHasMaterial shi : grn.getGrnHasMaterialList()){
                    shi.setGrn_id(grn);
                }
                dao.save(grn);


                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed.." + ex.getMessage();
            }
        } else
            return "Error deleting: you have No previlage..!";
    }






}


