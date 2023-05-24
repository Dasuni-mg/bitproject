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
    txtTAmount.addEventListener("keyup", txtTAmountCH);

    cmbSMenuCategory.addEventListener("change", cmbSMenuCategoryCH);
    cmbMenuCategory.addEventListener("change", cmbMenuCategoryCH);
    cmbMenu.addEventListener("change", cmbMenuCH);
    cmbSMenu.addEventListener("change", cmbSMenuCH);

    txtSMOrderCount.addEventListener("keyup", txtSMOrderCountCH);
    txtMenuOrderCount.addEventListener("keyup", txtMenuOrderCountCH);
    cmbRegCustomer.addEventListener("change", cmbRegCustomerCH);


    privilages = httpRequest("../privilage?module=DELIVERY", "GET");

    //Make arrays  get list for combop box
    customers = httpRequest("../customer/list", "GET");

    console.log(customers)
    employees = httpRequest("../employee/list", "GET");
    reservationstatuses = httpRequest("../resrvationstatus/list", "GET");
    services = httpRequest("../service/list", "GET");
    menucategories = httpRequest("../menucategory/list", "GET");

    //inner arrays
    customerstatuses = httpRequest("../customerstatus/list", "GET");
    menus = httpRequest("../menu/list", "GET");
    submenucategories = httpRequest("../submenucategory/list", "GET");
    submenus = httpRequest("../submenu/list", "GET");
    //services should be implemented to get services then write services to get list
    //2.make controller and repository


    //colours
    valid = "3px solid #078D27B2";
    invalid = "3px solid red";
    initial = "3px solid #d6d6c2";
    updated = "3px solid #ff9900";
    active = "rgba(250,210,11,0.7)";


    loadView();
    //calling load view function for load view side
    loadForm();
    //calling load view function for load view side
    changeTab2('menu');

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
    fillTable('tblDelivery', reservations, fillForm, btnDeleteMC, viewres);
    clearSelection(tblDelivery);

    if (activerowno != "") selectRow(tblDelivery, activerowno, active);

}

//print row -get data into the print table
function viewres(res, rowno) {

    reservation = JSON.parse(JSON.stringify(res));


    tdResNo.innerHTML = reservation.reservationno;
    tdcname.innerHTML = reservation.cname;
    tdcmobile.innerHTML = reservation.cmobile;
    tdaddress.innerHTML = reservation.deliveryaddress;
    tdtamount.innerHTML = reservation.totalamount;
    tddiscountratio.innerHTML = reservation.discountratio;
    tdlastprice.innerHTML = reservation.lastprice;


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

    if(oldreservationHasService !=null && reservationHasService.menuprice != oldreservationHasService.menuprice){
        txtMenuprice.style.border = updated;

    }


    txtMenuOrderCount.value = "0";
    txtMenuOrderCount.style.border = initial;

    txtMLineTotal.value = "00.00";



    txtMenuprice.disabled = true;
    txtMenuOrderCount.disabled = false;
    //txtMenuOrderCount.Style.border=valid;
    txtMLineTotal.disabled = true;
    //txtMLineTotal.Style.border=valid;

}

//Menu Line Total
function txtMenuOrderCountCH() {
    txtMLineTotal.value = toDecimal(txtMenuOrderCount.value * txtMenuprice.value);
    txtMLineTotal.style.border = valid;
    reservationHasService.linetotal = txtMLineTotal.value;

    if (txtMenuOrderCount.value > 0) {
        btnInnerAdd.disabled = false;
    }

    if(oldreservationHasService !=null && reservationHasService.ordercount != oldreservationHasService.ordercount){
        txtMenuOrderCount.style.border = updated;
    }

    if(oldreservationHasService !=null && reservationHasService.linetotal != oldreservationHasService.linetotal){
        txtMLineTotal.style.border = updated;
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

    // txtSMOrderCount.value = "0";
    // txtSMOrderCount.style.border = initial;
    if(oldreservationHasService !=null && reservationHasService.submenuprice != oldreservationHasService.submenuprice){
        txtSMPrice.style.border = updated;

    }



    txtSMLineTotal.value = "00.00";
    txtSMLineTotal.style.border = valid;

    txtSMPrice.disabled = true;

    txtSMOrderCount.disabled = false;

    txtSMLineTotal.disabled = true;
    txtSMLineTotal.style.border = valid;



}

//Sub Menu Line Total
function txtSMOrderCountCH() {
    txtSMLineTotal.value = toDecimal(txtSMOrderCount.value * txtSMPrice.value);
    txtSMLineTotal.style.border = valid;
    reservationHasService.linetotal = txtSMLineTotal.value;


    if (txtSMOrderCount.value > 0) {
        btnInnerAdd2.disabled = false;
    }

    if(oldreservationHasService !=null && reservationHasService.linetotal != oldreservationHasService.linetotal){
        txtSMLineTotal.style.border = updated;

    }
}

//Auto filtering Last price when enter the dis(%) ratio
function txtDiscountRatioCH() {

    let tamount = parseFloat(txtTAmount.value);
    let discount = parseFloat(txtDiscountRatio.value);
    let scharge = parseFloat(txtSCharge.value);
    let tot = parseFloat(scharge + tamount);


    txtLastPrice.value = (tot - (tot * discount / 100)).toFixed(2);
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
        txtCName.value = txtCName.value;
        txtCName.style.border = valid;
        reservationHasService.cname = txtCName.value;

        txtDmobile.value = reservation.customer_id.mobileno;
        txtDmobile.style.border = valid;
        reservation.cmobile = txtDmobile.value;

        //Delivery -Auto filtering Deliver Cp Mobile when selected the Customer
        txtDmobile.value = txtDmobile.value;
        txtDmobile.style.border = valid;
        reservationHasService.cmobile = txtDmobile.value;

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


    // Get Next Number Form Data Base
    var nextNumber = httpRequest("/reservation/nextrn", "GET");
    txtReservationNo.value = nextNumber.reservationno;
    reservation.reservationno = txtReservationNo.value;
    txtReservationNo.disabled = "disabled";

    //text field empty
    txtCName.value = "";
    txtDmobile.value = "";
    txtDAddress.value = "";
    txtTAmount.value = "";
    txtLastPrice.value = "";


    //Initially the value of discountration=0
    txtDiscountRatio.value = "0";
    reservation.discountratio = txtDiscountRatio.value;


    // set field to initial color
    setStyle(initial);
    txtReservationNo.style.border = valid;
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

    btnInnerUpdate.disabled = true;
    btnInnerUpdateSM.disabled = true;


    txtMenuprice.value = "";
    txtMenuOrderCount.value = "";
    txtMLineTotal.value = "";
    txtSMPrice.value = "";
    txtSMOrderCount.value = "";
    txtSMLineTotal.value = "";

    //fillCombo(cmbService, "Select Service", services, "servicename", "");
    fillCombo(cmbMenu, "Select Menu", menus, "menuname", "");
    fillCombo(cmbSMenu, "Select Sub Menu", submenus, "submenuname", "");
    fillCombo(cmbSMenuCategory, "Select Sub Menu category", submenucategories, "name", "");
    fillCombo(cmbMenuCategory, "Select Menu category", menucategories, "name", "");

    btnInnerAdd.disabled = true;
    btnInnerAdd2.disabled = true;


    if (reservationHasService.ordercount == null) {
        txtMenuOrderCount.value = parseInt(0);
        txtMenuOrderCount.style.border = initial;
    }

    if (reservationHasService.linetotal == null) {
        txtMLineTotal.value = parseFloat(0).toFixed(2);
        txtMLineTotal.style.border = initial;
    }

    if (reservationHasService.ordercount == null) {
        txtSMOrderCount.value = parseInt(0)
        txtSMOrderCount.style.border = initial;
    }

    if (reservationHasService.linetotal == null) {
        txtSMLineTotal.value = parseFloat(0).toFixed(2);
        txtSMLineTotal.style.border = initial;
    }


    if (reservationHasService.menucategory_id == null) {
        cmbMenuCategory.style.border = initial;
    }
    if (reservationHasService.menu_id == null) {
        cmbMenu.style.border = initial;
    }
    if (reservationHasService.menuprice == null) {
        txtMenuprice.style.border = initial;
    }
    if (reservationHasService.ordercount == null) {
        txtMenuOrderCount.style.border = initial;
    }
        if (reservationHasService.linetotal == null) {
        txtMLineTotal.style.border = initial;
    }
        if (reservationHasService.submenucategory_id == null) {
        cmbSMenuCategory.style.border = initial;
    }
    if (reservationHasService.submenu_id == null) {
        cmbSMenu.style.border = initial;
    }
    if (reservationHasService.submenuprice == null) {
        txtSMPrice.style.border = initial;
    }
    if (reservationHasService.ordercount == null) {
        txtSMOrderCount.style.border = initial;
    }
    if (reservationHasService.linetotal == null) {
        txtSMLineTotal.style.border = initial;
    }

    if (reservationHasService.linetotal == null) {
        txtSMLineTotal.style.border = initial;
    }


    cmbMenu.disabled = true;
    txtMenuprice.disabled = true;
    txtMenuOrderCount.disabled = true;
    txtMLineTotal.disabled = true;

    cmbSMenu.disabled = true;
    txtSMPrice.disabled = true;
    txtSMOrderCount.disabled = true;
    txtSMLineTotal.disabled = true;


    //Inner table
    fillInnerTable('tblInnerReservation', reservation.reservationHasServiceList, innerModify, innerDelete, true);

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
        txtTAmount.style.border =updated;
    } else {
        txtTAmount.style.border = valid;
    }


    if (oldreservation != null && reservation.discountratio != oldreservation.discountratio) {
        txtDiscountRatio.style.border =updated;
    } else {
        txtDiscountRatio.style.border = valid;
    }

    txtTAmountCH();




    txtSCharge.value = "300.00";
    reservation.servicecharge = toDecimal("300.00");
    txtSCharge.style.border = valid;
    txtMenuprice.disabled = true;

    txtDiscountRatioCH();

    if (oldreservation != null && reservation.lastprice != oldreservation.lastprice) {
        txtLastPrice.style.border =updated;
    } else {
        txtLastPrice.style.border = valid;
    }

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

}

//Add Menu Inner table
function btnInnerAddMC2() {
    var resv = false;


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

}

function getMenuInnerErrors(){


    var innerErrors = "";
    var inneraddvalue = "";

    if(reservationHasService.menu_id== null){
        innerErrors = innerErrors +"\n"+ "Select the Menu";
        cmbMenu.style.border = invalid;
    }else{
        inneraddvalue = 1;
    }

    if(reservationHasService.menucategory_id== null){
        innerErrors = innerErrors +"\n"+ "Select the Menu Category";
        cmbMenuCategory.style.border = invalid;
    }else{
        inneraddvalue = 1;
    }

    if(reservationHasService.menuprice== null){
        innerErrors = innerErrors +"\n"+ "Enter the Menu Price";
        txtMenuprice.style.border = invalid;
    }else{
        inneraddvalue = 1;
    }



    if(reservationHasService.ordercount== null){
        innerErrors = innerErrors +"\n"+ "Select the Order count";
        txtMenuOrderCount.style.border = invalid;
    }else{
        inneraddvalue = 1;
    }

    if(reservationHasService.linetotal== null){
        innerErrors = innerErrors +"\n"+ "Select the Line total";
        txtMLineTotal.style.border = invalid;
    }else{
        inneraddvalue = 1;
    }



    return innerErrors;
}

function getSubMenuInnerErrors(){


    var innerErrors = "";
    var inneraddvalue = "";

    if(reservationHasService.submenucategory_id== null){
        innerErrors = innerErrors +"\n"+ "Select the Sub menu Category";
        cmbSMenuCategory.style.border = invalid;
    }else{
        inneraddvalue = 1;
    }

    if(reservationHasService.submenu_id== null){
        innerErrors = innerErrors +"\n"+ "Select the Menu";
        cmbSMenu.style.border = invalid;
    }else{
        inneraddvalue = 1;
    }
    if(reservationHasService.submenuprice== null){
        innerErrors = innerErrors +"\n"+ "Enter the Sub menu Price";
        txtSMPrice.style.border = invalid;
    }else{
        inneraddvalue = 1;
    }

    if(reservationHasService.ordercount== null){
        innerErrors = innerErrors +"\n"+ "Enter the Order Count";
        txtSMOrderCount.style.border = invalid;
    }else{
        inneraddvalue = 1;
    }

    if(reservationHasService.linetotal== null){
        innerErrors = innerErrors +"\n"+ "Enter the Line Total";
        txtSMLineTotal.style.border = invalid;
    }else{
        inneraddvalue = 1;
    }





    return innerErrors;
}

function getinnerMenuupdate(){

    var innerupdate = "";

    if(reservationHasService !=null && oldreservationHasService !=null){

        //menu
        if (reservationHasService.menu_id.menuname != oldreservationHasService.menu_id.menuname)
            innerupdate = innerupdate + "\nMenu is changed from " + oldreservationHasService.menu_id.menuname + " to " + reservationHasService.menu_id.menuname ;

        if (reservationHasService.menucategory_id.name != oldreservationHasService.menucategory_id.name)
            innerupdate = innerupdate + "\nMenu Category is changed from " + oldreservationHasService.menucategory_id.name + " to " + reservationHasService.menucategory_id.name ;

        if (reservationHasService.menuprice != oldreservationHasService.menuprice)
            innerupdate = innerupdate + "\nMenu Price is changed from " + oldreservationHasService.menuprice + " to " + reservationHasService.menuprice ;

        if (reservationHasService.ordercount != oldreservationHasService.ordercount)
            innerupdate = innerupdate + "\nOrder Count is changed from " + oldreservationHasService.ordercount + " to " + reservationHasService.ordercount ;

        if (reservationHasService.linetotal != oldreservationHasService.linetotal)
            innerupdate = innerupdate + "\nLine Total is changed from " + oldreservationHasService.linetotal + " to " + reservationHasService.linetotal ;

    }
    return innerupdate;
}

function getinnerSubMenuupdate(){

    var innerupdate = "";

    if(reservationHasService !=null && oldreservationHasService !=null){


        //sub menu
        if (reservationHasService.submenucategory_id != oldreservationHasService.submenucategory_id)
            innerupdate = innerupdate + "\nSub Menu is changed from " + oldreservationHasService.submenucategory_id.name + " to " + reservationHasService.submenucategory_id.name ;

        if (reservationHasService.submenu_id != oldreservationHasService.submenu_id)
            innerupdate = innerupdate + "\nSub Menu Category is changed from " + oldreservationHasService.submenu_id.submenuname+ " to " + reservationHasService.submenu_id.submenuname ;

        if (reservationHasService.submenuprice != oldreservationHasService.submenuprice)
            innerupdate = innerupdate + "\nSub Menu Price is changed from " + oldreservationHasService.submenuprice + " to " + reservationHasService.submenuprice ;

        if (reservationHasService.ordercount != oldreservationHasService.ordercount)
            innerupdate = innerupdate + "\nOrder Count is changed from " + oldreservationHasService.ordercount + " to " + reservationHasService.ordercount;

        if (reservationHasService.linetotal != oldreservationHasService.linetotal)
            innerupdate = innerupdate + "\nLine Total is changed from " + oldreservationHasService.linetotal + " to " + reservationHasService.linetotal;
    }
    return innerupdate;
}

//Update Sub Menu Inner Table
function btnInnerUpdateSubMenuMC(){
    var innerErrors = getSubMenuInnerErrors();
    if(innerErrors == ""){
        var innerUpdate = getinnerSubMenuupdate();
        if(innerUpdate ==""){
            swal({
                title: 'Nothing Updated..!', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
        }else{
            swal({
                title: "Are you sure to inner form update following details...?",
                text: "\n" + innerUpdate,
                icon: "warning", buttons: true, dangerMode: true,
            })


                .then((willDelete) => {
                    if (willDelete) {

                        swal({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been Done \n Update SuccessFully..!',
                            text: '\n',
                            button: false,
                            timer: 1200
                        });
                        reservation.reservationHasServiceList[innerrow] = reservationHasService;

                        refreshInnerForm();

                    }
                });
        }
    }else{
        swal({
            title: 'You have following errors in your form', icon: "error",
            text: '\n ' + getSubMenuInnerErrors(),
            button: true
        });
    }
}

//Update Menu Inner Table
function btnInnerUpdateMenuMC(){
    var innerErrors = getMenuInnerErrors();
    if(innerErrors == ""){
        var innerUpdate = getinnerMenuupdate();
        if(innerUpdate ==""){
            swal({
                title: 'Nothing Updated..!', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
        }else{
            swal({
                title: "Are you sure to inner form update following details...?",
                text: "\n" + innerUpdate,
                icon: "warning", buttons: true, dangerMode: true,
            })


                .then((willDelete) => {
                    if (willDelete) {

                        swal({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been Done \n Update SuccessFully..!',
                            text: '\n',
                            button: false,
                            timer: 1200
                        });
                        reservation.reservationHasServiceList[innerrow] = reservationHasService;

                        refreshInnerForm();

                    }
                });
        }
    }else{
        swal({
            title: 'You have following errors in your form', icon: "error",
            text: '\n ' + getMenuInnerErrors(),
            button: true
        });
    }
}

function innerModify(ob, innerrowno) {

    btnInnerUpdate.disabled = false;
    btnInnerUpdate.style.cursor = "pointer";

    btnInnerUpdate.disabled = false;
    btnInnerUpdateSM.disabled = false;

    innerrow = innerrowno

    reservationHasService = JSON.parse(JSON.stringify(ob));
    oldreservationHasService = JSON.parse(JSON.stringify(ob));

    console.log("Reservation Has ", reservationHasService)


    //if  submenu is null
    if (reservationHasService.submenu_id == null && reservationHasService.submenucategory_id == null) {

        // changeTab("menu")

        console.log("MAIN MENU");
        changeTabMandS('menu');

        fillCombo(cmbMenu, "Select Menu", menus, "menuname", reservationHasService.menu_id.menuname);
        fillCombo(cmbMenuCategory, "Select Menu category", menucategories, "name", reservationHasService.menucategory_id.name);

        cmbMenu.disabled=false;
        txtMenuOrderCount.style.border = valid;
        txtMenuprice.style.border = valid;
        txtMLineTotal.style.border = valid;

        txtMenuprice.value = parseFloat(reservationHasService.menuprice).toFixed(2);
        txtMenuOrderCount.value = reservationHasService.ordercount;
        txtMLineTotal.value = parseFloat(reservationHasService.linetotal).toFixed(2);

        txtMenuOrderCount.disabled = false;
        txtMenuOrderCount.style.border=valid;

        // txtSMLineTotal.style.border = valid;
        // txtSMPrice.style.border = valid;
    }


    //if menu is null
    if (reservationHasService.menucategory_id == null && reservationHasService.menucategory_id == null) {

        // changeTab("submenu")
        cmbSMenu.disabled = false;
        changeTabMandS('submenu');

        fillCombo(cmbSMenu, "Select Sub Menu", submenus, "submenuname", reservationHasService.submenu_id.submenuname);
        fillCombo(cmbSMenuCategory, "Select Sub Menu category", submenucategories, "name", reservationHasService.submenucategory_id.name);

        txtSMPrice.value = parseFloat(reservationHasService.submenuprice).toFixed(2);
        txtSMOrderCount.value = reservationHasService.ordercount;
        txtSMLineTotal.value = parseFloat(reservationHasService.linetotal).toFixed(2);

        txtSMLineTotal.style.border = valid;
        txtSMPrice.style.border = valid;
        txtSMOrderCount.disabled = false;
        txtSMOrderCount.style.border=valid;
    }
    //if menu and submenu both are not null
    if (reservationHasService.menu_id !=null && reservationHasService.menucategory_id !=null && reservationHasService.submenu_id != null && reservationHasService.submenucategory_id != null) {

        if(reservationHasService.menu_id){
            changeTabMandS('menu');
        }
        if(reservationHasService.submenu_id){
            changeTabMandS('submenu');
        }
        // fillCombo(cmbMenu, "Select Menu", menus, "menuname", reservationHasService.menu_id.menuname);
        // fillCombo(cmbMenuCategory, "Select Menu category", menucategories, "name", reservationHasService.menucategory_id.name);
        // fillCombo(cmbSMenu, "Select Sub Menu", submenus, "submenuname", reservationHasService.submenu_id.submenuname);
        // fillCombo(cmbSMenuCategory, "Select Sub Menu category", submenucategories, "name", reservationHasService.submenucategory_id.name);
        console.log("Reservation Menu submenu  ", reservationHasService)
        //menu
        fillCombo(cmbMenu, "Select Menu", menus, "menuname", reservationHasService.menu_id.menuname);
        fillCombo(cmbMenuCategory, "Select Menu category", menucategories, "name", reservationHasService.menucategory_id.name);

        //submenu
        fillCombo(cmbSMenu, "Select Sub Menu", submenus, "submenuname", reservationHasService.submenu_id.submenuname);
        fillCombo(cmbSMenuCategory, "Select Sub Menu category", submenucategories, "name", reservationHasService.submenucategory_id.name);

        txtMenuprice.value = parseFloat(reservationHasService.menuprice).toFixed(2);
        txtSMPrice.value = parseFloat(reservationHasService.submenuprice).toFixed(2);
        txtMenuOrderCount.value = reservationHasService.ordercount;
        txtMLineTotal.value = parseFloat(reservationHasService.linetotal).toFixed(2);
        txtSMLineTotal.style.border = valid;
        txtSMPrice.style.border = valid;
    }


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
    cmbRegCustomer.style.border = style;
    txtCName.style.border = style;
    txtDmobile.style.border = style;
    txtMenuprice.style.border = style;
    txtMenuOrderCount.style.border = style;
    txtMLineTotal.style.border = style;
    txtSMPrice.style.border = style;
    txtSMOrderCount.style.border = style;
    txtSMLineTotal.style.border = style;
    txtTAmount.style.border = style;
    txtDiscountRatio.style.border = style;
    txtLastPrice.style.border = style;
    txtSCharge.style.border = style;
    txtDAddress.style.border = style;


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
            tblDelivery.children[1].children[index].style.color = "#f00";
            tblDelivery.children[1].children[index].style.border = "2px solid red";
            tblDelivery.children[1].children[index].lastChild.children[1].disabled = true;
            tblDelivery.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

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
        txtDmobile.style.border = invalid;
    } else addvalue = 1;

    if (reservation.deliveryaddress == null) {
        errors = errors + "\n" + "Deliver Address Not Entered";
        txtDAddress.style.border = invalid;
    } else addvalue = 1;

    if (reservation.servicecharge == null) {
        errors = errors + "\n" + "Service charge Not Entered";
        txtSCharge.style.border = invalid;
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

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (cmbRegCustomer.value == "" || txtDiscountRatio.value == "") {
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
            "\n Service Charge: " + reservation.servicecharge,

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
                $('#tableview').modal('show')
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

    clearSelection(tblDelivery);
    selectRow(tblDelivery, activepage, active);

    reservation = JSON.parse(JSON.stringify(res));
    console.log("RES ", reservation);
    oldreservation = JSON.parse(JSON.stringify(res));


    txtCName.value = reservation.cname;
    txtDmobile.value = reservation.cmobile;
    txtDAddress.value = reservation.deliveryaddress;
    txtDiscountRatio.value = reservation.discountratio;
    txtLastPrice.value = reservation.lastprice;


    if (reservation.customer_id != null) {

        fillCombo(cmbRegCustomer, "Select Customer", customers, "mobileno", reservation.customer_id.mobileno);

    }


//Optional fields initial colour
    if (reservation.customer_id == null)
        cmbRegCustomer.style.border = initial;

    disableButtons(true, false, false);
    setStyle(valid);


    refreshInnerForm();
    // changeTab('form');
    $('#tableview').modal('hide')

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

        if (reservation.totalamount != oldreservation.totalamount)
            updates = updates + "\n total amount is Changed";

        if (reservation.discountratio != oldreservation.discountratio)
            updates = updates + "\n discount ratio is Changed";

        if (reservation.lastprice != oldreservation.lastprice)
            updates = updates + "\n Last price is Changed";
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
    formattab = tblDelivery.outerHTML;


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
    fillTable('tblDelivery', employees, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblDelivery);
    loadForm();

    if (activerowno != "") selectRow(tblDelivery, activerowno, active);


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