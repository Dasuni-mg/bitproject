window.addEventListener("load", initialize);

//Initializing Functions- run when load the html
function initialize() {
    $('[data-toggle="tooltip"]').tooltip()


    //add/clear/update event handller
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);
    txtSearchName.addEventListener("keyup", btnSearchMC);
    cmbQuotation.addEventListener("change", cmbQuotationMC);
    cmbSupplier.addEventListener("change", cmbSupplierMC);

    cmbMaterial.addEventListener("change", cmbMaterialCH);
    txtQty.addEventListener("keyup", txtQtyCH);

    privilages = httpRequest("../privilage?module=PORDER", "GET");

    //Data list for fill combo box
    //request services and get
    suppliers = httpRequest("../supplier/list", "GET");
    porderstatuses = httpRequest("../porderstatus/list", "GET");
    quotations = httpRequest("../quotation/list", "GET");
    employees = httpRequest("../employee/list", "GET");


    //Data list for fill Inner combo box
    materials = httpRequest("../material/list", "GET");


    //colours
    valid = "3px solid #00f000";
    invalid = "3px solid red";
    initial = "3px solid #d6d6c2";
    updated = "3px solid #ff9900";
    active = "rgba(246,215,52,0.7)";

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
    purchaseorders = new Array();
    var data = httpRequest("/purchaseorder/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) purchaseorders = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);

    // fillTable(Tableid,datalist,refillfunction,deletefunction,dataviewfunction)

    fillTable('tblPorder', purchaseorders, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblPorder);

    if (activerowno != "") selectRow(tblPorder, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldpurchaseorder == null) {
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
function viewitem(pod, rowno) {

    purchaseorder = JSON.parse(JSON.stringify(pod));


    tdPCode.innerHTML = purchaseorder.pordercode;
    tdSupplier.innerHTML = purchaseorder.supplier_id.fullname;
    tdQuotation.innerHTML = purchaseorder.quotation_id.quotationcode;
    tdRDate.innerHTML = purchaseorder.requireddate;
    tdTAmount.innerHTML = purchaseorder.totalamount;
    tdPStatus.innerHTML = purchaseorder.porderstatus_id.name;
    tdemployee.innerHTML = purchaseorder.employee_id.callingname;
    tdAddDate.innerHTML = purchaseorder.addeddate;
    tddescription.innerHTML = purchaseorder.description;

    $('#dataViewModal').modal('show');

}

function btnPrintRowMC() {

    var format = printformtable.outerHTML;

    var newwindow = window.open();

    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'/>" +
        "<body><div style='margin-top: 150px'><h1>Porder Details :</h1></div>" +
        "<div>"+format+"</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {newwindow.print(); newwindow.close();},1000);
}

// quotation list by  particular supplier
//[/quotation/quotationlistbysupplier?supplierid=]
function cmbSupplierMC(){
    quotationbysupplier = httpRequest("/quotation/quotationlistbysupplier?supplierid=" + JSON.parse(cmbSupplier.value).id, "GET");
    fillCombo(cmbQuotation, "Select quotation", quotationbysupplier, "quotationcode", "");
    cmbQuotation.disabled=false;

    txtPPrice.value ="";
    txtQty.value ="";
    txtLtotal.value ="";
    fillCombo(cmbMaterial, "Select Material", materials, "materialname", "");
    cmbMaterial.style.border = initial;

}

// material list by selecting a particular quotation
//[/material/materiallistbyquotation?quotationid=]
function cmbQuotationMC(){
    materialbyquotation = httpRequest("/material/materiallistbyquotation?quotationid=" + JSON.parse(cmbQuotation.value).id, "GET");
    fillCombo(cmbMaterial, "Select Material", materialbyquotation, "materialname", "");

    cmbMaterial.disabled=false;
    txtPPrice.value ="";
    txtQty.value ="";
    txtLtotal.value ="";
}

// material list by selecting a particular quotation for get purchase prices
//[/quotationhasmaterial/porderlistbyquotation?quotationid=]
function cmbMaterialCH(){
    materialbyquotation = httpRequest("/quotationhasmaterial/quotaionmaterial?quotationid="+JSON.parse(cmbQuotation.value).id + "&materialid=" + JSON.parse(cmbMaterial.value).id, "GET");
    console.log(materialbyquotation);
    txtPPrice.value=materialbyquotation[0].purchaseprice;
    purchaseorderHasMaterial.purchaseprice=txtPPrice.value;
    txtPPrice.style.border=valid;

}

//Auto generate total amount when enter QTY,linetotal
function txtQtyCH(){
    txtLtotal.value=toDecimal(txtQty.value*txtPPrice.value);
    txtLtotal.style.border=valid;
    purchaseorderHasMaterial.linetotal=txtLtotal.value;
}

function loadForm() {
    purchaseorder = new Object();
    oldpurchaseorder = null;
    //create array list
    purchaseorder.purchaseorderHasMaterialList = new Array();

    fillCombo(cmbSupplier, "Select supplier", suppliers, "fullname", "");
    fillCombo(cmbQuotation, "Select quotation", quotations, "quotationcode", "");
    cmbQuotation.disabled=true;

    //Auto fill combo box
    fillCombo(cmbEmployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    purchaseorder.employee_id = JSON.parse(cmbEmployee.value);
    cmbEmployee.disabled = true;

    fillCombo(cmbporderstatus, "Select poder status", porderstatuses, "name", "Ordered");
    purchaseorder.porderstatus_id = JSON.parse(cmbporderstatus.value);
    cmbporderstatus.disabled = true;

    //create date object
    var today = new Date();
    //get month--> array(0-11)
    var month = today.getMonth() + 1;
    //browser format of month is YYYY-MM-DD(jan-01,feb-02,..)
    if (month < 10) month = "0" + month; //YYYY-MM-DD
    //browser format of date is YYYY-MM-DD(01,02,..)
    //get date-->range(1-31)
    var date = today.getDate();
    if (date < 10) date = "0" + date;//YYYY-MM-DD

    dteAddeddate.value = today.getFullYear() + "-" + month + "-" + date;
    purchaseorder.addeddate = dteAddeddate.value;
    dteAddeddate.disabled = true;

    //received date for one week
    //Currnt dte ek arn varible ekk hdnw
    let tody = new Date();

    //Currnt dte ek arn varible ekk hdnw
    let afteroneweek = new Date();

    //afteronemonth variable ekt apit oon dws gaana set krnw
    afteroneweek.setDate(tody.getDate() + 7);
    // |tody.getDate() - 30| --> Ad dte ek arn eekn dws 30k adu krnw

    //Month ek arn varible ekk hdnw
    let rmnth = afteroneweek.getMonth() + 1; //Array [0-11] en hind 1k ekthu krnw (0+1)

    if(rmnth < 10)
        rmnth = "0" + rmnth

    //Day ek arn varible ekk hdnw
    let rday = afteroneweek.getDate(); //Return type ek range ekk (1-29/30/31)

    if(rday < 10)
        rday = "0" + rday

    txtRDate.max = afteroneweek.getFullYear() + "-" + rmnth + "-" + rday;
    txtRDate.min = nowDate('date');



//auto generated porer code
    nextpo = httpRequest("../purchaseorder/nextpo","GET");
    txtPCode.value = nextpo.pordercode;
    purchaseorder.pordercode = txtPCode.value;
    txtPCode.disabled = true;


    txtTAmount.value = "0.00";
    txtTAmount.disabled = true;
    purchaseorder.totalamount = txtTAmount.value;

    //text field Empty
    txtRDate.value = "";
    txtDescription.value = "";

    // set field to initial color
    setStyle(initial);

    dteAddeddate.style.border = valid;
    cmbEmployee.style.border = valid;
    cmbporderstatus.style.border = valid;
    txtPCode.style.border = valid;
    txtTAmount.style.border = valid;


    disableButtons(false, true, true);

    refreshInnerForm();
}

function refreshInnerForm() {

    purchaseorderHasMaterial = new Object();
    oldpurchaseorderHasMaterial = null;

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
    fillInnerTable('tblInnerMaterial', purchaseorder.purchaseorderHasMaterialList, innerModify, innerDelete, false);


    if (purchaseorder.purchaseorderHasMaterialList != 0) {
        for (var index in purchaseorder.purchaseorderHasMaterialList) {
            totalamount = parseFloat(totalamount) + parseFloat(purchaseorder.purchaseorderHasMaterialList[index].linetotal)
        }
    }

    txtTAmount.value = toDecimal(totalamount);
    txtTAmount.disabled = true;
    purchaseorder.totalamount = txtTAmount.value;

    if(oldpurchaseorder != null &&  purchaseorder.totalamount !=  oldpurchaseorder.totalamount){
        txtTAmount.style.border = updated;
    }else {
        txtTAmount.style.border = valid;
    }
    cmbMaterial.disabled =true;
}

function btnInnerAddMC() {
    var itmext = false;

    for (var index in purchaseorder.purchaseorderHasMaterialList) {
        if (purchaseorder.purchaseorderHasMaterialList[index].material_id.materialname == purchaseorderHasMaterial.material_id.materialname) {
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
        purchaseorder.purchaseorderHasMaterialList.push(purchaseorderHasMaterial);
        refreshInnerForm();
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
            purchaseorder.purchaseorderHasMaterialList.splice(innerrow, 1);
            refreshInnerForm();
        }
    });
}

function setStyle(style) {

    txtPCode.style.border = style;
    txtRDate.style.border = style;
    txtTAmount.style.border = style;
    dteAddeddate.style.border = style;
    txtDescription.style.border = style;
    cmbSupplier.style.border = style;
    cmbQuotation.style.border = style;
    cmbporderstatus.style.border = style;
    cmbEmployee.style.border = style;
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
    for (index in purchaseorders) {
        if (purchaseorders[index].porderstatus_id.name == "Deleted") {
            tblPorder.children[1].children[index].style.color = "#f00";
            tblPorder.children[1].children[index].style.border = "2px solid red";
            tblPorder.children[1].children[index].lastChild.children[1].disabled = true;
            tblPorder.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

//get errors when click the Add button
function getErrors() {

    var errors = "";
    addvalue = "";

    if (purchaseorder.pordercode == null)
        errors = errors + "\n" + "purchaseorder code  Not Enter";
    else addvalue = 1;

    if (purchaseorder.requireddate == null)
        errors = errors + "\n" + "Requireddate not Enter";
    else addvalue = 1;

    if (purchaseorder.addeddate == null)
        errors = errors + "\n" + "Added Date not Enter";
    else addvalue = 1;

    if (purchaseorder.totalamount == null)
        errors = errors + "\n" + "Total Amount not Enter";
    else addvalue = 1;

    if (purchaseorder.supplier_id == null)
        errors = errors + "\n" + "Supplier not selected";
    else addvalue = 1;

    if (purchaseorder.quotation_id == null)
        errors = errors + "\n" + "Quotation not selected";
    else addvalue = 1;


    // msg for fill data in innertable
    if (purchaseorder.purchaseorderHasMaterialList.length == 0) {
        cmbMaterial.style.border = invalid;
        errors = errors + "\n" + "SPorder material not added";
    } else addvalue = 1;
    return errors;

}

//Add-click the Add button
function btnAddMC() {

    if (getErrors() == "") {
        if (txtDescription.value == "") {
            swal({
                title: "Are you sure to continue...?",
                text: "Form has some empty fields.....",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    savedata();
                }
            });

        } else {
            savedata();
        }
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
    console.log(purchaseorder)
    swal({
        title: "Are you sure to add following purchaseorder...?",
        text: "\n Porder Code: " + purchaseorder.regno +
            "\n Supplier : " + purchaseorder.supplier_id.fullname +
            "\n Quotation : " + purchaseorder.quotation_id.quotationcode +
            "\nRequired date : " + purchaseorder.requireddate +
            "\nAdded Date: " + purchaseorder.addeddate,


        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/purchaseorder", "POST", purchaseorder);
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
                $('#formModal').modal('hide');
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

    if (oldemployee == null && addvalue == "") {
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
function fillForm(pod, rowno) {
    activepage = rowno;

    if (oldpurchaseorder == null) {
        filldata(pod);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(pod);
            }

        });
    }

}

//update- refill data into form
function filldata(pod) {
    clearSelection(tblPorder);
    selectRow(tblPorder, activepage, active);

    purchaseorder = JSON.parse(JSON.stringify(pod));
    oldpurchaseorder = JSON.parse(JSON.stringify(pod));


    txtPCode.value = purchaseorder.pordercode;
    txtRDate.value = purchaseorder.requireddate;
    txtTAmount.value = purchaseorder.totalamount;
    dteAddeddate.value = purchaseorder.addeddate;
    txtDescription.value = purchaseorder.description;



    fillCombo(cmbSupplier, "Select a supplier", suppliers, "fullname", purchaseorder.supplier_id.fullname);
    fillCombo(cmbQuotation, "Select Quotation ", quotations, "quotationcode", purchaseorder.quotation_id.quotationcode);
    fillCombo(cmbEmployee, "Select Employee", employees, "callingname", purchaseorder.employee_id.callingname);
    fillCombo(cmbporderstatus, "Select porderstatus", porderstatuses, "name", purchaseorder.porderstatus_id.name);


    disableButtons(true, false, false);
    setStyle(valid);
    refreshInnerForm()
    $('#formModal').modal('show');


    //Optional fields initial colour
    if(purchaseorder.description == null)
        txtDescription.style.border= initial;
}

//Update-Display updated values msg
function getUpdates() {

    var updates = "";

    if (purchaseorder !=null && oldpurchaseorder !=null) {

        if (purchaseorder.pordercode != oldpurchaseorder.pordercode)
            updates = updates + "\npurchaseorder Code is Changed";

        if (purchaseorder.requireddate != oldpurchaseorder.requireddate)
            updates = updates + "\nRequired Date is Changed";

        if (purchaseorder.totalamount != oldpurchaseorder.totalamount)
            updates = updates + "\nTotal Amount is Changed";

        if (purchaseorder.addeddate != oldpurchaseorder.addeddate)
            updates = updates + "\nAdded Date is Changed";

        if (purchaseorder.description != oldpurchaseorder.description)
            updates = updates + "\nDescription is Changed";

        if (purchaseorder.porderstatus_id.name != oldpurchaseorder.porderstatus_id.name)
            updates = updates + "\npurchaseorder Request is Changed";

        if (purchaseorder.supplier_id.fullname != oldpurchaseorder.supplier_id.fullname)
            updates = updates + "\npurchaseorder  is Changed";

        if (purchaseorder.quotation_id.quotationcode != oldpurchaseorder.quotation_id.quotationcode)
            updates = updates + "\nQuotation is Changed";

        if (purchaseorder.employee_id.callingname != oldpurchaseorder.employee_id.callingname)
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
                        var response = httpRequest("/purchaseorder", "PUT", purchaseorder);
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
                            changeTab('table');

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

function btnDeleteMC(pod) {
    purchaseorder = JSON.parse(JSON.stringify(pod));

    swal({
        title: "Are you sure to delete following porder...?",
        text:
            "\nPorder code : " + purchaseorder.pordercode +
            "\nRequired date: " + purchaseorder.requireddate +
            "\nTotal Amount : " + purchaseorder.totalamount +
            "\nAdded Date: " + purchaseorder.addeddate +
            "\nSupplier: " + purchaseorder.supplier_id.fullname ,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/purchaseorder", "DELETE", purchaseorder);
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

}

function btnSearchMC() {
    activepage = 1;
    loadSearchedTable();
}

function btnSearchClearMC() {
    loadView();
}

function btnPrintTableMC(pod) {

    //open new tab USING window.open() in the browser
    var newwindow = window.open();

    //put the outerhtml of the tblPorder in to formattab variable
    formattab = tblPorder.outerHTML;

    //write print table in the new tab using .document.write
    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Porder Details : </h1></div>" +
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