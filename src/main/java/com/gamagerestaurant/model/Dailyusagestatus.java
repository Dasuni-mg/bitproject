package com.gamagerestaurant.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name= "dailyusagestatus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dailyusagestatus {

    @Id
    //define Id as primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    //autogenerated value
    @Basic(optional = false)
    //Not Null
    @Column(name = "id")
    //map id attribute to the column name of the dailyremove status table
    private Integer id;


    @Basic(optional = false)
    @Column(name = "name")
    private String name;
}

