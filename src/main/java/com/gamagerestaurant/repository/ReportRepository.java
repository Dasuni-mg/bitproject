package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.Customerpayment;
import com.gamagerestaurant.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ReportRepository extends JpaRepository<Supplier, Integer> {

    //  @Query(value = "SELECT s.suppliername , s.arreasamount FROM bitproject.supplier as s;" , nativeQuery = true)
    //   List supplierArreasList();

    @Query(value = "SELECT new Supplier(s.fullname,s.arreasamount) FROM Supplier  s")
    List<Supplier> supplierArreasList();

    //Expenses
//    @Query(value = "SELECT YEAR(sp.paiddate),dayname(sp.paiddate), sum(sp.paidamount) FROM gamage_restaurant.spayment as sp WHERE sp.paiddate between ?1 and ?2 group by dayname(sp.paiddate);", nativeQuery = true)
//    List dailyExpencesReportList(LocalDate statrtdate, LocalDate enddate);

    @Query(value = "SELECT dayname(sp.paiddate),sum(sp.paidamount) FROM gamage_restaurant.spayment as sp WHERE sp.paiddate between ?1 and ?2 group by dayname(sp.paiddate)",nativeQuery = true)
    List dailyExpencesReportList(LocalDate parse, LocalDate parse1);

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

    @Query(value = "SELECT sum(paidamount) as monthlysales FROM gamage_restaurant.customerpayment as cp where cp.paiddatetime between ?1 and ?2",nativeQuery = true)
    List  getmonthsales(LocalDate startdate, LocalDate enddate);


    @Query(value = "SELECT r.reservationno,du.usageqty,m.materialname FROM gamage_restaurant.dailyusage as du join gamage_restaurant.material as m on du.material_id = m.id join gamage_restaurant.reservation as r on du.reservation_id =r.id where du.addeddate between ?1 and ?2",nativeQuery = true)
    List getusagematerial(LocalDate parse, LocalDate parse1);


    @Query(value = "SELECT m.materialcode,m.materialname,m.rop,mi.avaqty FROM gamage_restaurant.material as m join gamage_restaurant.materialinventory as mi on m.id = mi.material_id where mi.avaqty <= m.rop",nativeQuery = true)
    List getroplist();












    // Sales Quaries

    //Get sales by date. order by date
    @Query(value = "SELECT DATE(paiddatetime) AS sales_date,SUM(paidamount) AS daily_sales FROM customerpayment GROUP BY DATE(paiddatetime) ORDER BY DATE(paiddatetime) DESC",nativeQuery = true)
    List getdailysaleslist();

    //Get sales by year. order by year
    @Query(value = "SELECT YEAR(paiddatetime) AS sales_year,SUM(paidamount) AS annual_sales FROM customerpayment GROUP BY YEAR(paiddatetime) ORDER BY Year(paiddatetime) DESC",nativeQuery = true)
    List getannualsaleslist();

    //Get sales by Week. order by week
    @Query(value = "SELECT WEEK(paiddatetime) AS sales_week,SUM(paidamount) AS weekly_sales FROM customerpayment GROUP BY week(paiddatetime) ORDER BY week(paiddatetime) DESC",nativeQuery = true)
    List getweeklysaleslist();
}





