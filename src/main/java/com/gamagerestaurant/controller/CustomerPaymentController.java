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
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/customerpayment")
public class CustomerPaymentController {

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private UserService userService;

    //create a object and convert to a instance
    @Autowired
    private CustomerpaymentRepository dao;

    @Autowired
    private CustomerpaymentstatusRepository daostatus;

    @Autowired
    private ReservationRepository daor;

    @Autowired
    private MenuRepository daoM;

    @Autowired
    private SubmenuRepository daoSbm;

    @Autowired
    private InventorystatusRepository daoinventroy;

    @Autowired
    private MaterialInventoryRepository daomaterialinventroy;

    @Autowired
    private ReservationstatusRepository daorstatus;

    //get next supplier bill [/customerpayment/nextcp]
    @GetMapping(value = "/nextcp",produces = "application/json")
    public Customerpayment nextCP(){
        String nextbillno = dao.nextBillNo();

        Customerpayment nextcp = new Customerpayment(nextbillno);
        return nextcp;
    }


    //data access object
    //get request mapping for Get customerpayment page request given params
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Customerpayment> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMERPAYMENTS");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;

    }

    //get request mapping for Get customerpayment page request given params with search value
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Customerpayment> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMERPAYMENTS");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;
    }

    //post mapping for insert customerpayment object
    @PostMapping
    public String insert(@RequestBody Customerpayment customerpayment) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMERPAYMENTS");
        //check user null
        if (user != null & priv != null & priv.get("delete")) {
            try {

                customerpayment.setCpstatus_id(daostatus.getById(1));
                customerpayment.setEmployee_id(user.getEmployeeId());
                customerpayment.setPaiddatetime(LocalDateTime.now());
                dao.save(customerpayment);


//                Reservation reservation = daor.getById(customerpayment.getReservation_id().getId());
//
//                reservation.setReservationstatus_id(daorstatus.getById(3));
//
//                for (ReservationHasService rhs : reservation.getReservationHasServiceList()) {
//                    rhs.setReservation_id(reservation);
//
//                    if(rhs.getMenu_id() != null){
//                        Menu resmenu = daoM.getById(rhs.getMenu_id().getId());
//                        for(MenuHasSubmenu mhs  : resmenu.getMenuHasSubmenuList()){
//                            List<SubmenuHasMaterial> submenuHasMaterialList = mhs.getSubmenu_id().getSubmenuHasMaterialList();
//                            for(SubmenuHasMaterial hasMaterial :submenuHasMaterialList){
//                                Materialinventory matinventory = daomaterialinventroy.getByMaterial(hasMaterial.getId());
//
//                                if(matinventory != null){
//
//                                    matinventory.setAvaqty(matinventory.getAvaqty().subtract(hasMaterial.getQty().multiply(BigDecimal.valueOf(rhs.getOrdercount()))));
//                                    if(matinventory.getAvaqty().compareTo(BigDecimal.valueOf(0)) == 0 ){
//                                        matinventory.setInventorystatus_id(daoinventroy.getById(2));
//                                    }else {
//                                        if(matinventory.getAvaqty().compareTo(BigDecimal.valueOf(0)) == 1){
//                                            matinventory.setInventorystatus_id(daoinventroy.getById(1));
//                                        }
//                                    }
//                                    daomaterialinventroy.save(matinventory);
//                                }
//                            }
//                        }
//                    }else{
//                        Submenu ressmenu = daoSbm.getById(rhs.getMenu_id().getId());
//                        for(SubmenuHasMaterial mhs : ressmenu.getSubmenuHasMaterialList()){
//                            List<SubmenuHasMaterial> submenuHasMaterialList = mhs.getSubmenu_id().getSubmenuHasMaterialList();
//                            for(SubmenuHasMaterial hasMaterial :submenuHasMaterialList){
//                                Materialinventory matinventory = daomaterialinventroy.getByMaterial(hasMaterial.getId());
//
//                                if(matinventory != null){
//
//                                    matinventory.setAvaqty(matinventory.getAvaqty().subtract(hasMaterial.getQty().multiply(BigDecimal.valueOf(rhs.getOrdercount()))));
//                                    if(matinventory.getAvaqty().compareTo(BigDecimal.valueOf(0)) == 0 ){
//                                        matinventory.setInventorystatus_id(daoinventroy.getById(2));
//                                    }else {
//                                        if(matinventory.getAvaqty().compareTo(BigDecimal.valueOf(0)) == 1){
//                                            matinventory.setInventorystatus_id(daoinventroy.getById(1));
//                                        }
//                                    }
//                                    daomaterialinventroy.save(matinventory);
//                                }
//                            }
//                        }
//                    }
//                }
//
//                daor.save(reservation);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed.." + ex.getMessage();
            }
        } else
            return "Error deleting: you have No previlage..!";

    }

    //mapping for update item object
    @PutMapping
    public String update(@RequestBody Customerpayment customerpayment) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMERPAYMENTS");
        //check user null
        if (user != null & priv != null & priv.get("delete")) {
            try {

                dao.save(customerpayment);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed.." + ex.getMessage();
            }
        } else
            return "Error deleting: you have No previlage..!";

    }


    // Delete Mapping for insert item object
    @DeleteMapping
    public String delete(@RequestBody Customerpayment customerpayment) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMERPAYMENTS");
        //check user null
        if (user != null & priv != null & priv.get("delete")) {
            try {
                customerpayment.setCpstatus_id(daostatus.getById(3));
                dao.save(customerpayment);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed.." + ex.getMessage();
            }
        } else
            return "Error deleting: you have No previlage..!";
    }


}


