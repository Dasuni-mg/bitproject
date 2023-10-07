package com.gamagerestaurant.controller;



import com.gamagerestaurant.model.Customerpayment;
import com.gamagerestaurant.model.Supplier;
import com.gamagerestaurant.repository.MaterialInventoryRepository;
import com.gamagerestaurant.repository.ReportRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(value = "/report")
public class ReportController {

    @Autowired
    private ReportRepository dao;


    @Autowired
    private MaterialInventoryRepository daoinventory;

    // get Mapping For get supplier Arreas amount
    @GetMapping(value = "/supplierarreas", produces = "application/json")
    public List<Supplier> supplierArreasList(){
        return dao.supplierArreasList();
    }

    // report/byselecteddateofexpences?statrtdate=2022-01-01&enddate=2022-05-01&type=Daily
    @GetMapping(value = "/byselecteddateofexpences",params = {"statrtdate","enddate","type"},produces = "application/json")
    public List byselecteddateofexpences(@RequestParam("statrtdate") String statrtdate, @RequestParam("enddate") String enddate, @RequestParam("type") String type) {
        if (type.equals("Daily")) {
            return dao.dailyExpencesReportList(LocalDate.parse(statrtdate), LocalDate.parse(enddate));
        }else
        if (type.equals("Weekly")) {
            return dao.weeklyExpencesReportList(statrtdate, enddate);
        }else
        if (type.equals("Monthly")) {
            return dao.monthlyExpencesReportList(statrtdate, enddate);
        }else
        if (type.equals("Annually")) {
            return dao.anualyExpencesReportList(statrtdate, enddate);
        }else
            return null;
}
    //expenses report by given start date ,end date with type [report/expensesreport?sdate=2022-01-01&edate=2022-05-08&type=Monthly]

    @GetMapping(value = "/incomereport",params = {"sdate","edate","type"}, produces = "application/json")
    public List incomeReport(@RequestParam("sdate")String sdate,@RequestParam("edate")String edate,@RequestParam("type")String type) {
        if (type.equals("Daily")) {
            System.out.println(sdate +"---"+edate);
            return dao.dailyIncomeReportlist(sdate,edate);
        }else
        if (type.equals("Weekly")) {
            return dao.weeklyIncomeReportlist(sdate,edate);  //startdate , enddate
        }else
        if (type.equals("Monthly")) {
            // System.out.println("12345"); //data testing
            return dao.monthlyIncomeReportlist(sdate,edate);
        }else
        if (type.equals("Annually")) {
            return dao.anualyIncomeReportList(sdate,edate);
        }else
            return null;
    }

    //report/monthlysales?startdate=2023-05-01&enddate=2023-05-30
    @GetMapping(value = "/monthlysales",params = {"startdate","enddate"},produces = "application/json")
    public List customerpayments(@RequestParam("startdate")String startdate,@RequestParam("enddate")String enddate){
        return dao.getmonthsales(LocalDate.parse(startdate), LocalDate.parse(enddate));
    }

    //report/dailyusage?startdate=2023-07-01&enddate=2023-07-12
    @GetMapping(value = "/dailyusage",params = {"startdate","enddate"},produces = "application/json")
    public List DailyusageMaterial(@RequestParam("startdate")String startdate,@RequestParam("enddate")String enddate){
        return dao.getusagematerial(LocalDate.parse(startdate), LocalDate.parse(enddate));
    }

    //report/roplist
    @GetMapping(value = "/roplist",produces = "application/json")
    public List Materialrop(){
        return dao.getroplist();
    }

    //  /report/salesbydate
   //Get Sales by date
    @GetMapping(value = "/salesbydate",produces = "application/json")
    public List SalesByDate(){
        return dao.getdailysaleslist();
    }

    //  /report/salesbyyear
    //Get Sales by Year
    @GetMapping(value = "/salesbyyear",produces = "application/json")
    public List SalesByYear(){
        return dao.getannualsaleslist();
    }


    //  /report/salesbyweek
    //Get Sales by Week
    @GetMapping(value = "/salesbyweek",produces = "application/json")
    public List SalesByWeek(){
        return dao.getweeklysaleslist();
    }


    // report/byselecteddateofinventory?statrtdate=2022-04-25&enddate=2022-05-29&type=Daily
//    @GetMapping(value = "/byselecteddateofexpences",params = {"statrtdate","enddate","type"},produces = "application/json")
//    public List byselecteddateofinventory(@RequestParam("statrtdate") String statrtdate, @RequestParam("enddate") String enddate, @RequestParam("type") String type) {
//        if (type.equals("Daily")) {
//            return daoinventory.dailyExpencesReportList(LocalDate.parse(statrtdate), LocalDate.parse(enddate));
//        }else
//        if (type.equals("Weekly")) {
//            return daoinventory.weeklyExpencesReportList(statrtdate, enddate);
//        }else
//        if (type.equals("Monthly")) {
//            return daoinventory.monthlyExpencesReportList(statrtdate, enddate);
//        }else
//        if (type.equals("Annually")) {
//            return daoinventory.anualyExpencesReportList(statrtdate, enddate);
//        }else
//            return null;
//    }


}



