package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.User;
import com.gamagerestaurant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class UIController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/access-denied", method = RequestMethod.GET)
    public ModelAndView error(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("error.html");
        return modelAndView;
    }


    @RequestMapping(value = "/config", method = RequestMethod.GET)
    public ModelAndView config(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("config.html");
        return modelAndView;
    }

    @GetMapping(value = {"/employee" })
    public ModelAndView employeeui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("employee.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }



    @GetMapping(path = "/employee/{id}")
    public ModelAndView employeessui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("employee.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = "/privilage")

    //function that execute the service
    public ModelAndView privilageui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("privilage.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = "/customer")

    //function that execute the service
    public ModelAndView customerUi() {
        //create model and view object
        ModelAndView modelAndView = new ModelAndView();
        //get security context authentocation object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            //check user null
            modelAndView.setViewName("customer.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


    @GetMapping(value = {"/material" })

    //function that execute the service
    public ModelAndView materialui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("material.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


    @GetMapping(value = {"/material1" })

    //function that execute the service
    public ModelAndView material1ui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("material1.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }



    @GetMapping(value = {"/supplier" })

    //function that execute the service
    public ModelAndView supplierui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("supplier.html");
        }
        else
            modelAndView.setViewName("supplier.html");

        return modelAndView;
    }


    @GetMapping(value = {"/quotationrequest" })

    //function that execute the service
    public ModelAndView quotationrequestui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("quotationrequest.html");
        }
        else
            modelAndView.setViewName("quotationrequest.html");

        return modelAndView;
    }

    @GetMapping(value = {"/qrequest" })

    //function that execute the service
    public ModelAndView qrequestui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("qrequest.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = {"/quotation" })

    //function that execute the service
    public ModelAndView quotationui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("quotation.html");
        }
        else
            modelAndView.setViewName("quotation.html");

        return modelAndView;
    }

    @GetMapping(value = {"/quotation1" })

    //function that execute the service
    public ModelAndView quotation1ui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("quotation1.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


    @GetMapping(value = {"/dailyremove" })

    //function that execute the service
    public ModelAndView dailyremoveui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("dailyremove.html");
        }
        else
            modelAndView.setViewName("dailyremove.html");

        return modelAndView;
    }

    @GetMapping(value = {"/purchaseorder" })

    //function that execute the service
    public ModelAndView purchaseorderui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("purchaseorder.html");
        }
        else
            modelAndView.setViewName("purchaseorder.html");

        return modelAndView;
    }


    @GetMapping(value = {"/spayment" })

    //function that execute the service
    public ModelAndView spaymentui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("spayment.html");
        }
        else
            modelAndView.setViewName("spayment.html");

        return modelAndView;
    }



    @GetMapping(value = {"/submenu" })

    //function that execute the service
    public ModelAndView submenuui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("submenu.html");
        }
        else
            modelAndView.setViewName("submenu.html");

        return modelAndView;
    }


    @GetMapping(value = {"/submenu1" })

    //function that execute the service
    public ModelAndView submenu1ui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("submenu1.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = {"/menu" })

    //function that execute the service
    public ModelAndView menuui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("menu.html");
        }
        else
            modelAndView.setViewName("menu.html");

        return modelAndView;
    }


    @GetMapping(value = {"/menu1" })

    //function that execute the service
    public ModelAndView menu1ui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("menu1.html");
        }
        else
            modelAndView.setViewName("menu1.html");

        return modelAndView;
    }

    @GetMapping(value = {"/service" })

    //function that execute the service
    public ModelAndView serviceui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("service.html");
        }
        else
            modelAndView.setViewName("service.html");

        return modelAndView;
    }

    @GetMapping(value = {"/grn" })

    //function that execute the service
    public ModelAndView grnui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("grn.html");
        }
        else
            modelAndView.setViewName("grn.html");

        return modelAndView;
    }

    @GetMapping(value = {"/grn1" })

    //function that execute the service
    public ModelAndView grn1ui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("grn1.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = {"/materialinventory" })

    //function that execute the service
    public ModelAndView materialinventoryui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("materialinventory.html");
        }
        else
            modelAndView.setViewName("materialinventory.html");

        return modelAndView;
    }

    @GetMapping(value = {"/inventory" })

    //function that execute the service
    public ModelAndView inventoryui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("inventory.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


    @GetMapping(value = {"/reservation" })

    //function that execute the service
    public ModelAndView reservationui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("reservation.html");
        }
        else
            modelAndView.setViewName("reservation.js");

        return modelAndView;
    }


    @GetMapping(value = {"/customerpayment" })

    //function that execute the service
    public ModelAndView Customerpaymentui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("customerpayment.html");
        }
        else
            modelAndView.setViewName("customerpayment.js");

        return modelAndView;
    }


    @GetMapping(value = {"/cpayment" })

    //function that execute the service
    public ModelAndView Cpaymentui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("cpayment.html");
        }
        else
            modelAndView.setViewName("error.js");

        return modelAndView;
    }

    @GetMapping(value = {"/tableallocation" })
    //function that execute the service
    public ModelAndView TableAllocationui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("tableallocation.html");
        }
        else
            modelAndView.setViewName("tableallocation.js");

        return modelAndView;
    }






    /* ---------------------------------------------------
  REPORT
----------------------------------------------------- */

    @GetMapping(value = {"/report/samplereport" })

    //function that execute the service
    public ModelAndView Samplereportui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("samplereport.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = {"/reportsupplierarreasui" })

    //function that execute the service
    public ModelAndView Supplierarreasreportui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("supplierarreas.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = {"/reportmonthlyExpencesui" })

    //function that execute the service
    public ModelAndView MonthlyExpencesui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("Monthlyex.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


    @GetMapping(value = {"/menuanalysisui" })

    //function that execute the service
    public ModelAndView MenuAnalysisui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("menuanalysis.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = {"/sampleui" })

    //function that execute the service




    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public ModelAndView user() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("user.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


    //New modules



  @GetMapping(value = {"/dashboard" })

    //function that execute the service
    public ModelAndView Dashboardui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("dashboard.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = {"/delivery" })

    //function that execute the service
    public ModelAndView Deliveryui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("delivery.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


    @GetMapping(value = {"/deliverytable" })

    //function that execute the service
    public ModelAndView Deliverytableui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("deliverytable.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }



    @GetMapping(value = {"/customertable" })

    //function that execute the service
    public ModelAndView Customertableui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("customertable.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = {"/take_away" })

    //function that execute the service
    public ModelAndView Take_awayui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("take_away.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


     @GetMapping(value = {"/takeaway" })

    //function that execute the service
    public ModelAndView Takeawayui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("takeaway.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

     @GetMapping(value = {"/dinein" })

    //function that execute the service
    public ModelAndView Dineinui() {

        //create model view object
        ModelAndView modelAndView = new ModelAndView();

        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //Check user null
        if(user!= null){
            modelAndView.setViewName("dine_in.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }




}






