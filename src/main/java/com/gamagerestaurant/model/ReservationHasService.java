package com.gamagerestaurant.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "reservation_has_service")
@AllArgsConstructor
@NoArgsConstructor
public class ReservationHasService{

    @Id
    //define Id as primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    //autogenerated value
    @Basic(optional = false)
    //not null
    @Column(name = "id")
    //map id attribute to the column name of the customer table
    private Integer id;

    @Column(name = "menuprice")
    @Basic(optional = true)
    private BigDecimal menuprice;

    @Column(name = "ordercount")
    @Basic(optional = true)
    private Integer ordercount;

    @Column(name = "linetotal")
    @Basic(optional = true)
    private BigDecimal linetotal;


    @Column(name="submenuprice")
    @Basic(optional = true)
    private BigDecimal submenuprice;

    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "reservation_id", referencedColumnName = "id")
    @JsonIgnore
    private Reservation reservation_id;

    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "menu_id", referencedColumnName = "id")
    private Menu menu_id;

    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "submenucategory_id", referencedColumnName = "id")
    private Submenucategory submenucategory_id;

    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "menucategory_id", referencedColumnName = "id")
    private Menucategory menucategory_id;

    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "submenu_id", referencedColumnName = "id")
    private Submenu submenu_id;



}