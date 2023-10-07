package com.gamagerestaurant.controller;


import com.gamagerestaurant.model.*;
import com.gamagerestaurant.repository.*;
import com.gamagerestaurant.service.EmailService;
import com.gamagerestaurant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Random;

@RestController
public class LoginController {

    @Autowired
    private UserService userService;
    @Autowired
    private EmployeeRepository employeedao;
    @Autowired
    private GenderRepository genderdao;
    @Autowired
    private CivilstatusRepository civilstatusdao;
    @Autowired
    private EmployeestatusRepository employeestatusdao;
    @Autowired
    private DesignationRepository designationdao;
    @Autowired
    private RoleRepository roledao;

    @Autowired
    private EmailService emailService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private UserRepository dao;


    // Endpoint to show the login page
    @RequestMapping(value ={"/login","/"}, method = RequestMethod.GET)
    public ModelAndView login() {

        // Create a new ModelAndView instance
        ModelAndView modelAndView = new ModelAndView();

        // Set the view name (the logical name of the view)
        modelAndView.setViewName("login.html");

        // Return the ModelAndView object
        return modelAndView;
    }


    @RequestMapping(value = "/mainwindow", method = RequestMethod.GET)
    public ModelAndView mainwindow() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        System.out.println(user.getUserName());
        modelAndView.addObject("user", user);
        modelAndView.addObject("adminMessage", "Content Available Only for Users with Admin Role");
        modelAndView.setViewName("mainvindow.html");
        return modelAndView;
    }



    @PostMapping(value = "/registration")
    public String createNewUser(@RequestBody  Config config) {
        System.out.println(config.getNumber());
        Employee emplyeeExists = employeedao.findByNumber(config.getNumber());
        if (emplyeeExists != null) {
            return "Already Registered";
        }else{
           try{
            Employee employee = new Employee();
            employee.setGenderId(genderdao.getById(1));
            employee.setCivilstatusId(civilstatusdao.getById(1));
            employee.setDesignationId(designationdao.getById(1));
            employee.setEmployeestatusId(employeestatusdao.getById(1));
            employee.setNumber(config.getNumber());
            employee.setCallingname("Admin");
            employee.setFullname(config.getFullname());
            employee.setNic("000000000000");
            employee.setAddress(config.getAddress());
            employee.setMobile(config.getMobile());
            employee.setDoassignment(config.getRegdate());

            Employee saveemplyee =  employeedao.saveAndFlush(employee);

            User user = new User();
            user.setUserName(config.getUsername());
            user.setEmail(config.getEmail());
            user.setPassword(config.getPassword());
            user.setEmployeeId(saveemplyee);
            user.setEmployeeCreatedId(saveemplyee);

            Role role = new Role();
            role.setRole("ADMIN");
            roledao.save(role);

            Role userRole = roledao.findByRole("ADMIN");
            user.setRoles(new HashSet<Role>(Arrays.asList(userRole)));
            userService.saveUser(user);

            return "0";
           }catch (Exception e) {
               return "Error-Saving : " + e.getMessage();
           }
        }
    }


    @PostMapping(value="/changepassword")
    public String changePasswordadd(@RequestBody ChangePassword changePassword) {

        // Get the current authentication object from the SecurityContextHolder
        // This contains details about the currently authenticated user
        // (e.g., username, roles, and other authentication-related information)
        // Note: This requires that the user is already authenticated; otherwise, it may return an anonymous or null authentication object.

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //make User object as exuser and assing it to userService eke authenticated userslawa
        User exuser = userService.findUserByUserName(auth.getName());

        //authentication user knk nathnm
        if (exuser == null) {
            return "Error-Saving : You have no Permission";
        } else {
            try {
                User currentuser = userService.findUserByUserName(changePassword.getUsername());
                if (currentuser == null) {
                    return "Username is incorrect";
                } else {

                    //front-end eken set krnna ewana password ekai db eke thiyena password ekai ee adaala userta,check krnwa
                    if (bCryptPasswordEncoder.matches(changePassword.getCurrentPassword(), currentuser.getPassword())) {

                        //set the new password for exsisting user
                        currentuser.setPassword(bCryptPasswordEncoder.encode(changePassword.getNewPassword()));

                        dao.save(currentuser);
                        return "0";
                    } else {
                        return "Current password is incorrect";
                    }
                }
            } catch (Exception e) {
                return "Error-Saving : " + e.getMessage();
            }
        }
    }

    @PutMapping(value="/changepassword")
    public String changePasswordforgot(@RequestBody ChangePassword changePassword) {

            try {
                User currentuser = dao.findUserByEmailandcode(changePassword.getEmail(),changePassword.getHint());
                if (currentuser == null) {
                    return "User is incorrect";
                } else {
                        currentuser.setPassword(bCryptPasswordEncoder.encode(changePassword.getNewPassword()));
                        currentuser.setHint(null);
                        dao.save(currentuser);
                        return "0";
                }
            } catch (Exception e) {
                return "Error-Saving : " + e.getMessage();
            }

    }

    @PostMapping(value = "/forgotpassword")
    public String forgotPasswordemail(@RequestBody ChangePassword forgotPassword) {
        try {
            User user = userService.findUserByEmail(forgotPassword.getEmail());
            if (user == null) {
                return "Email is incorrect";
            } else {
                Random random = new Random();
                String hint = String.format("%04d", random.nextInt(10000));
               user.setHint(hint);
                dao.save(user);

                emailService.sendMail(user.getEmail(), "Password Change Code","Code : "+hint+"\n Please use above Code to Complete your Passsword Change steps. \n\n  System Admin");
                return "0";
            }
        } catch (Exception e) {
            return "Error-Saving : " + e.getMessage();
        }
    }

    @PutMapping(value = "/forgotpassword")
    public String forgotPasswordcode(@RequestBody ChangePassword forgotPassword) {
        try {
            User user = dao.findUserByEmailandcode(forgotPassword.getEmail(),forgotPassword.getHint());
            if (user == null) {
                return "Code is incorrect";
            } else {

                return "0";
            }
        } catch (Exception e) {
            return "Error-Saving : " + e.getMessage();
        }
    }

}