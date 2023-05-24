package com.gamagerestaurant.controller;



import com.gamagerestaurant.model.Supplier;
import com.gamagerestaurant.repository.ReportRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/report")
public class ReportController {

    @Autowired
    private ReportRepository dao;

    // get Mapping For get supplier Arreas amount
    @GetMapping(value = "/supplierarreas", produces = "application/json")
    public List<Supplier> supplierArreasList(){
        return dao.supplierArreasList();
    }

    // report/byselecteddateofexpences?sDate=2022-01-01&endDate=2022-05-01&type=Daily
    @GetMapping(value = "/byselecteddateofexpences",params = {"sDate","endDate","type"},produces = "application/json")
    public List byselecteddateofexpences(@RequestParam("sDate") String sDate, @RequestParam("endDate") String endDate, @RequestParam("type") String type) {
        if (type.equals("Daily")) {
            return dao.dailyExpencesReportList(sDate, endDate);
        }else
        if (type.equals("Weekly")) {
            return dao.weeklyExpencesReportList(sDate, endDate);
        }else
        if (type.equals("Monthly")) {
            return dao.monthlyExpencesReportList(sDate, endDate);
        }else
        if (type.equals("Annually")) {
            return dao.anualyExpencesReportList(sDate, endDate);
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

}
