package com.gamagerestaurant.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name="menu_has_submenu")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuHasSubmenu {

    @Id
    //define Id as primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    //autogenerated value
    @Basic(optional = false)
    //Not Null
    @Column(name = "id")
    //map id attribute to the column name of the grn_has_material table
    private Integer id ;



    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    @JoinColumn(name="menu_id",referencedColumnName ="id")
    @JsonIgnore
    private Menu menu_id;

    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    @JoinColumn(name="submenu_id",referencedColumnName ="id")
    private Submenu submenu_id;

    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    @JoinColumn(name="submenucategory_id",referencedColumnName ="id")
    private Submenucategory submenucategory_id ;
}
