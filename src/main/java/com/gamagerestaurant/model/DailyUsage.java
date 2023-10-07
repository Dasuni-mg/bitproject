package com.gamagerestaurant.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "dailyusage")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @JoinColumn(name="reservation_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch=FetchType.EAGER)
    private Reservation reservation_id;


    @JoinColumn(name="material_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch=FetchType.EAGER)
    private Material material_id;


    @Column(name = "usageqty")
    @Basic(optional = false)
    private BigDecimal usageqty;


    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

//    @JoinColumn(name="dailyusagestatus_id",referencedColumnName = "id")
//    @ManyToOne(optional = false,fetch=FetchType.EAGER)
//    private Dailyusagestatus dailyusagestatus_id;




}
