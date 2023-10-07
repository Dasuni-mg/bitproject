package com.gamagerestaurant.controller;

import com.gamagerestaurant.model.User;
import com.gamagerestaurant.repository.UserRepository;
import com.gamagerestaurant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.*;

@RequestMapping(value = "/user")
@RestController
public class UserController {

    @Autowired
    private UserRepository dao;

    @Autowired
    private PrevilageController PrevilageController;

    @Autowired
    private UserService userService;

    // Endpoint to retrieve the currently logged-in user
    @RequestMapping(value = "/logeduser", method = RequestMethod.GET)
    public User getLogedUser() {
        // Get the authentication object from the security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Get the username of the authenticated user
        String username = auth.getName();
        // Call the userService to find the user by their username
        User user = userService.findUserByUserName(username);
        // Return the found user
        return user;
    }


    // Endpoint to get the user with role "ADMIN"
    @GetMapping(value = "/getAdmin", produces = "application/json")
    public User getAdmin() {
        return dao.getAdmin();
    }

    // Endpoint to get a user by their username
    @GetMapping(path = "/getuser/{userName}", produces = "application/json")
    public User getUserName(@PathVariable("userName")String userName) {
        return dao.findByLoggedName(userName);
    }

    // Endpoint to get a list of all users
    @GetMapping(value = "/list", produces = "application/json")
    public List<User> user() {
        return dao.list();
    }

    // Endpoint to get all users with pagination and sorting by 'id'
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<User> getAll(@RequestParam("page") int page, @RequestParam("size") int size ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = PrevilageController.getPrivilages(user,"USER");
        if(user!= null && priv.get("select")){
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        }
        return null;
    }

    // Endpoint to get all users with pagination, sorting, and search by 'id'
    @GetMapping(value = "/findAll",params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<User> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = PrevilageController.getPrivilages(user,"USER");
        if(user!= null && priv.get("select")){
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        }
        return null;
    }

    // Endpoint to add a new user
    @Transactional
    @PostMapping()
    public String add(@Validated @RequestBody User user) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User exuser = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = PrevilageController.getPrivilages(exuser,"USER");
        if(exuser!= null && priv.get("add")){
            try {
                System.out.println("aaaaaaaaaaaaaaaaaa");
                userService.saveUser(user);
                return "0";
            } catch (Exception e) {
                return "Error-Saving : " + e.getMessage();
            }
        } else {
            return "Error-Saving : You have no Permission";
        }
    }

    // Endpoint to update an existing user
    @PutMapping
    public String update(@Validated @RequestBody User user) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User exuser = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = PrevilageController.getPrivilages(exuser,"USER");
        if(exuser!= null && priv.get("update")){
            try {
                User logeduser = dao.getlogeduser(user.getId());
                if(logeduser !=null){
                    return "User Can't change Status";
                } else {
                    dao.save(user);
                    return "0";
                }
            } catch(Exception e) {
                return "Error-Saving : " + e.getMessage();
            }
        } else {
            return "Error-Updating : You have no Permission";
        }
    }

    // Endpoint to delete a user
    @DeleteMapping
    public String delete(@RequestBody User user ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User exuser = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = PrevilageController.getPrivilages(exuser,"USER");
        if(exuser!= null && priv.get("delete")){
            try {
                user.setActive(false);
                dao.save(user);
                return "0";
            } catch (Exception e) {
                return "Error-Deleting : " + e.getMessage();
            }
        } else {
            return "Error-Deleting : You have no Permission";
        }
    }
}
