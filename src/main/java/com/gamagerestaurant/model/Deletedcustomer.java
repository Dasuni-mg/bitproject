package com.gamagerestaurant.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
//To convert Persistance entity: map class with the db table
@Table(name = "deletedcustomer")
//map Customer class to the customer table
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Deletedcustomer {

    @Id
    //define Id as primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    //autogenerated value
    @Basic(optional = false)
    //not null
    @Column(name = "id")
    //map id attribute to the column name of the customer table
    private Integer id;


    @Column(name = "regno")
    @Basic(optional = false)
    private  String regno;

    @Column(name = "fname")
    @Basic(optional = false)
    private String fname;


    @JoinColumn(name="customerstatus_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch=FetchType.EAGER)
    private Customerstatus customerstatus_id;




}
