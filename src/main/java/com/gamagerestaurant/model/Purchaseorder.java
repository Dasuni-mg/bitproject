package com.gamagerestaurant.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Table(name="porder")

@AllArgsConstructor
@NoArgsConstructor

public class Purchaseorder {
    @Id
    //define Id as primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    //autogenerated value
    @Basic(optional = false)
    //not null
    @Column(name = "id")
    //map id attribute to the column name of the customer table
    private Integer id;

    @Column(name="pordercode")
    @Basic(optional = false)
    private String pordercode;

    @Column(name="requireddate")
    @Basic(optional = false)
    private LocalDate requireddate;

    @Column(name="totalamount")
    @Basic(optional = false)
    private BigDecimal totalamount;

    @Column(name="addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @Column(name="description")
    @Basic(optional = false)
    private String description;

    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    @JoinColumn(name="porderstatus_id",referencedColumnName ="id")
    private Purchaseorderstatus porderstatus_id;


    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    @JoinColumn(name="supplier_id",referencedColumnName ="id")
    private Supplier supplier_id;

    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    @JoinColumn(name="quotation_id",referencedColumnName ="id")
    private Quotation quotation_id;

    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    @JoinColumn(name="employee_id",referencedColumnName ="id")
    private Employee employee_id;

    @OneToMany(cascade =CascadeType.ALL,mappedBy = "porder_id" ,fetch = FetchType.LAZY, orphanRemoval = true)
    private List<PurchaseorderHasMaterial> purchaseorderHasMaterialList;


    public  Purchaseorder(Integer id,String pordercode,Supplier supplier_id){
        this.id=id;
        this.pordercode=pordercode;
        this.supplier_id=supplier_id;
    }

    public Purchaseorder(String pordercode){
        this.pordercode = pordercode;
    }
    public Purchaseorder(Integer id,String pordercode){
        this.id = id;
        this.pordercode = pordercode;
    }
}
