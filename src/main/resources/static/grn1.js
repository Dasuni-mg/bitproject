 window.addEventListener("load", initialize);

//Initializing Functions- run when load the html

function initialize() {
    $('[data-toggle="tooltip"]').tooltip()


    //add/clear/update event handller
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);
    txtQty.addEventListener("keyup", txtQtyCH);
    cmbSupplier.addEventListener("change", cmbSupplierMC);
    cmbPorder.addEventListener("change", cmbPorderMC);
    cmbMaterial.addEventListener("change", cmbMaterialCH);

    txtSearchName.addEventListener("keyup", btnSearchMC);


    privilages = httpRequest("../privilage?module=GRN", "GET");

    //Data list for fill combo box
    //request services and get
    suppliers= httpRequest("../supplier/list", "GET");
    porders = httpRequest("../purchaseorder/list", "GET");
    grnstatuses = httpRequest("../grnstatus/list", "GET");
    employees = httpRequest("../employee/list", "GET");


    //Data list for fill Inner combo box
    materials = httpRequest("../material/list", "GET");



    //colours
    valid = "3px solid #078D27B2";
    invalid = "3px solid red";
    initial = "3px solid #d6d6c2";
    updated = "3px solid #ff9900";
    active = "rgba(250,210,11,0.7)";


    //calling load view function for load veiw side
    loadView();

    //calling load form  function for Refresh form side
    loadForm();

}

function loadView() {

    //Search Area
    txtSearchName.value = "";
    txtSearchName.style.background = "";

    //Table Area
    activerowno = "";
    activepage = 1;
    var query = "&searchtext=";
    loadTable(1, cmbPageSize.value, query);
}

function loadTable(page, size, query) {
    page = page - 1;
    grns = new Array();
    var data = httpRequest("/grn/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) grns = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);

    // fillTable(Tableid,datalist,refillfunction,deletefunction,dataviewfunction)

    fillTable('tblGrn', grns, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblGrn);

    if (activerowno != "") selectRow(tblGrn, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldgrn == null) {
        paginate = true;
    } else {
        if (getErrors() == '' && getUpdates() == '') {
            paginate = true;
        } else {
            paginate = window.confirm("Form has Some Errors or Update Values. " +
                "Are you sure to discard that changes ?");
        }
    }
    if (paginate) {
        activepage = page;
        activerowno = ""
        loadForm();
        loadSearchedTable();
    }

}

// row print
function viewitem(grn, rowno) {

    grn = JSON.parse(JSON.stringify(grn));


    tdGrnCode.innerHTML = grn.grncode;
    tdTAmount.innerHTML = grn.totalamount;
    tdSINo.innerHTML = grn.supplierinvoiceno;
    tdRDate.innerHTML = grn.receiveddate;
    tdDisRatio.innerHTML = grn.discountratio;
    tdNetTotal.innerHTML = grn.nettotal;
       tdporder.innerHTML = grn.porder_id.pordercode;
        tdEmployee.innerHTML = grn.employee_id.callingname;

    $('#GRNViewModal').modal('show');

}

function btnPrintRowMC() {

    var format = printformtable.outerHTML;

    var newwindow = window.open();

    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'/>" +
        "<body><div style='margin-top: 150px'><h1>Porder Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 1000);
}




function cmbSupplierMC(){

    porderbysupplier = httpRequest("purchaseorder/porderlistbysupplier?supplierid=" + JSON.parse(cmbSupplier.value).id, "GET");
    fillCombo(cmbPorder, "Select porder", porderbysupplier, "pordercode", "");
    cmbPorder.disabled=false;

    cmbMaterial.disabled=true;
    txtPPrice.value ="";
    txtQty.value ="";
    txtLtotal.value ="";
    fillCombo(cmbMaterial, "Select Material", materials, "materialname", "");
    cmbMaterial.style.border = initial;
 }

 function cmbPorderMC(){
     materialbyporder = httpRequest("/material/materiallistbyporder?porderid=" + JSON.parse(cmbPorder.value).id, "GET");
     fillCombo(cmbMaterial, "Select Material", materialbyporder, "materialname", "");

     cmbMaterial.disabled=false;
     txtPPrice.value ="";
     txtQty.value ="";
     txtLtotal.value ="";

 }

 function cmbMaterialCH(){
     materialbyporder = httpRequest("/purchaseorderhasmaterial/purchaseorderbymaterial?porderid="+JSON.parse(cmbPorder.value).id + "&materialid=" + JSON.parse(cmbMaterial.value).id, "GET");
     console.log(materialbyporder);
     txtPPrice.value=materialbyporder.purchaseprice;
     grnHasMaterial.purchaseprice=txtPPrice.value;
     txtPPrice.style.border=valid;
     txtPPrice.disabled=false;

 }
 function txtQtyCH(){
     txtLtotal.value=toDecimal(txtPPrice.value*txtQty.value);
     txtLtotal.style.border=valid;
     grnHasMaterial.linetotal=txtLtotal.value;
 }
 function loadForm() {
    grn = new Object();
    oldgrn = null;
    //create array list
    grn.grnHasMaterialList = new Array();

     cmbMaterial.disabled=false;

    fillCombo(cmbPorder, "Select porder", porders, "pordercode", "");
    fillCombo(cmbSupplier, "Select supplier", suppliers, "fullname", "");




    nextgrn = httpRequest("../grn/nextgrn", "GET");
    txtGRNCode.value = nextgrn.grncode;
    grn.grncode = txtGRNCode.value;
    txtGRNCode.disabled = true;


    txtTAmount.value = "0.00";
    txtTAmount.disabled = true;
    grn.totalamount = txtTAmount.value;

    txtDisRatio.value = "0";
    grn.discountratio = txtDisRatio.value;

    txtNTotal.value = "0.00";
    txtNTotal.disabled = true;
    grn.nettotal = txtNTotal.value;

    //text field Empty

    txtSINo.value = "";
    dteRDate.value = "";

// set field to initial color
    setStyle(initial);
    txtGRNCode.style.border = valid;
    txtTAmount.style.border = valid;
    txtNTotal.style.border = valid;
    txtDisRatio.style.border = valid;


    disableButtons(false, true, true);

    refreshInnerForm();
}

function refreshInnerForm() {

    grnHasMaterial = new Object();
    oldgrnHasMaterial = null;

    var totalamount = 0.00;

    txtPPrice.value =toDecimal("0");
    txtPPrice.disabled=true;
    txtQty.value ="0";
    txtLtotal.value ="0";
    txtLtotal.disabled =true;

    txtPPrice.style.border = initial;
    txtQty.style.border = initial;
    txtLtotal.style.border = initial;


    //inner form
    //autofill combo box
    fillCombo(cmbMaterial, "Select Material", materials, "materialname", "");
    cmbMaterial.style.border = initial;

    //Inner table
    fillInnerTable('tblInnerMaterial', grn.grnHasMaterialList, innerModify, innerDelete, false);


    //delete in inner table
    if (grn.grnHasMaterialList != 0) {
         for (var index in grn.grnHasMaterialList) {
             totalamount = parseFloat(totalamount) + parseFloat(grn.grnHasMaterialList[index].linetotal)
         }
     }

    txtTAmount.value = toDecimal(totalamount);
    txtTAmount.disabled = true;
    grn.totalamount = txtTAmount.value;

    if(oldgrn != null &&  grn.totalamount !=  oldgrn.totalamount){
        txtTAmount.style.border = updated;
    }else {
        txtTAmount.style.border = valid;
    }
}

function getErrorsInner() {
    var errors = "";
    addvalue = "";

    if (grnHasMaterial.material_id == null) {
        cmbMaterial.style.border = invalid;
        errors = errors + "\n" + "Material not Selected";
    } else addvalue = 1;

    if (grnHasMaterial.qty == null) {
        txtQty.style.border = invalid;
        errors = errors + "\n" + "Quantity not Entered";
    } else addvalue = 1;

    if (grnHasMaterial.purchaseprice == null) {
        txtPPrice.style.border = invalid;
        errors = errors + "\n" + "Purchase price not Entered";
    } else addvalue = 1;

    if (grnHasMaterial.linetotal == null) {
        txtLtotal.style.border = invalid;
        errors = errors + "\n" + "Line total not Entered";
    } else addvalue = 1;

    return errors;
}

function btnInnerAddMC() {
    var itmext = false;

    if (getErrorsInner() == "") {
        for (var index in grn.grnHasMaterialList) {
            if (grn.grnHasMaterialList[index].material_id.materialname == grnHasMaterial.material_id.materialname) {
                itmext = true;
                break;
            }
        }
        if (itmext) {
            swal({
                title: "Already exist!",
                icon: "warning",
                text: '\n',
                button: false,
                timer: 1200,
            });
        } else {
            console.log()
            grn.grnHasMaterialList.push(grnHasMaterial);
            refreshInnerForm();
        }
    } else {
        swal({
            title: "You have following errors",
            text: "\n" + getErrorsInner(),
            icon: "error",
            buttons: true,
        })
    }
}

function innerModify() {
}

function innerDelete(innerob, innerrow) {
    swal({
        title: "Are you sure to remove Item?",
        text: "\nItem Name : " + innerob.material_id.materialname,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            grn.grnHasMaterialList.splice(innerrow, 1);
            refreshInnerForm();
        }
    });
}

function setStyle(style) {


    txtGRNCode.style.border = style;
    txtTAmount.style.border = style;
    txtSINo.style.border = style;
    dteRDate.style.border = style;
    txtTAmount.style.border = style;
    txtDisRatio.style.border = style;
    txtNTotal.style.border = style;

    cmbPorder.style.border = style;


}

function disableButtons(add, upd, del) {

    if (add || !privilages.add) {
        btnAdd.setAttribute("disabled", "disabled");
        $('#btnAdd').css('cursor', 'not-allowed');
    } else {
        btnAdd.removeAttribute("disabled");
        $('#btnAdd').css('cursor', 'pointer')
    }

    if (upd || !privilages.update) {
        btnUpdate.setAttribute("disabled", "disabled");
        $('#btnUpdate').css('cursor', 'not-allowed');
    } else {
        btnUpdate.removeAttribute("disabled");
        $('#btnUpdate').css('cursor', 'pointer');
    }

    if (!privilages.update) {
        $(".buttonup").prop('disabled', true);
        $(".buttonup").css('cursor', 'not-allowed');
    } else {
        $(".buttonup").removeAttr("disabled");
        $(".buttonup").css('cursor', 'pointer');
    }

    if (!privilages.delete) {
        $(".buttondel").prop('disabled', true);
        $(".buttondel").css('cursor', 'not-allowed');
    } else {
        $(".buttondel").removeAttr("disabled");
        $(".buttondel").css('cursor', 'pointer');
    }

    // select deleted data row
    for (index in grns) {
        if (grns[index].grnstatus_id.name == "Deleted") {
            tblGrn.children[1].children[index].style.color = "#f00";
            tblGrn.children[1].children[index].style.border = "2px solid red";
            tblGrn.children[1].children[index].lastChild.children[1].disabled = true;
            tblGrn.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }
}

//get errors when click the Add button
function getErrors() {

    var errors = "";
    addvalue = "";

    if (grn.supplierinvoiceno == null)
        errors = errors + "\n" + "Supplier Invoice No not Enter";
    else addvalue = 1;

    if (grn.receiveddate == null)
        errors = errors + "\n" + "Received Date not Enter";
    else addvalue = 1;

    if (grn.totalamount == null)
        errors = errors + "\n" + "Total Amount not Enter";
    else addvalue = 1;

    if (grn.nettotal == null)
        errors = errors + "\n" + "Discount Ratio not Entered";
    else addvalue = 1;

    if (grn.discountratio == null)
        errors = errors + "\n" + "Net total not Entered";
    else addvalue = 1;


    if (grn.supplierinvoiceno == null)
        errors = errors + "\n" + "Supplier Invoice No not Enter";
    else addvalue = 1;

    // msg for fill data in innertable
    if (grn.grnHasMaterialList.length == 0) {
        errors = errors + "\n" + "Material not added";
    } else addvalue = 1;
    return errors;

}

function checkValidation() {

    addvalue = "";

    if (grn.supplierinvoiceno == null)
        errors = errors + "\n" + "Supplier Invoice No not Enter";
    else addvalue = 1;

    if (grn.receiveddate == null)
        errors = errors + "\n" + "Received Date not Enter";
    else addvalue = 1;

    if (grn.totalamount == null)
        errors = errors + "\n" + "Total Amount not Enter";
    else addvalue = 1;

    if (grn.nettotal == null)
        errors = errors + "\n" + "Discount Ratio not Entered";
    else addvalue = 1;

    if (grn.discountratio == null)
        errors = errors + "\n" + "Net total not Entered";
    else addvalue = 1;



    if (grn.supplierinvoiceno == null)
        errors = errors + "\n" + "Supplier Invoice No not Enter";
    else addvalue = 1;

    // msg for fill data in innertable
    if (grn.grnHasMaterialList.length == 0) {
        errors = errors + "\n" + "Material not added";
    } else addvalue = 1;
}

//Add-click the Add button
function btnAddMC() {

    if (getErrors() == "") {
                    savedata();
           } else {
        swal({
            title: "You have following errors",
            text: "\n" + getErrors(),
            icon: "error",
            button: true,
        });

    }
}

//Add-Save data in to the database
function savedata() {

    swal({
        title: "Are you sure to add following grn...?",
        text:
            "\n Grn Code: " + grn.grncode +
            "\n Total Amount : " + grn.totalamount +
            "\n Supplier Invoice: " + grn.supplierinvoiceno +
            "\nReceived date : " + grn.receiveddate +
            "\nDiscount Ratio : " + grn.discountratio +
            "\nNet Total : " + grn.nettotal +
            "\nPorder: " + grn.porder_id.pordercode,


        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/grn", "POST", grn);
            if (response == "0") {
                swal({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been Done \n Save SuccessFully..!',
                    text: '\n',
                    button: false,
                    timer: 1200
                });
                activepage = 1;
                activerowno = 1;
                loadSearchedTable();
                loadForm();
                $('#tableview').modal('show');
            } else swal({
                title: 'Save not Success... , You have following errors', icon: "error",
                text: '\n ' + response,
                button: true
            });
        }
    });

}

function btnClearMC() {
    //Get Cofirmation from the User window.confirm();
    checkerr = getErrors();

    if (oldgrn == null && addvalue == "") {
        loadForm();
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                loadForm();
            }

        });
    }

}

//update
function fillForm(grnote, rowno) {
    activepage = rowno;

    if (oldgrn == null) {
        filldata(grnote);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(grnote);
            }

        });
    }
}

//update- refill data into form
function filldata(grnote) {

    clearSelection(tblGrn);
    selectRow(tblGrn, activepage, active);

    grn = JSON.parse(JSON.stringify(grnote));
    oldgrn = JSON.parse(JSON.stringify(grnote));


    txtGRNCode.value = grn.grncode;
    txtTAmount.value = grn.totalamount;
    txtSINo.value = grn.supplierinvoiceno;
    dteRDate.value = grn.receiveddate;
    txtDisRatio.value = grn.discountratio;
    txtNTotal.value = grn.nettotal;


    fillCombo(cmbPorder, "", porders, "pordercode", grn.porder_id.pordercode);


    disableButtons(true, false, false);
    setStyle(valid);
    refreshInnerForm()

    //show the modal with fill data after add update button
    $('#tableview').modal('hide');


}

//Update-Display updated values msg
function getUpdates() {

    var updates = "";

    if (grn != null && oldgrn != null) {

        if (grn.grncode != oldgrn.grncode)
            updates = updates + "\ngrn Code is Changed";

        if (grn.supplierinvoiceno != oldgrn.supplierinvoiceno)
            updates = updates + "\nsupplierinvoiceno is Changed";

        if (grn.receiveddate != oldgrn.receiveddate)
            updates = updates + "\nReceiveddate is Changed";

        if (grn.totalamount != oldgrn.totalamount)
            updates = updates + "\ntotalamount is Changed";

        if (grn.discountratio != oldgrn.discountratio)
            updates = updates + "\nDiscountratio is Changed";

        if (grn.nettotal != oldgrn.nettotal)
            updates = updates + "\nNet total is Changed";

               if (grn.porder_id.pordercode != oldgrn.porder_id.pordercode)
            updates = updates + "\nPorder is Changed";

        if (grn.employee_id.callingname != oldgrn.employee_id.callingname)
            updates = updates + "\nEmployee is Changed";

    }

    return updates;

}

function btnUpdateMC() {
    var errors = getErrors();
    if (errors == "") {
        var updates = getUpdates();
        if (updates == "")
            swal({
                title: 'Nothing Updated..!', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
        else {
            swal({
                title: "Are you sure to update following Porder details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/grn", "PUT", grn);
                        if (response == "0") {
                            swal({
                                position: 'center',
                                icon: 'success',
                                title: 'Your work has been Done \n Update SuccessFully..!',
                                text: '\n',
                                button: false,
                                timer: 1200
                            });
                            loadSearchedTable();
                            loadForm();
                            $('#tableview').modal('show'); //hide the model after update

                        } else window.alert("Failed to Update as \n\n" + response);
                    }
                });
        }
    } else
        swal({
            title: 'You have following errors in your form', icon: "error",
            text: '\n ' + getErrors(),
            button: true
        });

}

//Delete
function btnDeleteMC(grn) {
    grn = JSON.parse(JSON.stringify(grn));

    swal({
        title: "Are you sure to delete following porder...?",
        text:
            "\n Grn Code: " + grn.grncode +
            "\n Total Amount : " + grn.totalamount +
            "\n Supplier Invoice: " + grn.supplierinvoiceno +
            "\nReceived date : " + grn.receiveddate +
            "\nDiscount Ratio : " + grn.discountratio +
            "\nNet Total : " + grn.nettotal +

            "\nPorder: " + grn.porder_id.pordercode,

        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/grn", "DELETE", grn);
            if (responce == 0) {
                swal({
                    title: "Deleted Successfully....!",
                    text: "\n\n  Status change to delete",
                    icon: "success", button: false, timer: 1200,
                });
                loadSearchedTable();
                loadForm();
            } else {
                swal({
                    title: "You have following erros....!",
                    text: "\n\n" + responce,
                    icon: "error", button: true,
                });
            }
        }
    });

}

function loadSearchedTable() {

    var searchtext = txtSearchName.value;

    var query = "&searchtext=";

    if (searchtext != "")
        query = "&searchtext=" + searchtext;
    //window.alert(query);
    loadTable(activepage, cmbPageSize.value, query);
    disableButtons(false, true, true);
}

function btnSearchMC() {
    activepage = 1;
    loadSearchedTable();
}

function loadSearchedTable() {

    var searchtext = txtSearchName.value;

    var query = "&searchtext=";

    if (searchtext != "")
        query = "&searchtext=" + searchtext;
    //window.alert(query);
    loadTable(activepage, cmbPageSize.value, query);

}

function btnPrintTableMC(grn) {

    //open new tab USING window.open() in the browser
    var newwindow = window.open();

    //put the outerhtml of the tblPorder in to formattab variable
    formattab = tblGrn.outerHTML;

    //write print table in the new tab using .document.write
    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Grn Details : </h1></div>" +
        "<div>" + formattab + "</div>" +
        "</body>" +
        "</html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 1500);
}

function sortTable(cind) {
    cindex = cind;

    var cprop = tblEmployee.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        employees.sort(
            function (a, b) {
                if (a[cprop] < b[cprop]) {
                    return -1;
                } else if (a[cprop] > b[cprop]) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
    } else {
        employees.sort(
            function (a, b) {
                if (a[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)] < b[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)]) {
                    return -1;
                } else if (a[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)] > b[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)]) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
    }
    fillTable('tblEmployee', employees, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblEmployee);
    loadForm();

    if (activerowno != "") selectRow(tblEmployee, activerowno, active);


}