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

import javax.transaction.Transactional;
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

    @Autowired
    private DailyUsageReopistory daodaily;

    @Autowired
    private DailyusagestatusRepository daodailyusagestatus;

    //get next supplier bill [/customerpayment/nextcp]
    @GetMapping(value = "/nextcp", produces = "application/json")
    public Customerpayment nextCP() {
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
    @Transactional
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


                customerpayment.setBillno(dao.nextBillNo());
                customerpayment.setCpstatus_id(daostatus.getById(1));
                customerpayment.setEmployee_id(user.getEmployeeId());
                customerpayment.setPaiddatetime(LocalDateTime.now());


                dao.save(customerpayment);

                // get the reservation id for relevant customer payment
                // reservation repository eken reservation reservation obect ekak genna gannawa id ekata adalawa
                //customerpayment eke reservation id eken
                Reservation reservation = daor.getById(customerpayment.getReservation_id().getId());
//                System.out.println(reservation);


                if(reservation.getDeliveryaddress() != null && !(customerpayment.getRemainningamount()).equals(BigDecimal.valueOf(0.00))){
                    reservation.setReservationstatus_id(daorstatus.getById(1));
                }

                if(reservation.getDeliveryaddress() != null && (customerpayment.getRemainningamount()).equals(BigDecimal.valueOf(0.00))){
                    reservation.setReservationstatus_id(daorstatus.getById(2));
                }

                // DELEVERY -WITH ADVANCE
                //advance amount pay customers-set status as completed after completed delivery ressrvation by doing payment in cpayment
                if (reservation.getDeliveryaddress() != null && !(customerpayment.getCurrentamount()).equals(BigDecimal.valueOf(0.00)) ) {
                    reservation.setReservationstatus_id(daorstatus.getById(1));

                }

//                System.out.println("CUSB "+customerpayment.getCurrentamount());

//                //DELEVERY - WITHOUT ADVANVCE
//                //set status as completed after completed delivery ressrvation by doing payment in delevery form itself
//                if (reservation.getDeliveryaddress() != null && (customerpayment.getCurrentamount().equals(BigDecimal.valueOf(0)))) {
//                    reservation.setReservationstatus_id(daorstatus.getById(2));
//
//                }

                //TAKE AWAY
//                //set status as completed after completed take away ressrvation
//                 if (reservation.getDeliveryaddress() == null && reservation.getReceiveddate() == null) {
//                    reservation.setReservationstatus_id(daorstatus.getById(2));
//
//                }

                //DINE - IN
                //set status as completed after completed dine in reservation
                if (reservation.getReceiveddate() != null) {
                    reservation.setReservationstatus_id(daorstatus.getById(4));

                }


                //RESERVATION HAS SERVICE
                //set the rervation has services list
                for (ReservationHasService rhs : reservation.getReservationHasServiceList()) {
                    rhs.setReservation_id(reservation);

                    //if the menu list has
                    if (rhs.getMenu_id() != null) {

                        //reservationhasservice ekee thiyena menu list eka gnnwa
                        Menu resmenu = daoM.getById(rhs.getMenu_id().getId());

                        //menu ekee thiyen sub mennu list eka gnnwa
                        for (MenuHasSubmenu mhs : resmenu.getMenuHasSubmenuList()) {

                            //sub menu ekta adaalawa thiyena material list eka gnnwa
                            List<SubmenuHasMaterial> submenuHasMaterialList = mhs.getSubmenu_id().getSubmenuHasMaterialList();
                            for (SubmenuHasMaterial hasMaterial : submenuHasMaterialList) {
                                //ee material tika inventory ekee thiyana list eka gnnwa
                                Materialinventory matinventory = daomaterialinventroy.getByMaterial(hasMaterial.getMaterial_id().getId());

                                //ehema thiynawa nm
                                if (matinventory != null) {

                                    if (matinventory.getAvaqty().compareTo(hasMaterial.getQty().multiply(BigDecimal.valueOf(rhs.getOrdercount()))) > 0) {

                                        matinventory.setAvaqty(matinventory.getAvaqty().subtract(hasMaterial.getQty().multiply(BigDecimal.valueOf(rhs.getOrdercount()))));
                                        if (matinventory.getAvaqty().compareTo(BigDecimal.valueOf(0)) == 0) {
                                            matinventory.setInventorystatus_id(daoinventroy.getById(2)); //not available
                                        } else {
                                            if (matinventory.getAvaqty().compareTo(BigDecimal.valueOf(0)) == 1) {
                                                matinventory.setInventorystatus_id(daoinventroy.getById(1));
                                            }
                                        }

                                        DailyUsage dailyusage = new DailyUsage();

//                                        DailyUsage dailyusage = daodaily.getByMaterial(hasMaterial.getMaterial_id().getId());

                                        dailyusage.setMaterial_id(hasMaterial.getMaterial_id());
                                        dailyusage.setUsageqty(hasMaterial.getQty().multiply((BigDecimal.valueOf(rhs.getOrdercount()))));
                                        dailyusage.setReservation_id(rhs.getReservation_id());
//                                        dailyusage.setDailyusagestatus_id(daodailyusagestatus.getById(1));
                                        dailyusage.setAddeddate(LocalDate.now());


                                        System.out.println("AAAAAAA");
                                        daodaily.save(dailyusage);


                                        daomaterialinventroy.save(matinventory);


                                    }

                                    //inventory ekee thiyena available qty eken sub menu qty eka adu krnwa order count eken miltiple krnwa

                                }
                            }
                        }
                    } else {
                        Submenu ressmenu = daoSbm.getById(rhs.getSubmenu_id().getId());
                        for (SubmenuHasMaterial mhs : ressmenu.getSubmenuHasMaterialList()) {


                            Materialinventory matinventory = daomaterialinventroy.getByMaterial(mhs.getMaterial_id().getId());

                            if (matinventory != null) {

                                if (matinventory.getAvaqty().compareTo(mhs.getQty().multiply(BigDecimal.valueOf(rhs.getOrdercount()))) > 0) {

                                    matinventory.setAvaqty(matinventory.getAvaqty().subtract(mhs.getQty().multiply(BigDecimal.valueOf(rhs.getOrdercount()))));
                                    if (matinventory.getAvaqty().compareTo(BigDecimal.valueOf(0)) == 0) {
                                        matinventory.setInventorystatus_id(daoinventroy.getById(2));
                                    } else {
                                        if (matinventory.getAvaqty().compareTo(BigDecimal.valueOf(0)) == 1) {
                                            matinventory.setInventorystatus_id(daoinventroy.getById(1));
                                        }
                                    }

                                }


                                DailyUsage dailyusage = new DailyUsage();

//                                        DailyUsage dailyusage = daodaily.getByMaterial(hasMaterial.getMaterial_id().getId());

                                dailyusage.setMaterial_id(mhs.getMaterial_id());
                                dailyusage.setUsageqty(mhs.getQty().multiply((BigDecimal.valueOf(rhs.getOrdercount()))));
                                dailyusage.setReservation_id(rhs.getReservation_id());
//                                dailyusage.setDailyusagestatus_id(daodailyusagestatus.getById(1));
                                dailyusage.setAddeddate(LocalDate.now());

                                System.out.println("BBBBBB");
                                daodaily.save(dailyusage);

                                daomaterialinventroy.save(matinventory);
                            }

                        }
                    }
                }
//
                daor.save(reservation);

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

    //customerpayment/getbyreservation?reservationid=47
    @GetMapping(value = "/getbyreservation", params = {"reservationid"}, produces = "application/json")
    public Customerpayment customerpayments(@RequestParam("reservationid") int reservationid) {
        return dao.getbyReservationid(reservationid);

    }

    //customerpayment/getbycurrentamount?reservationid=51
    @GetMapping(value = "/getbycurrentamount", params = {"reservationid"}, produces = "application/json")
    public Customerpayment getCurrentamount(@RequestParam("reservationid") int reservationid) {
        return dao.getcurrentAmount(reservationid);
    }

}


