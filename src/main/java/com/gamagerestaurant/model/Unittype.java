package com.gamagerestaurant.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name= "unittype")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Unittype {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;


    @Basic(optional = false)
    @Column(name = "name")
    private String name;

}
