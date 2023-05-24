package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReportRepository extends JpaRepository<Supplier, Integer> {

    //  @Query(value = "SELECT s.suppliername , s.arreasamount FROM bitproject.supplier as s;" , nativeQuery = true)
    //   List supplierArreasList();

    @Query(value = "SELECT new Supplier(s.fullname,s.arreasamount) FROM Supplier  s")
    List<Supplier> supplierArreasList();

    //Expenses
    @Query(value = "SELECT YEAR(sp.paiddate),dayname(sp.paiddate), sum(sp.paidamount) FROM gamage_restaurant.spayment as sp WHERE sp.paiddate between ?1 and ?2 group by dayname(sp.paiddate);", nativeQuery = true)
    List dailyExpencesReportList(String sDate, String endDate);

    @Query(value = "SELECT YEAR(sp.paiddate),week(sp.paiddate), sum(sp.paidamount) FROM gamage_restaurant.spayment as sp WHERE sp.paiddate between ?1 and ?2 group by week(sp.paiddate);", nativeQuery = true)
    List weeklyExpencesReportList(String sDate, String endDate);

    @Query(value = "SELECT YEAR(sp.paiddate),monthname(sp.paiddate), sum(sp.paidamount) FROM gamage_restaurant.spayment as sp WHERE sp.paiddate between ?1 and ?2 group by monthname(sp.paiddate);", nativeQuery = true)
    List monthlyExpencesReportList(String sDate, String endDate);

    @Query(value = "SELECT YEAR(sp.paiddate),year(sp.paiddate), sum(sp.paidamount) FROM gamage_restaurant.spayment as sp WHERE sp.paiddate between ?1 and ?2 group by year(sp.paiddate);", nativeQuery = true)
    List anualyExpencesReportList(String sDate, String endDate);

    //Income

    @Query(value = "select weekday(cp.paiddatetime),date(cp.paiddatetime), sum(cp.paidamount) FROM christo_racks.customerpayment as cp where date(cp.paiddatetime) between ?0 and ?1 group by date(cp.paiddatetime);" ,nativeQuery = true)
    List dailyIncomeReportlist(String sdate,String edate);

    @Query(value = "select week(cp.paiddatetime),date(cp.paiddatetime), sum(cp.paidamount) FROM christo_racks.customerpayment as cp where date(cp.paiddatetime) between ?0 and ?1 group by week(cp.paiddatetime);" ,nativeQuery = true)
    List weeklyIncomeReportlist(String sdate,String edate);

    @Query(value = "select monthname(cp.paiddatetime),date(cp.paiddatetime),sum(cp.paidamount) FROM christo_racks.customerpayment as cp where cp.paiddatetime between ?1 and ?2 group by month(cp.paiddatetime);" ,nativeQuery = true)
    List monthlyIncomeReportlist(String sdate,String edate);

    @Query(value = "select year(cp.paiddatetime),date(cp.paiddatetime), sum(cp.paidamount) FROM christo_racks.customerpayment as cp where cp.paiddatetime between ?1 and ?2 group by year(cp.paiddatetime);" ,nativeQuery = true)
    List anualyIncomeReportList(String sdate,String edate);




}





