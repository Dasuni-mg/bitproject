package com.gamagerestaurant.controller;


import com.gamagerestaurant.model.*;
import com.gamagerestaurant.model.Reservation;
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

//servelet ekata readable karanawa- Rest controller eken
@RestController
@RequestMapping(value = "/reservation")
public class ReservationController {

    @Autowired //create a object and convert to a instance
    private PrevilageController previlageController;

    @Autowired //create a object and convert to a instance
    private UserService userService;

    @Autowired //create a object and convert to a instance
    //get data from the backend
    private ReservationRepository dao;

    @Autowired
    private CustomerpaymentRepository daopayment;

    @Autowired
    private MenuRepository daoM;

    @Autowired
    private SubmenuRepository daoSbm;

    @Autowired
    private MaterialInventoryRepository daomaterialinventroy;

    @Autowired
    private InventorystatusRepository daoinventroy;

    @Autowired
    private DailyUsageReopistory daodaily;

    @Autowired
    private DailyusagestatusRepository daodailyusagestatus;

    @Autowired //create a object and convert to a instance
    //in delete only change the status id to delete.so status repository is needed
    private ReservationstatusRepository daostatus;

    @Autowired
    public CustomerpaymentstatusRepository daocuspaymentstatus;

    @Autowired
    public CustomerPaymentmethodRepository daopaymentmethod;

    //data access object
    //get request mapping for Get Reservation page request given params
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Reservation> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "RESERVATION");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;

    }


    //reservation/findRservationwithPayment?page=0&size=1
    @GetMapping(value = "/findRservationwithPayment", params = {"page", "size"}, produces = "application/json")
    public Page findRservationwithPayment(@RequestParam("page") int page, @RequestParam("size") int size) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "RESERVATION");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAlleservationwithpayment(PageRequest.of(page, size));
        } else
            return null;

    }


    //reservation/findRservationwithPayment?page=0&size=1
    @GetMapping(value = "/finddelivery", params = {"page", "size"}, produces = "application/json")
    public Page findDelivery(@RequestParam("page") int page, @RequestParam("size") int size) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "RESERVATION");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.finddelivery(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;

    }


    //get request mapping for Get customer page request given params with search value
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Reservation> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "RESERVATION");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.finddeliverysearch(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;
    }


    //reservation/findRservationwithPayment?page=0&size=1
    @GetMapping(value = "/finddinein", params = {"page", "size"}, produces = "application/json")
    public Page findDinein(@RequestParam("page") int page, @RequestParam("size") int size) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "RESERVATION");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.finddinein(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;

    }


    //get request mapping for Get customer page request given params with search value
    @GetMapping(value = "/finddinein", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Reservation> findDinein(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "RESERVATION");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.finddineinsearch(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;
    }


    //reservation/findtakeaway?page=0&size=1
    @GetMapping(value = "/findtakeaway", params = {"page", "size"}, produces = "application/json")
    public Page findtakeaway(@RequestParam("page") int page, @RequestParam("size") int size) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "RESERVATION");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findtakeway(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;

    }


    //get request mapping for Get customer page request given params with search value
    // reservation/findtakeaway?page=0&size=1
    @GetMapping(value = "/findtakeaway", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Reservation> findtakeawaysearch(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "RESERVATION");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findtakeawaysearch(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;
    }

    //get next Reservation reg no [/reservation/nextrn]
    @GetMapping(value = "/nextrn", produces = "application/json")
    public Reservation nextResNo() {
        String nextresno = dao.nextResNo();
        Reservation nextrn = new Reservation(nextresno);
        return nextrn;
    }

    //  /reservation/list
    // Query for get r.id,r.reservationno,r.cmobile
    //this is for get these properties to use in another module
    @GetMapping(value = "/list", produces = "application/json")
    public List<Reservation> reservationList() {
        return dao.list();
    }

    @GetMapping(value = "/byreservationcode/{code}", produces = "application/json")
    public Reservation reservationByCode(@PathVariable("code") String code) {
        return dao.getByCode(code);
    }

    //DINE IN reservation List
    // /reservation/dineinreservation
    @GetMapping(value = "/dineinreservation", produces = "application/json")
    public List<Reservation> reservationDineinList() {
        return dao.getbyDineIn();
    }

    // IsAdvance true list
    //AVDANCE PAID CUSTOMERS, get to CUSTOMER PAYMENT MODULE
    //reservation/byisadvance
    @GetMapping(value = "/byisadvance", produces = "application/json")
    public List<Reservation> reservationIsAdvanceList() {
        return dao.getbyIsAdvance();
    }

    //post mapping for insert porder object
    @PostMapping
    public String insert(@RequestBody Reservation reservation) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "RESERVATION");
        //check user null
        if (priv != null & priv.get("add")) {
            try {
                System.out.println(reservation);
                reservation.setAddeddate(LocalDate.now());

                if (reservation.getIsadvance() != null) {
                    //getIsadvance true - pending status
                    if (reservation.getIsadvance()) {
                        reservation.setReservationstatus_id(daostatus.getById(1));
                    } else {
                        //getIsadvance true - completed status
                        reservation.setReservationstatus_id(daostatus.getById(2));
                    }
                }


                //reservation status default set as completed
                reservation.setReservationstatus_id(daostatus.getById(2));
                reservation.setReservationno(dao.nextResNo());

                if (reservation.getDeliveryaddress() != null) {
                    reservation.setCpmethod_id(daopaymentmethod.getById(2));
                }

//                if (reservation.getDeliveryaddress()!= null){
//                    reservation.setReservationstatus_id(daostatus.getById(1));
//                }
//                System.out.println("STATUS "+reservation.getReservationstatus_id().getName());


                for (ReservationHasService shi : reservation.getReservationHasServiceList()) {
                    shi.setReservation_id(reservation);
                }
                dao.save(reservation);


//                Customerpayment customerpayment = null;
//                customerpayment.setReservation_id(reservation);
//                customerpayment.setBalanceamount(reservation.getBalanceamount());
//                customerpayment.setPaidamount(reservation.getPaidamount());
//                customerpayment.setPaiddatetime(LocalDateTime.now());
//                customerpayment.setCurrentamount(reservation.getLastprice());
//
//
//                customerpayment.setEmployee_id(reservation.getCustomer_id().getEmployee_id());
//                customerpayment.setCpstatus_id(daocuspaymentstatus.getById(1));
//                customerpayment.setCpmethod_id(reservation.getCpmethod_id());
//
//
//
//                daopayment.save(customerpayment);
//


                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error saving: you have No previlage..!";

    }

    @PutMapping
    public String update(@RequestBody Reservation reservation) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "RESERVATION");
        //check user null
        if (user != null & priv != null & priv.get("update")) {
            try {
                System.out.println(reservation);
                for (ReservationHasService rhs : reservation.getReservationHasServiceList()) {
                    rhs.setReservation_id(reservation);
                }


                dao.save(reservation);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error updating: you have No previlage..!";


    }

    // Delete Mapping for insert item object
    @DeleteMapping
    public String delete(@RequestBody Reservation reservation) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "RESERVATION");
        //check user null
        if (user != null & priv != null & priv.get("delete")) {
            try {
                reservation.setReservationstatus_id(daostatus.getById(3));

                for (ReservationHasService rhs : reservation.getReservationHasServiceList()) {
                    rhs.setReservation_id(reservation);
                }

                dao.save(reservation);

                Customerpayment customerpayment = daopayment.getbyReservationid(reservation.getId());
                customerpayment.setCpstatus_id(daocuspaymentstatus.getById(3));
                daopayment.save(customerpayment);


                //inventory update
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

                                        matinventory.setAvaqty(matinventory.getAvaqty().add(hasMaterial.getQty().multiply(BigDecimal.valueOf(rhs.getOrdercount()))));
                                        if (matinventory.getAvaqty().compareTo(BigDecimal.valueOf(0)) == 0) {
                                            matinventory.setInventorystatus_id(daoinventroy.getById(2)); //not available
                                        } else {
                                            if (matinventory.getAvaqty().compareTo(BigDecimal.valueOf(0)) == 1) {
                                                matinventory.setInventorystatus_id(daoinventroy.getById(1));
                                            }
                                        }
//
//                                        DailyUsage dailyusage = new DailyUsage();
//
//                                        DailyUsage dailyusage = daodaily.getByMaterial(hasMaterial.getMaterial_id().getId());
//
//                                        dailyusage.setDailyusagestatus_id(daodailyusagestatus.getById(2));
//                                        daodaily.save(dailyusage);
////
//                                        dailyusage.setMaterial_id(hasMaterial.getMaterial_id());
//                                        dailyusage.setUsageqty(hasMaterial.getQty().multiply((BigDecimal.valueOf(rhs.getOrdercount()))));
//                                        dailyusage.setReservation_id(rhs.getReservation_id());
//                                        dailyusage.setAddeddate(LocalDate.now());
//
//                                        System.out.println("AAAAAAA");
//                                        daodaily.save(dailyusage);
//
//
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

                                    matinventory.setAvaqty(matinventory.getAvaqty().add(mhs.getQty().multiply(BigDecimal.valueOf(rhs.getOrdercount()))));
                                    if (matinventory.getAvaqty().compareTo(BigDecimal.valueOf(0)) == 0) {
                                        matinventory.setInventorystatus_id(daoinventroy.getById(2));
                                    } else {
                                        if (matinventory.getAvaqty().compareTo(BigDecimal.valueOf(0)) == 1) {
                                            matinventory.setInventorystatus_id(daoinventroy.getById(1));
                                        }
                                    }

                                }


////
//                                      DailyUsage dailyusage = daodaily.getByMaterial(mhs.getMaterial_id().getId());
//                                System.out.println("SUB MENU HAS MATERIAL"+dailyusage);
//                                      dailyusage.setDailyusagestatus_id(daodailyusagestatus.getById(2));
//                                      daodaily.save(dailyusage);

//
//                                dailyusage.setMaterial_id(mhs.getMaterial_id());
//                                dailyusage.setUsageqty(mhs.getQty().multiply((BigDecimal.valueOf(rhs.getOrdercount()))));
//                                dailyusage.setReservation_id(rhs.getReservation_id());
//                                dailyusage.setDailyusagestatus_id(daodailyusagestatus.getById(1));
//                                dailyusage.setAddeddate(LocalDate.now());
//
//                                System.out.println("BBBBBB");
//                                daodaily.save(dailyusage);

                                daomaterialinventroy.save(matinventory);
                            }

                        }
                    }
                }

                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed.." + ex.getMessage();
            }
        } else
            return "Error deleting: you have No previlage..!";
    }


    //http://localhost:8080/reservation/deliverylist
    @GetMapping(value = "/deliverylist", produces = "application/json")
    public List<Reservation> reservationDeliveryList() {
        return dao.deliveryList();
//        return dao.list().stream().filter(e -> e.getDeliveryaddress()!=null).collect(Collectors.toList());
    }


}


