package com.gamagerestaurant.controller;


import com.gamagerestaurant.model.Dailyremove;
import com.gamagerestaurant.model.Materialinventory;
import com.gamagerestaurant.model.User;
import com.gamagerestaurant.repository.DailyRemoveRepository;
import com.gamagerestaurant.repository.DailyRemovestatusRepository;
import com.gamagerestaurant.repository.MaterialInventoryRepository;
import com.gamagerestaurant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;

@RestController
@RequestMapping(value = "/dailyremove")

//request services of Daily Remove
public class DailyRemoveController {

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private UserService userService;
    @Autowired
    //create a object and convert to a instance
    private DailyRemoveRepository dao;

    @Autowired
    private DailyRemovestatusRepository daostatus;


    @Autowired
    private MaterialInventoryRepository daomaterialinventroy;

   /* @GetMapping(value = "/list",produces = "application/json")
    public List<Dailyremove> dailyremoveList(){

        return dao.list();
    }*/

    //get next supplier bill [/dailyremove/nextdr]
    @GetMapping(value = "/nextdr", produces = "application/json")
    public Dailyremove nextDRCode() {
        String nextdailyremove = dao.nextDRCode();

        Dailyremove nextdr = new Dailyremove(nextdailyremove);
        return nextdr;
    }

    //data access object
    //get request mapping for Get Daily remove page request given params
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Dailyremove> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "DAILYREMOVE");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;

    }

    //get request mapping for Get dailyremove page request given params with search value
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Dailyremove> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "DAILYREMOVE");
        //check user null
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;
    }

    //post mapping for insert dailyremove object
    @PostMapping
    public String insert(@RequestBody Dailyremove dailyremove) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "DAILYREMOVE");
        //check user null
        if (user != null & priv != null & priv.get("add")) {
            try {
                dailyremove.setDailyremovecode(dao.nextDRCode());
                dailyremove.setDailyremovestatus_id(daostatus.getById(1));
                dailyremove.setEmployee_id(user.getEmployeeId());
                dailyremove.setDailyremovedate(LocalDate.now());


                dao.save(dailyremove);

//cross function for remove quantity in inventry(daily remove)
// material class eken variable ekak hadagannawa
                //materieal inventry reposiroty eken material object ekak gannawa inventry ekata  daily remove ekata adalawa
                //e ganna material object ekata set karanawa  daily remove eke remove quantity eka
                Materialinventory materialinventory = daomaterialinventroy.getByMaterial(dailyremove.getMaterial_id().getId());
                materialinventory.setRemoveqty(dailyremove.getRemoveqty());
                materialinventory.setAvaqty(materialinventory.getAvaqty().subtract(dailyremove.getRemoveqty()));
                daomaterialinventroy.save(materialinventory);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed.." + ex.getMessage();
            }
        } else
            return "Error saving: you have No previlage..!";

    }

    //mapping for update dailyremove object
    @PutMapping
    public String update(@RequestBody Dailyremove dailyremove) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "DAILYREMOVE");
        //check user null
        if (user != null & priv != null & priv.get("update")) {
            try {
                dao.save(dailyremove);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed.." + ex.getMessage();
            }
        } else
            return "Error updating: you have No previlage..!";
    }


    // Delete Mapping for insert dailyremove object
    @DeleteMapping
    public String delete(@RequestBody Dailyremove dailyremove) {
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get user Module previllage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATIONREQUEST");
        //check user null
        if (user != null & priv != null & priv.get("delete")) {
            try {
                dailyremove.setDailyremovestatus_id(daostatus.getById(3));
                dao.save(dailyremove);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed.." + ex.getMessage();
            }
        } else
            return "Error deleting: you have No previlage..!";
    }
}


