window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {


//tooltip
    $('[data-toggle="tooltip"]').tooltip()


    //add/clear/update button event handlers
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    txtSearchName.addEventListener("keyup", btnSearchMC);
    cmbService.addEventListener("change", cmbServiceCH);
    txtTAmount.addEventListener("keyup", txtTAmountCH);

    cmbSMenuCategory.addEventListener("change", cmbSMenuCategoryCH);
    cmbMenuCategory.addEventListener("change", cmbMenuCategoryCH);
    cmbMenu.addEventListener("change", cmbMenuCH);
    cmbSMenu.addEventListener("change", cmbSMenuCH);

    txtSMOrderCount.addEventListener("keyup", txtSMOrderCountCH);
    txtMenuOrderCount.addEventListener("keyup", txtMenuOrderCountCH);
    cmbRegCustomer.addEventListener("change", cmbRegCustomerCH);


    privilages = httpRequest("../privilage?module=RESERVATION", "GET");

    //Make arrays  get list for combop box
    customers = httpRequest("../customer/list", "GET");
    employees = httpRequest("../employee/list", "GET");
    reservationstatuses = httpRequest("../resrvationstatus/list", "GET");
    services = httpRequest("../service/list", "GET");
    menucategories = httpRequest("../menucategory/list", "GET");

    //inner arrays
    menus = httpRequest("../menu/list", "GET");
    submenucategories = httpRequest("../submenucategory/list", "GET");
    submenus = httpRequest("../submenu/list", "GET");
    //services should be implemented to get services then write services to get list
    //2.make controller and repository


    //colours
    valid = "3px solid #00f000";
    invalid = "3px solid red";
    initial = "3px solid #d6d6c2";
    updated = "3px solid #ff9900";
    active = "rgba(246,215,52,0.7)";


    loadView();
    //calling load view function for load view side
    loadForm();
    //calling load view function for load view side
    changeTab('form');
    changeTab2('menu');
    //calling form tab
}

function loadView() {

    //Search Area
    txtSearchName.value = "";                      // initially no need to search anything
    txtSearchName.style.background = "";

    //Table Area
    activerowno = "";                            // initially active row number= 0
    activepage = 1;                               // initially active page = 1
    var query = "&searchtext=";
    loadTable(1, cmbPageSize.value, query);
}

function paginate(page) {
    var paginate;
    if (oldreservation == null) {
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

//for fill data into table
function loadTable(page, size, query) {
    page = page - 1;                     //initially 0 page(1-1=0)
    reservations = new Array();          //reservation list

    //Request to get reservation  list from URL
    var data = httpRequest("/reservation/findAll?page=" + page + "&size=" + size + query, "GET");

    if (data.content != undefined) reservations = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);

    //fill data into table using reservations array
    //fill form-update, btnDeleteMc-Clear , Viewqreq-print
    fillTable('tblReservation', reservations, fillForm, btnDeleteMC, viewres);
    clearSelection(tblReservation);

    if (activerowno != "") selectRow(tblReservation, activerowno, active);

}

//print row -get data into the print table
function viewres(res, rowno) {

    reservation = JSON.parse(JSON.stringify(res));
    tdResNo.innerHTML = reservation.reservationno;
    tdRegCus.innerHTML = reservation.customer_id.fname;
    tdcname.innerHTML = reservation.cname;
    tdcmobile.innerHTML = reservation.cmobile;
    tdResNo.innerHTML = reservation.reservationno;
    tddescription.innerHTML = reservation.description;
    tdtamount.innerHTML = reservation.totalamount;
    tddiscountratio.innerHTML = reservation.discountratio;
    tdlastprice.innerHTML = reservation.lastprice;
    tdaddeddate.innerHTML = reservation.addeddate;
    tdrstatus.innerHTML = reservation.reservationstatus_id.name;

    $('#ReservationViewModal').modal('show')

}

//Print row (as a table)
function btnPrintRowMC() {

    var format = printformtable.outerHTML;
    var newwindow = window.open();

    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'/>" +
        "<body><div style='margin-top: 150px'><h1>reservation Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 1000);
}

//filtering menus related to Service(dinner/lunch/breakfast)
function cmbServiceCH() {

    if (JSON.parse(cmbService.value).servicename == "Take away") {
        chkDeliveryRequired.disabled = true;
        dteReservedDate.disabled = true;
        dteReservedDate.value = nowDate('date');
        reservationHasService.reserveddate = dteReservedDate.value;
        dteReservedDate.style.border = valid;
    }

    if (JSON.parse(cmbService.value).servicename == "Dine-in") {
        chkDeliveryRequired.disabled = true;
        window.open("http://localhost:8080/tableallocation")
        dteReservedDate.disabled = false;
        dteReservedDate.min = nowDate('date');
        reservationHasService.reserveddate = dteReservedDate.value;

    }


    if (JSON.parse(cmbService.value).servicename == "Order(Delivery)") {
        chkDeliveryRequired.disabled = false;
        dteReservedDate.disabled = false;
        dteReservedDate.min = nowDate('date');
        reservationHasService.reserveddate = dteReservedDate.value;

    }
}

//Menu-Filterings---------------------------------------------------------------------------------------------
//Menus categorized by menucategory id
function cmbMenuCategoryCH() {
    menulistbymenucategory = httpRequest("/menu/listbymenucategory?menucategoryid=" + JSON.parse(cmbMenuCategory.value).id, "GET");
    fillCombo(cmbMenu, "Select Menu", menulistbymenucategory, "menuname", "");

    cmbMenu.disabled = false
    txtMenuprice.disabled = true;
    txtMenuOrderCount.disabled = true;
    txtMLineTotal.disabled = true;
}

//Menu price when select menu
function cmbMenuCH() {

    txtMenuprice.value = toDecimal(JSON.parse(cmbMenu.value).price, 2);
    reservationHasService.menuprice = txtMenuprice.value;
    txtMenuprice.style.border = valid;

    txtMenuOrderCount.value = "0";
    txtMenuOrderCount.style.border = initial;

    txtMLineTotal.value = "00.00";
    txtMLineTotal.style.border = initial;


    txtMenuprice.disabled = true;
    txtMenuOrderCount.disabled = false;
    txtMLineTotal.disabled = true;

}

//Menu Line Total
function txtMenuOrderCountCH() {
    txtMLineTotal.value = toDecimal(txtMenuOrderCount.value * txtMenuprice.value);
    txtMLineTotal.style.border = valid;
    reservationHasService.linetotal = txtMLineTotal.value;

    if (txtMenuOrderCount.value > 0) {
        btnInnerAdd.disabled = false;
    }
}


//Sub Menu-Filterings--------------------------------------------------------------------------------------------
//Sub Menus categorized by submenucategory id
function cmbSMenuCategoryCH() {
    submenusbysubmenucategory = httpRequest("/submenu/ListBySubmenu?submenuid=" + JSON.parse(cmbSMenuCategory.value).id, "GET");
    fillCombo(cmbSMenu, "Select Sub Menu", submenusbysubmenucategory, "submenuname", "");

    cmbSMenu.disabled = false;
    txtSMPrice.disabled = true;
    txtSMOrderCount.disabled = true;
    txtSMLineTotal.disabled = true;

}

//Sub Menu price when select submenu
function cmbSMenuCH() {

    txtSMPrice.value = toDecimal(JSON.parse(cmbSMenu.value).price, 2);
    reservationHasService.submenuprice = txtSMPrice.value;
    txtSMPrice.style.border = valid;

    txtSMOrderCount.value = "0";
    txtSMOrderCount.style.border = initial;

    txtSMLineTotal.value = "00.00";
    txtSMLineTotal.style.border = initial;

    txtSMPrice.disabled = true;
    txtSMOrderCount.disabled = false;
    txtSMLineTotal.disabled = true;


}

//Sub Menu Line Total
function txtSMOrderCountCH() {
    txtSMLineTotal.value = toDecimal(txtSMOrderCount.value * txtSMPrice.value);
    txtSMLineTotal.style.border = valid;
    reservationHasService.linetotal = txtSMLineTotal.value;


    if (txtSMOrderCount.value > 0) {
        btnInnerAdd2.disabled = false;
    }
}

//Auto filtering Last price when enter the dis(%) ratio
function txtDiscountRatioCH() {

    let tamount = parseFloat(txtTAmount.value);
    let discount = parseFloat(txtDiscountRatio.value);

    txtLastPrice.value = (tamount - (tamount * discount / 100)).toFixed(2);
    txtLastPrice.style.border = valid;
    reservation.lastprice = txtLastPrice.value;
}

//Auto filtering Deliver Name , mobile no when selected the Customer
//Delivery - Auto filtering Deliver Cp Name and cpmobilewhen selected the Customer
function cmbRegCustomerCH() {
    if (cmbRegCustomer.value != null) {
        txtCName.value = reservation.customer_id.fname;
        txtCName.style.border = valid;
        reservation.cname = txtCName.value;

        //Delivery - Auto filtering Deliver Cp Name when selected the Customer
        txtCPName.value = txtCName.value;
        txtCPName.style.border = valid;
        reservationHasService.cpname = txtCPName.value;

        txtCMobile.value = reservation.customer_id.mobileno;
        txtCMobile.style.border = valid;
        reservation.cmobile = txtCMobile.value;

        //Delivery -Auto filtering Deliver Cp Mobile when selected the Customer
        txtCPMobile.value = txtCMobile.value;
        txtCPMobile.style.border = valid;
        reservationHasService.cpmobile = txtCPMobile.value;

        txtRBday.value=reservation.customer_id.birthday;
        txtRBday.style.border=valid;
        reservation.birthday=txtRBday;

    }
}

//calculate the line totals related to the discount ratios
function txtTAmountCH() {

    if (parseFloat(txtTAmount.value) >= 5000.00) {
        txtDiscountRatio.value = 0.2;
        txtDiscountRatio.style.border = valid;
        reservation.discountratio = txtDiscountRatio.value;
    }

    if (parseFloat(txtTAmount.value) >= 7500.00) {
        txtDiscountRatio.value = 0.3;
        txtDiscountRatio.style.border = valid;
        reservation.discountratio = txtDiscountRatio.value;
    }
    if (parseFloat(txtTAmount.value) >= 10000.00) {
        txtDiscountRatio.value = 0.5;
        txtDiscountRatio.style.border = valid;
        reservation.discountratio = txtDiscountRatio.value;
    }
    if (parseFloat(txtTAmount.value) >= 15000.00) {
        txtDiscountRatio.value = 1;
        txtDiscountRatio.style.border = valid;
        reservation.discountratio = txtDiscountRatio.value;
    }
}

function loadForm() {
    reservation = new Object();
    oldreservation = null;

    reservation.reservationHasServiceList = new Array();

    //Auto fill combo box
    fillCombo(cmbRegCustomer, "Select Customer", customers, "mobileno");
    fillCombo(cmbStatus, "", reservationstatuses, "name", "Available");
    fillCombo(cmbAddedBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    reservation.reservationstatus_id = JSON.parse(cmbStatus.value);
    cmbStatus.disabled = true;

    reservation.employee_id = JSON.parse(cmbAddedBy.value);
    cmbAddedBy.disabled = true;

    //create date object

    var today = new Date();
    //get month--> array(0-11)
    var month = today.getMonth() + 1;
    //browser format of month is YYYY-MM-DD(jan-01,feb-02,..)
    if (month < 10) month = "0" + month;//YYYY-MM-DD
    //browser format of date is YYYY-MM-DD(01,02,..)
    //get date-->range(1-31)
    var date = today.getDate();
    if (date < 10) date = "0" + date;//YYYY-MM-DD

    dteAddedDate.value = today.getFullYear() + "-" + month + "-" + date;
    reservation.addeddate = dteAddedDate.value;
    dteAddedDate.disabled = true;

    // Get Next Number Form Data Base
    var nextNumber = httpRequest("/reservation/nextrn", "GET");
    txtReservationNo.value = nextNumber.reservationno;
    reservation.reservationno = txtReservationNo.value;
    txtReservationNo.disabled = "disabled";

    //text field empty
    txtCName.value = "";
    txtCMobile.value = "";
    txtSMLineTotal.value = "";
    txtSMOrderCount.value = "";
    txtSMPrice.value = "";
    txtDescription.value = "";
    txtTAmount.value = "";

    //Initially the value of discountration=0
    txtDiscountRatio.value = "0";
    reservation.discountratio = txtDiscountRatio.value;

    txtMLineTotal.value = "";
    txtCPName.value = "";
    txtCPMobile.value = "";
    txtAddress.value = "";
    dteReservedDate.value = "";

    // set field to initial color
    setStyle(initial);
    txtReservationNo.style.border = valid;
    dteAddedDate.style.border = valid;
    cmbAddedBy.style.border = valid;
    cmbStatus.style.border = valid;
    txtDiscountRatio.style.border = valid;


    disableButtons(false, true, true);

    refreshInnerForm();


    changeTab("menu")
}

function refreshInnerForm() {

    reservationHasService = new Object();
    oldreservationHasService = null;

    var totalamount = 0.00;
    //inner form


    txtMenuprice.value = "";
    txtMenuOrderCount.value = "";
    txtMLineTotal.value = "";
    txtSMPrice.value = "";
    txtSMOrderCount.value = "";
    txtSMLineTotal.value = "";
    dteReservedDate.value = "";

    fillCombo(cmbService, "Select Service", services, "servicename", "");
    fillCombo(cmbMenu, "Select Menu", menus, "menuname", "");
    fillCombo(cmbSMenu, "Select Sub Menu", submenus, "submenuname", "");
    fillCombo(cmbSMenuCategory, "Select Sub Menu category", submenucategories, "name", "");
    fillCombo(cmbMenuCategory, "Select Menu category", menucategories, "name", "");

    btnInnerAdd.disabled = true;
    btnInnerAdd2.disabled = true;


    txtMenuOrderCount.value = "0";
    txtMenuOrderCount.style.border = initial;

    txtMLineTotal.value = "00.00";
    txtMLineTotal.style.border = initial;

    txtSMOrderCount.value = "0";
    txtSMOrderCount.style.border = initial;

    txtSMLineTotal.value = "00.00";
    txtSMLineTotal.style.border = initial;

    cmbMenuCategory.style.border = initial;
    cmbMenu.style.border = initial;
    txtMenuprice.style.border = initial;
    txtMenuOrderCount.style.border = initial;
    txtMLineTotal.style.border = initial;

    cmbSMenuCategory.style.border = initial;
    cmbSMenu.style.border = initial;
    txtSMPrice.style.border = initial;
    txtSMOrderCount.style.border = initial;
    txtSMLineTotal.style.border = initial;

    cmbMenu.disabled = true;
    txtMenuprice.disabled = true;
    txtMenuOrderCount.disabled = true;
    txtMLineTotal.disabled = true;

    cmbSMenu.disabled = true;
    txtSMPrice.disabled = true;
    txtSMOrderCount.disabled = true;
    txtSMLineTotal.disabled = true;


    chkDeliveryRequired.checked = false;
    $('#deliveryrequired').bootstrapToggle('off');
    reservationHasService.deliveryrequired = false;
    chkDeliveryRequired.disabled = true;

    dteReservedDate.disabled = true;


    //Inner table
    fillInnerTable('tblInnerReservation', reservation.reservationHasServiceList, innerModify, innerDelete, false);

    //inner table eke data walin total eka
    if (reservation.reservationHasServiceList != 0) {
        for (var index in reservation.reservationHasServiceList) {
            totalamount = parseFloat(totalamount) + parseFloat(reservation.reservationHasServiceList[index].linetotal)
        }
    }

    txtTAmount.value = toDecimal(totalamount);
    txtTAmount.disabled = true;
    reservation.totalamount = txtTAmount.value;


    if (oldreservation != null && reservation.totalamount != oldreservation.totalamount) {
        txtTAmount.style.border = updated;
    } else {
        txtTAmount.style.border = valid;
    }

    txtTAmountCH();
    txtDiscountRatioCH();

    txtServiceCharge.value = "0.00";
    reservationHasService.servicecharge = toDecimal("0.00");
    txtServiceCharge.style.border = valid;
    txtMenuprice.disabled = true;


}

//get errors form inner form
function getErrorsInner() {
    var errors = "";
    addvalue = "";

    if (reservationHasService.service_id == null) {
        cmbService.style.border = invalid;
        errors = errors + "\n" + "Service Not Selected";
    } else addvalue = 1;

    if (reservationHasService.reserveddate == null) {
        dteReservedDate.style.border = invalid;
        errors = errors + "\n" + "Reserved Date Not Entered";
    } else addvalue = 1;


    return errors;
}

//Add Menu Inner table
function btnInnerAddMC() {


    var resv = false;
    for (var index in reservation.reservationHasServiceList) {
        if (reservation.reservationHasServiceList[index].menu_id != null) {

            if (reservation.reservationHasServiceList[index].menu_id.menuname == reservationHasService.menu_id.menuname) {
                resv = true;
                break;
            }
        }
    }

    if (getErrorsInner() == "") {
        for (var index in reservation.reservationHasServiceList) {
            if (reservation.reservationHasServiceList[index].menu_id != null) {
                if (reservation.reservationHasServiceList[index].menu_id.menuname == reservationHasService.menu_id.menuname) {
                    resv = true;
                    break;
                }
            }

        }
        if (resv) {
            swal({
                title: "Already exist!",
                icon: "warning",
                text: '\n',
                button: false,
                timer: 1200,
            });
        } else {

            reservation.reservationHasServiceList.push(reservationHasService);
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

//Add Menu Inner table
function btnInnerAddMC2() {
    var resv = false;

    if (getErrorsInner() == "") {
        for (var index in reservation.reservationHasServiceList) {
            if (reservation.reservationHasServiceList[index].submenu_id != null) {

                if (reservation.reservationHasServiceList[index].submenu_id.submenuname == reservationHasService.submenu_id.submenuname) {
                    resv = true;
                    break;
                }
            }
        }
        if (resv) {
            swal({
                title: "Already exist!",
                icon: "warning",
                text: '\n',
                button: false,
                timer: 1200,
            });
        } else {
            reservation.reservationHasServiceList.push(reservationHasService);
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

function btninnerClearMC() {
    //Get Cofirmation from the User window.confirm();
    checkerr = getErrors();

    if (oldreservationHasService == null && addvalue == "") {
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

function innerDelete(innerob, innerrow) {
    swal({
        title: "Are you sure to remove Item?",
        text: "\nItem Name : " + innerob.reservation_id.name,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            reservation.reservationHasServiceList.splice(innerrow, 1);
            refreshInnerForm();
        }
    });
}

function setStyle(style) {


    txtReservationNo.style.border = style;
    txtCName.style.border = style;
    txtCMobile.style.border = style;
    txtMenuprice.style.border = style;
    txtMenuOrderCount.style.border = style;
    txtMLineTotal.style.border = style;
    txtSMPrice.style.border = style;
    txtSMOrderCount.style.border = style;
    txtSMLineTotal.style.border = style;
    txtDescription.style.border = style;
    txtTAmount.style.border = style;
    txtDiscountRatio.style.border = style;
    txtLastPrice.style.border = style;
    txtServiceCharge.style.border = style;
    txtAddress.style.border = style;
    dteReservedDate.style.border = style;

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
    for (index in reservations) {
        if (reservations[index].reservationstatus_id.name == "Deleted") {
            tblReservation.children[1].children[index].style.color = "#f00";
            tblReservation.children[1].children[index].style.border = "2px solid red";
            tblReservation.children[1].children[index].lastChild.children[1].disabled = true;
            tblReservation.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

//Add- Display Errors
function getErrors() {

    var errors = "";
    addvalue = "";


    if (reservation.cname == null) {
        errors = errors + "\n" + "Customer name Not Entered ";
        txtCName.style.border = invalid;
    } else addvalue = 1;

    if (reservation.cmobile == null) {
        errors = errors + "\n" + "Contact No Not Entered";
        txtCMobile.style.border = invalid;
    } else addvalue = 1;

    if (reservation.totalamount == null) {
        errors = errors + "\n" + "Total amount Not Entered";
        txtTAmount.style.border = invalid;
    } else addvalue = 1;

    if (reservation.discountratio == null) {
        errors = errors + "\n" + "Discount Ratio Not Entered";
        txtDiscountRatio.style.border = invalid;
    } else addvalue = 1;

    if (reservation.lastprice == null) {
        errors = errors + "\n" + "Last price Not Entered";
        txtLastPrice.style.border = invalid;
    } else addvalue = 1;

    // msg for fill data in innertable
    if (reservation.reservationHasServiceList.length != 0) {
        cmbService.style.border = invalid;
        errors = errors + "\n" + "Reservation Service not added";

    } else addvalue = 1;


    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (cmbRegCustomer.value == "" || txtDescription.value == "" || txtDiscountRatio.value == "") {
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

function savedata() {

    swal({
        title: "Are you sure to add following reservation...?",
        text: "\n Reservation No: " + reservation.reservationno +
            "\n customer Name : " + reservation.cname +
            "\n Customer mobile No : " + reservation.cmobile +
            "\n Total Amount  : " + reservation.totalamount +
            "\n Discount ratio : " + reservation.discountratio +
            "\n Last price : " + reservation.lastprice +
            "\n Added Date : " + reservation.addeddate +
            "\n Reservation status: " + JSON.parse(reservation.reservationstatus_id.name),

        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/reservation", "POST", reservation);
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
                changeTab('table');
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

    if (oldreservation == null && addvalue == "") {
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

function fillForm(res, rowno) {
    activepage = rowno;

    if (oldreservation == null) {
        filldata(res);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(res);
            }

        });
    }

}

function filldata(res) {

    clearSelection(tblReservation);
    selectRow(tblReservation, activepage, active);

    reservation = JSON.parse(JSON.stringify(res));
    oldreservation = JSON.parse(JSON.stringify(res));


    txtCName.value = reservation.cname;
    txtCMobile.value = reservation.cmobile;
    txtDescription.value = reservation.description;
    txtDiscountRatio.value = reservation.discountratio;
    txtLastPrice.value = reservation.lastprice;


    if (reservation.customer_id != null) {

        fillCombo(cmbRegCustomer, "Select Customer", customers, "fname", reservation.customer_id.fname);

    }

    fillCombo(cmbStatus, "", reservationstatuses, "name", "");
    cmbStatus.disabled = false;
    fillCombo(cmbService, "Select Service", services, "servicename", "");

    disableButtons(true, false, false);
    setStyle(valid);


    refreshInnerForm();
    changeTab('form');

    //Optional fields initial colour
    if (reservation.description == null)
        txtDescription.style.border = initial;

    if (reservation.customer_id == null)
        cmbRegCustomer.style.border = initial;
}


//Update-Display updated values msg
function getUpdates() {

    var updates = "";

    if (reservation != null && oldreservation != null) {

        if (reservation.reservationno != oldreservation.reservationno)
            updates = updates + "\n Registration No is Changed";

        if (reservation.cname != oldreservation.cname)
            updates = updates + "\nCustomer Name is Changed";

        if (reservation.cmobile != oldreservation.cmobile)
            updates = updates + "\nCustomer Mobile No is Changed";

        if (reservation.description != oldreservation.description)
            updates = updates + "\nDescription is Changed";


        if (reservation.totalamount != oldreservation.totalamount)
            updates = updates + "\n total amount is Changed";

        if (reservation.discountratio != oldreservation.discountratio)
            updates = updates + "\n discount ratio is Changed";

        if (reservation.lastprice != oldreservation.lastprice)
            updates = updates + "\n Last price is Changed";

        if (reservation.reservationstatus_id.name != oldreservation.reservationstatus_id.name)
            updates = updates + "\n Reservation status is changeed is Changed";

        if (reservation.addeddate != oldreservation.addeddate)
            updates = updates + "\n Added date is Changed";

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
                title: "Are you sure to update following reservation details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/reservation", "PUT", reservation);
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

//Delelete function-delete a row from the table
function btnDeleteMC(res) {
    reservation = JSON.parse(JSON.stringify(res));

    swal({
        title: "Are you sure to delete following reservation...?",
        text: "\n Reservation No : " + reservation.reservationno +
            "\n Customer Name : " + reservation.cname,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/reservation", "DELETE", reservation);
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

function btnPrintTableMC(reservation) {


    //open new tab in the browser
    var newwindow = window.open();
    formattab = tblReservation.outerHTML;


    //write print table in the new tab
    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>reservation Details : </h1></div>" +
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

function chkDeliveryRequiredCH() {
    if (chkDeliveryRequired.checked) {
        $('#DeliveryDetailModal').modal('show');
    } else {
        $('#DeliveryDetailModal').modal('hide');
    }

}

function changeTab2(viewname) {
    if (viewname == 'menu') {
        tbMenu.classList.add('active');
        tbSubMenu.classList.remove('active');
        divmenu.style.display = "block";
        divsubmenu.style.display = "none";
    }
    if (viewname == 'submenu') {
        tbMenu.classList.remove('active');
        tbSubMenu.classList.add('active');
        divmenu.style.display = "none";
        divsubmenu.style.display = "block";

    }

}