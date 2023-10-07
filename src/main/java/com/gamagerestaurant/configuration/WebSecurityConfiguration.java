package com.gamagerestaurant.configuration;


import com.gamagerestaurant.service.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
//@Configuration - class WebSecurityConfiguration is a configuration class for the application.
@EnableWebSecurity
//@EnableWebSecurity - web security features for the application

//WebSecurityConfiguration class extends the WebSecurityConfigurerAdapter class,
// WebSecurityConfigurerAdapter is a class provided by Spring Security that serves as
// a base class for creating custom security configurations in a web application.
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private MyUserDetailsService userDetailsService;


    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .userDetailsService(userDetailsService)
                .passwordEncoder(bCryptPasswordEncoder);
    }

    @Override
    // Configuration for HTTP security goes here
    protected void configure(HttpSecurity http) throws Exception {

        http.

                // Configure authorization for HTTP requests
                authorizeRequests()

                // Allow access to the root URL ("/") for all users (permit all)
                .antMatchers("/").permitAll()

                // Allow access to URLs starting with "/resources/" and any subdirectories for all users (permit all)
                .antMatchers("/resources/**").permitAll()

                // Allow access to the "/login" URL for all users (permit all)
                .antMatchers("/login").permitAll()

                // Allow access to the "/forgotpassword" URL for all users (permit all)
                .antMatchers("/forgotpassword").permitAll()


                //// Allow access to URLs starting with "/privilage/" only for users with any of the specified authorities ("ADMIN", "OWNER", "MANAGER", "CASHIER")
                .antMatchers("/customer/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER","ASSISTANTMANAGER")
                .antMatchers("/material/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER","ASSISTANTMANAGER")
                .antMatchers("/supplier/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER","ASSISTANTMANAGER")
                .antMatchers("/quotationrequest/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER","ASSISTANTMANAGER")
                .antMatchers("/dailyremove/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER","ASSISTANTMANAGER")
                .antMatchers("/materialinventory/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER","ASSISTANTMANAGER")
                .antMatchers("/quotation/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER","ASSISTANTMANAGER")
                .antMatchers("/porder/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER","ASSISTANTMANAGER")
                .antMatchers("/grn/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER","ASSISTANTMANAGER")
                .antMatchers("/spayment/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER","ASSISTANTMANAGER")
                .antMatchers("/submenu/**").hasAnyAuthority("ADMIN", "OWNER","CASHIER", "MANAGER","ASSISTANTMANAGER")
                .antMatchers("/reservation/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER","CASHIER","ASSISTANTMANAGER")
                .antMatchers("/customerpayments/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER","ASSISTANTMANAGER")
                .antMatchers("/tableallocation/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER","ASSISTANTMANAGER")
                .antMatchers("/menu/**").hasAnyAuthority("ADMIN", "OWNER","CASHIER", "MANAGER","ASSISTANTMANAGER")

                .antMatchers("/user/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER","CASHIER","ASSISTANTMANAGER")
                .antMatchers("/employee/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER","ASSISTANTMANAGER")

                .antMatchers("/mainwindow").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER","ASSISTANTMANAGER")
                .antMatchers("/privilage/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER","ASSISTANTMANAGER")

                // Require authentication for all other requests
                .anyRequest().authenticated()

                // Disable CSRF protection
                //CSRF (Cross-Site Request Forgery) protection is a security mechanism used to prevent attackers from executing unauthorized actions on behalf of authenticated users.
                .and().csrf().disable()

                // Enable form-based authentication
                .formLogin()

                // Set the URL path for the custom login page
                .loginPage("/login")

                // Custom handler for handling login failures
                .failureHandler((request, response, exception) -> {

                    // Print the exception message to the console
                    System.out.println(exception.getMessage());

                    // Print the response status to the console
                    System.out.println(response.getStatus());


                    String redirectUrl = new String();

                    // Check if the exception message is "User is disabled"
                    if (exception.getMessage() == "User is disabled") {
                        // Set the redirect URL with an error parameter indicating "notactive"
                        redirectUrl = request.getContextPath() + "/login?error=notactive";
                        // Check if the exception message is "Bad credentials"
                        } else if (exception.getMessage() == "Bad credentials") {
                        // Set the redirect URL with an error parameter indicating "detailserr"
                        redirectUrl = request.getContextPath() + "/login?error=detailserr";
                        // Check if the exception message is null
                    } else if (exception.getMessage() == null) {
                        // Set the redirect URL with an error parameter indicating "detailserr"
                        redirectUrl = request.getContextPath() + "/login?error=detailserr";
                    }
                    // Redirect the response to the specified URL
                    response.sendRedirect(redirectUrl);
                })

                // After successful login, redirect to "/dashboard" URL with HTTP POST method
                .defaultSuccessUrl("/dashboard", true)

                // The parameter name for the username field in the login form
                .usernameParameter("username")//real username

                // The parameter name for the password field in the login form
                .passwordParameter("password")//real password

                // Enable logout functionality
                .and().logout()

                // The URL path to match for logout
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))

                // After successful logout, redirect to "/login" URL
                .logoutSuccessUrl("/login").and().exceptionHandling().accessDeniedPage("/access-denied").and()

                // Redirect to "/access-denied" page if access is denied
                .sessionManagement()

                // Redirect to "/login" URL if the session is invalid
                .invalidSessionUrl("/login")

                // Change the session ID to prevent session fixation attacks
                .sessionFixation()

                // Change the session ID to prevent session fixation attacks
                .changeSessionId()

                // Allow a maximum of 2 sessions for a single user
                //maximum number of sessions can enter incorrect credentials
                .maximumSessions(2)

                // Redirect to "/login" URL if the session has expired
                .expiredUrl("/login")

                // Prevent new logins if the maximum sessions limit is reached
                .maxSessionsPreventsLogin(true);
        ;
        http.headers()
                // Add an HTTP header to set X-Frame-Options mode to "SAMEORIGIN"
                .addHeaderWriter(new XFrameOptionsHeaderWriter(XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN));
    }



   // @Bean- method should be processed by the Spring container to manage the lifecycle of the returned object.
    @Bean
    //responsible for encoding passwords using the BCrypt hashing algorithm
    public BCryptPasswordEncoder passwordEncoder() {

        // Create an instance of BCryptPasswordEncoder
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

        // Return the BCryptPasswordEncoder instance
        return bCryptPasswordEncoder;
    }


}
