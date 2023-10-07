window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    $('[data-toggle="tooltip"]').tooltip()

    //add/clear/update button event handlers
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);
    txtSearchName.addEventListener("keyup", btnSearchMC);
    cmbReservation.addEventListener("change",getReservationAmount);
    cmbPMethod.addEventListener("change",getcmbPMethod);
    txtPAmount.addEventListener("keyup",getBalanceAmount);
    privilages = httpRequest("../privilage?module=CUSTOMERPAYMENTS", "GET");

    //1.Make arrays as reservations,paymentcategories,paymentstatuses,paymentmethods and employees to get list for combop box
    reservations = httpRequest("../reservation/deliverylist", "GET");
    cpstatuses = httpRequest("../cpstatus/list", "GET");
    cpmethods = httpRequest("../cpmethod/list", "GET");
    employees = httpRequest("../employee/list", "GET");
    //services should be implemented to get services then write services to get list
    //2.make controller and repository



    //colours
    valid = "2px solid #078D27B2";
    invalid = "2px solid red";
    initial = " #d6d6c2";
    updated = "3px solid #ff9900";
    active = "rgba(7,141,39,0.6)";


    loadView();
    //calling load view function for load view side
    loadForm();
    //calling load view function for load view side
    // changeTab('form');
    // //calling form tab
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

//for fill data into table
function loadTable(page, size, query) {
    page = page - 1;             //initially 0 page(1-1=0)
    customerpayments = new Array();     //customers list

    // Request to get customer list from URL
    var data = httpRequest("/customerpayment/findAll?page=" + page + "&size=" + size + query, "GET");

    if (data.content != undefined) customerpayments = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);

    //fill data into table using customers array
    //fill form-update, btnDeleteMc-Clear , Viewqreq-print
    fillTable('tblCustomerPayments', customerpayments, fillForm, btnDeleteMC, viewspay);
    clearSelection(tblCustomerPayments);

    if (activerowno != "") selectRow(tblCustomerPayments, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldcustomerpayment == null) {
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

//print row -get data into the print table
function viewspay(cpay, rowno) {

    customerpayment = JSON.parse(JSON.stringify(cpay));

    // tdBillNo.innerHTML = customerpayment.billno;
    tdReservation.innerHTML = customerpayment.reservation_id.reservationno;
    tdramount.innerHTML = customerpayment.reservationamount;
    tdcurrentamount.innerHTML = customerpayment.currentamount;
    tdPaidamount.innerHTML = customerpayment.paidamount;
    tdBAmount.innerHTML = customerpayment.balanceamount;
    // tdPaiddatetime.innerHTML = customerpayment.paiddatetime;


    tdPaymentMethod.innerHTML = customerpayment.cpmethod_id.name;
    tdPaymentStatus.innerHTML = customerpayment.cpstatus_id.name;


    $('#dataCPaymentModal').modal('show');

}

//Print row (as a table)
function btnPrintRowMC() {

    var format = printformtable.outerHTML;
    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
        " <link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
        "<body><div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 1500);
}

function getReservationAmount(){
    console.log(JSON.parse(cmbReservation.value).lastprice);
    let reservationAmount = JSON.parse(cmbReservation.value).lastprice;
    txtReservationAmount.value = parseFloat(reservationAmount).toFixed(2);
    customerpayment.reservationamount = reservationAmount;
    txtReservationAmount.style.border = valid;


    console.log("RSSSS ",JSON.parse(cmbReservation.value))

    current_amount = httpRequest("../customerpayment/getbycurrentamount?reservationid="+JSON.parse(cmbReservation.value).id,"GET");

    console.log("Current Amount ",current_amount)
    let currentAmount = current_amount.currentamount;
    txtCurrentAmount.value=parseFloat(currentAmount).toFixed(2);
    customerpayment.currentamount = currentAmount;
    txtCurrentAmount.style.border = valid;


    txtRAmount.value = parseFloat(txtReservationAmount.value).toFixed(2)-parseFloat(txtCurrentAmount.value).toFixed(2)
    customerpayment.remainningamount= txtRAmount.value;
    txtRAmount.style.border = valid;
}


function getBalanceAmount(){

    txtBalanceAmount.value = parseFloat(txtPAmount.value).toFixed(2)-parseFloat(txtRAmount.value).toFixed(2)
    customerpayment.balanceamount= txtBalanceAmount.value;
    txtBalanceAmount.style.border = valid;
}

function getcmbPMethod() {
    if (JSON.parse(cmbPMethod.value).name == "Cheque") {
        $('#ChequeView').modal('show');

    }
    if (JSON.parse(cmbPMethod.value).name == "Bank Deposit") {
        $('#DepositeView').modal('show');

    }
    if (JSON.parse(cmbPMethod.value).name == "Money Transfer") {
        $('#MoneyTView').modal('show');

    }

}

function loadForm() {
    //customerpayment front end object
    customerpayment = new Object();
    oldcustomerpayment = null;



    //fill data into combo box

    fillCombo(cmbReservation, "Select reservation", reservations, "reservationno", "");
    fillCombo(cmbPMethod, "Select Payment method", cpmethods, "name", "");



    // dtePDateTime.value = nowDate("datetime");
    // customerpayment.paiddatetime = dtePDateTime.value;
    // dtePDateTime.disabled = true;


    // nextcp = httpRequest("../customerpayment/nextcp", "GET");
    // txtBillNo.value = nextcp.billno;
    // customerpayment.billno = txtBillNo.value;
    // txtBillNo.disabled = true;


    //text field empty
    txtPAmount.value = "";
    txtReservationAmount.value = "";
    txtCurrentAmount.value = "";
    txtPAmount.value = "";
    txtBalanceAmount.value = "";

    txtRAmount.value = "";

    // txtRemark.value = "";
    txtTId.value = "";

    //deposite
    txtBname.value = "";
    txtBAccNo.value = "";
    dteDepoDateTime.value = "";
    txtHoName  = "";


    txtHName.value = "";

    //cheque
    txtCNo.value = "";
    dteChequeDate.value = "";

    // txtBBName = "";
    // txtHoName = "";
    // txtBaname = "";
    // txtBaAccNo = "";
    // txtTId = "";
    // dteDeposDateTime = "";

    //transfer
    txtTBBName.value = "";
    txtBaTname.value  = "";
    txtTHoName.value = "";
    txtTBaAccNo.value = "";
    txtTId.value = "";
    dteTDeposDateTime.value = "";






    // txtTACCname.value = "";

    // set field to initial color
    setStyle(initial);

    // dtePDateTime.style.border = valid;

    // txtBillNo.style.border = valid;

    disableButtons(false, true, true);

}

function setStyle(style) {

    // txtBillNo.style.border = style;
    txtReservationAmount.style.border = style;
    txtCurrentAmount.style.border = style;
    txtPAmount.style.border = style;
    txtRAmount.style.border = style;
    txtBalanceAmount.style.border = style;
    // dtePDateTime.style.border = style;
    dteDepoDateTime.style.border = style;

    //txtRemark.style.border = style;
    // txtTId.style.border = style;
    // txtBname.style.border = style;
    // txtTACCname.style.border = style;
    cmbReservation.style.border = style;
    cmbPMethod.style.border = style;


    //deposite
    txtBname.style.border = style;
    txtBAccNo.style.border = style;
    dteDepoDateTime.style.border = style;


    txtHName.style.border = style;

    //cheque
    txtCNo.style.border = style;
    dteChequeDate.style.border = style;


    //transfer
    txtTBBName.style.border = style;
    txtBaTname.style.border = style;
    txtTHoName.style.border = style;
    txtTBaAccNo.style.border = style;
    txtTId.style.border = style;
    dteTDeposDateTime.style.border = style;


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

    for (index in customerpayments) {
        if (customerpayments[index].cpstatus_id.name == "Deleted") {
            tblCustomerPayments.children[1].children[index].style.color = "rgb(9,9,9)";
            tblCustomerPayments.children[1].children[index].style.backgroundColor = "rgba(238,114,114,0.66)";

            tblCustomerPayments.children[1].children[index].lastChild.children[0].disabled = true;
            tblCustomerPayments.children[1].children[index].lastChild.children[0].style.cursor = "not-allowed";

            tblCustomerPayments.children[1].children[index].lastChild.children[1].disabled = true;
            tblCustomerPayments.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
           }

}

//get errors when click the Add button
function getErrors() {

    var errors = "";
    addvalue = "";

    // if (customerpayment.billno == null) {
    //     errors = errors + "\n" + "Bill No Not Entered";
    //     txtBillNo.style.border = invalid;
    // } else addvalue = 1;


    if (customerpayment.reservation_id == null) {
        errors = errors + "\n" + "Reservation not selected";
        cmbReservation.style.border = invalid;
    } else addvalue = 1;


    if (customerpayment.reservationamount == null) {
        errors = errors + "\n" + "Reservation Amount Not Entered";
        txtReservationAmount.style.border = invalid;
    } else addvalue = 1;

    if (customerpayment.currentamount == null) {
        errors = errors + "\n" + "Current Amount Not Entered";
        txtCurrentAmount.style.border = invalid;
    } else addvalue = 1;

    if (customerpayment.paidamount == null) {
        errors = errors + "\n" + "Paid amount Not Entered";
        txtPAmount.style.border = invalid;
    } else addvalue = 1;

    if (customerpayment.balanceamount == null) {
        errors = errors + "\n" + "Balanceamount Not Entered";
        txtBalanceAmount.style.border = invalid;
    } else addvalue = 1;

    if (customerpayment.remainningamount == null) {
        errors = errors + "\n" + "Remainning amount Not Entered";
        txtRAmount.style.border = invalid;
    } else addvalue = 1;

    // if (customerpayment.paiddatetime == null) {
    //     errors = errors + "\n" + "Paiddate not selected";
    //     dtePDateTime.style.border = invalid;
    // } else addvalue = 1;

    if (customerpayment.cpmethod_id == null) {
        errors = errors + "\n" + "Cp method not selected";
        cmbPMethod.style.border = invalid;
    } else addvalue = 1;

    // if (customerpayment.cpstatus_id == null) {
    //     errors = errors + "\n" + "cp status not selected";
    //     cmbPStatus.style.border = invalid;
    // } else addvalue = 1;


    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (  txtBname.value == "" ||  txtBAccNo.value == "" ||  dteDepoDateTime.value == "" ||  txtHoName .value == "" || txtCNo.value == "" || dteChequeDate.value == "" || txtTBBName.value == "" || txtBaTname.value == "" || txtTHoName.value =="" || txtTBaAccNo.value || txtTId.value == "" || dteTDeposDateTime .value == "" ) {
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
        title: "Are you sure to add following Customer Payment...?",
        text:
            "\nBill NO: " + customerpayment.billno +
            "\nReservation Amount : " + customerpayment.reservationamount +
            "\nCurrentAmount : " + customerpayment.currentamount +
            "\nPaid Amount : " + customerpayment.paidamount +
            "\nBalance Amount : " + customerpayment.balanceamount +
            "\nPaid Date Time : " + customerpayment.paiddatetime +
            "\nRemain Balance : " + customerpayment.remainningamount +

            "\nCP Method : " + customerpayment.cpmethod_id.name +
            // "\nCP Status : " + customerpayment.cpstatus_id.name +
            // "\nEmployee : " + customerpayment.employee_id.callingname +
            "\nReservation : " + customerpayment.reservation_id.reservationno,


        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/customerpayment", "POST", customerpayment);
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

    if (oldcustomer == null && addvalue == "") {
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

//Update - Get a user confirmation for refill form
function fillForm(cpay, rowno) {
    activerowno = rowno;

    if (oldcustomerpayment == null) {
        filldata(cpay);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(cpay);
            }

        });
    }

}

//Update - Refill data into form
function filldata(cpay) {

    clearSelection(tblCustomerPayments);
    selectRow(tblCustomerPayments, activerowno, active);

    customerpayment = JSON.parse(JSON.stringify(cpay));
    oldcustomerpayment = JSON.parse(JSON.stringify(cpay));


    // txtBillNo.value = customerpayment.billno;
    txtReservationAmount.value = customerpayment.reservationamount;
    txtCurrentAmount.value = customerpayment.currentamount;
    txtPAmount.value = customerpayment.paidamount;
    txtBalanceAmount.value = customerpayment.balanceamount;
    txtRAmount.value = customerpayment.balanceamount;

    // dtePDateTime.value = customerpayment.paiddatetime;
    cmbReservation.value = customerpayment.reservation_id;
    cmbPMethod.value = customerpayment.cpmethod_id.name;
    // cmbPStatus.value = customerpayment.cpstatus_id.name;


    fillCombo(cmbReservation, "Select reservation", reservations, "cmobile", customerpayment.reservation_id);
    fillCombo(cmbPMethod, "Select Payment method", cpmethods, "name", customerpayment.cpmethod_id.name);
    // fillCombo(cmbPStatus, "Select Payment status", cpstatuses, "name", "Available");
    // cmbPStatus.disabled = false;

    disableButtons(true, false, false);
    setStyle(valid);
    changeTab('form');

    //Optional fields initial colour

    if (customerpayment.depositeddatetime == null)
        dteDepoDateTime.style.border = initial;

    if (customerpayment.bankname == null)
        txtBname.style.border = initial;

    // if (customerpayment.remark == null)
    //     txtRemark.style.border = initial;

    if (customerpayment.transferid == null)
        txtTId.style.border = initial;

    if (customerpayment.remainningamount == null)
        txtRAmount.style.border = initial;

    // if (customerpayment.transferaccname == null)
    //     txtTACCname.style.border = initial;
}

//Update-Display updated values msg
function getUpdates() {

    var updates = "";

    if (customerpayment != null && oldcustomerpayment != null) {

        // if (customerpayment.billno != oldcustomerpayment.billno)
        //     updates = updates + "\nBill NO is Changed.." + oldcustomerpayment.billno + " into " + customerpayment.billno;

        if (customerpayment.reservation_id.reservationno != oldcustomerpayment.reservation_id.reservationno)
            updates = updates + "\nReservation is Changed.." + oldcustomerpayment.reservation_id.cmobile + " into " + customerpayment.reservation_id.cmobile;

        if (customerpayment.reservationamount != oldcustomerpayment.reservationamount)
            updates = updates + "\n Paid amount is Changed.. " + oldcustomerpayment.reservationamount + " into " + customerpayment.reservationamount;

        if (customerpayment.currentamount != oldcustomerpayment.currentamount)
            updates = updates + "\n Paid amount is Changed.. " + oldcustomerpayment.reservationamount + " into " + customerpayment.reservationamount;

        if (customerpayment.paidamount != oldcustomerpayment.paidamount)
            updates = updates + "\n Paid amount is Changed.. " + oldcustomerpayment.paidamount + " into " + customerpayment.paidamount;

        if (customerpayment.balanceamount != oldcustomerpayment.balanceamount)
            updates = updates + "\n Balance amount is Changed.." + oldcustomerpayment.balanceamount + " into " + customerpayment.balanceamount;

        if (customerpayment.remainningamount != oldcustomerpayment.remainningamount)
            updates = updates + "\n Remain amount is Changed.." + oldcustomerpayment.remainningamount + " into " + customerpayment.remainningamount;

        if (customerpayment.paiddatetime != oldcustomerpayment.paiddatetime)
            updates = updates + "\nPaid date is Changed.." + oldcustomerpayment.paiddatetime + " into " + customerpayment.paiddatetime;

        if (customerpayment.description != oldcustomerpayment.description)
            updates = updates + "\n description is Changed." + oldcustomerpayment.description + " into " + customerpayment.description;

        if (customerpayment.bankname != oldcustomerpayment.bankname)
            updates = updates + "\n Bank Name is Changed.." + oldcustomerpayment.bankname + " into " + customerpayment.bankname;

        if (customerpayment.depositeddatetime != oldcustomerpayment.depositeddatetime)
            updates = updates + "\n Deposited date time is Changed.." + oldcustomerpayment.depositeddatetime + " into " + customerpayment.depositeddatetime;

        if (customerpayment.transferid != oldcustomerpayment.transferid)
            updates = updates + "\n transfer id is Changed.." + oldcustomerpayment.transferid + " into " + customerpayment.transferid;

        if (customerpayment.transferaccname != oldcustomerpayment.transferaccname)
            updates = updates + "\n transfer id is Changed.." + oldcustomerpayment.transferaccname + " into " + customerpayment.transferaccname;

        if (customerpayment.remark != oldcustomerpayment.remark)
            updates = updates + "\n transfer id is Changed.." + oldcustomerpayment.remark + " into " + customerpayment.remark;

        if (customerpayment.cpmethod_id.name != oldcustomerpayment.cpmethod_id.name)
            updates = updates + "\n Payment method is Changed.." + oldcustomerpayment.cpmethod_id.name + " into " + customerpayment.cpmethod_id.name;


        if (customerpayment.cpstatus_id.name != oldcustomerpayment.cpstatus_id.name)
            updates = updates + "\n Payment status is Changed.." + oldcustomerpayment.cpstatus_id.name + " into " + customerpayment.cpstatus_id.name;

    }

    return updates;

}

//update-
function btnUpdateMC() {
    var errors = getErrors();                                                                        //fistly check errors
    if (errors == "") {
        var updates = getUpdates();                                                                 //check update is empty? and nothing to update?
        if (updates == "")
            swal({
                title: 'Nothing Updated..!', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
        else {                                                                                      //if there are updates then
            swal({
                title: "Are you sure to update following customer details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/customerpayment", "PUT", customerpayment);
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

                        } else swal({
                            title: 'Failed to add ...', icon: "error",
                            text: 'You have following error \n' + response,
                            button: true
                        });
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

function btnDeleteMC(spay) {
    customerpayment = JSON.parse(JSON.stringify(spay));

    swal({
        title: "Are you sure to delete following Supplier Payment...?",
        text:
            "\nBill NO: " + customerpayment.billno,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/customerpayment", "DELETE", customerpayment);
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
    //for Load Table
    loadTable(activepage, cmbPageSize.value, query);
    disableButtons(false, true, true);

}

function btnSearchMC() {
    activepage = 1;
    loadSearchedTable();
}

function btnSearchClearMC() {
    loadView();
}

//Print
function btnPrintTableMC(spay) {
    //open new tab USING window.open() in the browser
    var newwindow = window.open();

    //put the outerhtml of the tblPorder in to formattab variable
    formattab = tblCustomerPayments.outerHTML;

    //write print table in the new tab using .document.write
    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Customer payments Details : </h1></div>" +
        "<div>" + formattab + "</div>" +
        "</body>" +
        "</html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 1500);
}

function btnSignoutMC() {
    var willDelete = confirm("Do you want to sign out?");
    if (willDelete) {
        alert("Sign Out Successful");
        setTimeout(function() {
            window.location.assign('/logout');
        }, 1500);
    }
}



function sortTable(cind) {
    cindex = cind;

    var cprop = tblcustomer.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        customers.sort(
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
        customers.sort(
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
    fillTable('tblcustomer', customers, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblcustomer);
    loadForm();

    if (activerowno != "") selectRow(tblcustomer, activerowno, active);


}