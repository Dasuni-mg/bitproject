package com.gamagerestaurant.controller;


import com.gamagerestaurant.model.*;
import com.gamagerestaurant.model.Reservation;
import com.gamagerestaurant.repository.CustomerpaymentRepository;
import com.gamagerestaurant.repository.CustomerpaymentstatusRepository;
import com.gamagerestaurant.repository.ReservationRepository;
import com.gamagerestaurant.repository.ReservationstatusRepository;
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

    @Autowired //create a object and convert to a instance
    //in delete only change the status id to delete.so status repository is needed
    private ReservationstatusRepository daostatus;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Reservation> reservationList() {
        return dao.list();
    }

    @GetMapping(value = "/byreservationcode/{code}", produces = "application/json")
    public Reservation reservationByCode(@PathVariable("code")String code) {
        return dao.getByCode(code);
    }

    @Autowired
    public CustomerpaymentstatusRepository daocuspaymentstatus;

    //get next Reservation reg no [/reservation/nextrn]
    @GetMapping(value = "/nextrn", produces = "application/json")
    public Reservation nextResNo() {
        String nextresno = dao.nextResNo();

        Reservation nextrn = new Reservation(nextresno);
        return nextrn;
    }

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
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;
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
                reservation.setReservationstatus_id(daostatus.getById(1));

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
                for (ReservationHasService rhs : reservation.getReservationHasServiceList()) {
                    rhs.setReservation_id(reservation);
                }
                dao.save(reservation);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed.." + ex.getMessage();
            }
        } else
            return "Error deleting: you have No previlage..!";
    }


}


