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
@EnableWebSecurity
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
    protected void configure(HttpSecurity http) throws Exception {

        http.
                authorizeRequests()
                .antMatchers("/").permitAll()
                .antMatchers("/resources/**").permitAll()
                .antMatchers("/login").permitAll()
                .antMatchers("/forgotpassword").permitAll()

                .antMatchers("/customer/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER")
                .antMatchers("/material/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER")
                .antMatchers("/supplier/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER")
                .antMatchers("/quotationrequest/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER")
                .antMatchers("/dailyremove/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER")
                .antMatchers("/materialinventory/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER")
                .antMatchers("/quotation/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER")
                .antMatchers("/porder/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER")
                .antMatchers("/grn/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER")
                .antMatchers("/spayment/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER")
                .antMatchers("/submenu/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER")
                .antMatchers("/reservation/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER","CASHIER")
                .antMatchers("/customerpayments/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER")
                .antMatchers("/tableallocation/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER")
                .antMatchers("/menu/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER")

                .antMatchers("/user/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER")
                .antMatchers("/employee/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER")

                .antMatchers("/mainwindow").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER")
                .antMatchers("/privilage/**").hasAnyAuthority("ADMIN", "OWNER", "MANAGER", "CASHIER").anyRequest().authenticated()
                .and().csrf().disable().formLogin()
                .loginPage("/login")
                .failureHandler((request, response, exception) -> {
                    System.out.println(exception.getMessage());
                    System.out.println(response.getStatus());
                    String redirectUrl = new String();
                    if (exception.getMessage() == "User is disabled") {
                        redirectUrl = request.getContextPath() + "/login?error=notactive";
                    } else if (exception.getMessage() == "Bad credentials") {
                        redirectUrl = request.getContextPath() + "/login?error=detailserr";
                    } else if (exception.getMessage() == null) {
                        redirectUrl = request.getContextPath() + "/login?error=detailserr";
                    }
                    response.sendRedirect(redirectUrl);
                })
                .defaultSuccessUrl("/dashboard", true)
                .usernameParameter("username")//real username
                .passwordParameter("password")//real password
                .and().logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/login").and().exceptionHandling().accessDeniedPage("/access-denied").and()
                .sessionManagement()
                .invalidSessionUrl("/login")
                .sessionFixation()
                .changeSessionId()
                .maximumSessions(6)
                .expiredUrl("/login").maxSessionsPreventsLogin(true);
        ;
        http.headers()
                .addHeaderWriter(new XFrameOptionsHeaderWriter(XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN));
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        return bCryptPasswordEncoder;
    }
/*    @Bean
    public ViewResolver internalResourceViewResolver() {
        InternalResourceViewResolver bean = new InternalResourceViewResolver();
        bean.setPrefix("/resources/**");
        bean.setSuffix(".html");
        return bean;
    }*/

}
