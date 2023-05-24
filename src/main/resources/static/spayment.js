window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    $('[data-toggle="tooltip"]').tooltip()

    //add/clear/update button event handlers
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);
    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=SPAYMENT", "GET");

    //1.Make arrays as suppliers,paymentmethods,paymentstatuses and employees to get list for combop box
    suppliers = httpRequest("../supplier/list", "GET");
    grns = httpRequest("../grn/list", "GET");
    paymentstatuses = httpRequest("../paymentstatus/list", "GET");
    paymentmethods = httpRequest("../paymentmethod/list", "GET");
    employees = httpRequest("../employee/list", "GET");
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
    //calling form tab
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
    spayments = new Array();     //spayments list

    // Request to get spayment list from URL
    var data = httpRequest("/spayment/findAll?page=" + page + "&size=" + size + query, "GET");

    if (data.content != undefined) spayments = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);

    //fill data into table using spayments array
    //fill form-update, btnDeleteMc-Clear , Viewqreq-print
    fillTable('tblSpayment', spayments, fillForm, btnDeleteMC, viewspay);
    clearSelection(tblSpayment);

    if (activerowno != "") selectRow(tblSpayment, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldspayment == null) {
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
function viewspay(spay, rowno) {

    spayment = JSON.parse(JSON.stringify(spay));



    tdBillNo.innerHTML = spayment.billno;
    tdSupplier.innerHTML = spayment.supplier_id.fullname;
    tdGrn.innerHTML = spayment.grn_id.grncode;
    tdGRNAmount.innerHTML = spayment.grnamount;
    tdTAmount.innerHTML = spayment.totalamount;
    tdPaidamount.innerHTML = spayment.paidamount;
    tdPaymentmethod.innerHTML = spayment.paymentmethod_id.name;
    tdPaymentstatus.innerHTML = spayment.paymentstatus_id.name;

    $('#dataViewModal').modal('show');

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

function loadForm() {
    //spayment front end object
    spayment = new Object();
    oldspayment = null;


    //fill data into combo box

    fillCombo(cmbSupplier, "Select Supplier", suppliers, "fullname", "");
    fillCombo(cmbGrnId, "Select GRN", grns, "grncode", "");


//Auto fill combo box
    fillCombo(cmbEmployee,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);
    spayment.employee_id=JSON.parse(cmbEmployee.value);
    cmbEmployee.disabled = true;

    fillCombo(cmbpstatus, "Select Payment status", paymentstatuses, "name", "Available");
    spayment.paymentstatus_id = JSON.parse(cmbpstatus.value);
    cmbpstatus.disabled = true;

    fillCombo(cmbPMethod, "Select Payment method", paymentmethods, "name", "Cash");
    spayment.paymentmethod_id = JSON.parse(cmbPMethod.value);




    //create date object
    var today = new Date();
    //get month--> array(0-11)
    var month = today.getMonth()+1;
    //browser format of month is YYYY-MM-DD(jan-01,feb-02,..)
    if(month<10) month = "0"+month; //YYYY-MM-DD
    //browser format of date is YYYY-MM-DD(01,02,..)
    //get date-->range(1-31)
    var date = today.getDate();
    if(date<10) date = "0"+date;//YYYY-MM-DD

    dtePDate.value= today.getFullYear()+"-"+month+"-"+date;
    spayment.paiddate=dtePDate.value;
    dtePDate.disabled = true;



    nextsp = httpRequest("../spayment/nextsp","GET");
    txtBillNo.value = nextsp.billno;
    spayment.billno = txtBillNo.value;
    txtBillNo.disabled = true;

    txtgrnAmount.value = "0.00";
    txtgrnAmount.disabled = true;
    spayment.grnamount = txtgrnAmount.value;

    txtTAmount.value = "0.00";
    txtTAmount.disabled = true;
    spayment.totalamount = txtTAmount.value;

    txtBAmount.value = "0.00";
    txtBAmount.disabled = true;
    spayment.balanceamount = txtBAmount.value;

    //text field empty
    txtPAmount.value = "";
    txtDescription.value = "";
    txtCDate.value = "";
    txtchequeno.value = "";
    txtBAccNo.value = "";
    txtBACCname.value = "";
    txtBname.value = "";
    txtBBName.value = "";
    dteDepodate.value = "";
    txtTId.value = "";


    // set field to initial color
    setStyle(initial);
    cmbpstatus.style.border=valid;
    dtePDate.style.border=valid;
    cmbEmployee.style.border=valid;
    cmbPMethod.style.border=valid;
    txtgrnAmount.style.border=valid;
    txtTAmount.style.border=valid;
    txtBAmount.style.border=valid;
    txtBillNo.style.border=valid;

    disableButtons(false, true, true);

}

function setStyle(style) {


    txtBillNo.style.border = style;
    txtgrnAmount.style.border = style;
    txtTAmount.style.border = style;
    txtPAmount.style.border = style;
    txtBAmount.style.border = style;
    dtePDate.style.border = style;
    txtDescription.style.border = style;
    txtCDate.style.border = style;
    txtchequeno.style.border = style;
    txtBAccNo.style.border = style;
    txtBACCname.style.border = style;
    txtBname.style.border = style;
    txtBBName.style.border = style;
    dteDepodate.style.border = style;
    txtTId.style.border = style;
    cmbpstatus.style.border = style;
    cmbPMethod.style.border = style;
    cmbSupplier.style.border = style;
    cmbGrnId.style.border = style;


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

    for (index in spayments) {
        if (spayments[index].paymentstatus_id.name == "Deleted") {
            tblSpayment.children[1].children[index].style.color = "#f00";
            tblSpayment.children[1].children[index].style.border = "2px solid red";
            tblSpayment.children[1].children[index].lastChild.children[1].disabled = true;
            tblSpayment.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

//get errors when click the Add button
function getErrors() {

    var errors = "";
    addvalue = "";

    if (spayment.billno == null) {
        errors = errors + "\n" + "Bill No Not Entered";
        txtBillNo.style.border = invalid;
    } else addvalue = 1;


    if (spayment.grnamount == null) {
        errors = errors + "\n" + "GRN Amount Not Entered";
        txtgrnAmount.style.border = invalid;
    } else addvalue = 1;

    if (spayment.totalamount == null) {
        errors = errors + "\n" + "Total Amount Not Entered";
        txtTAmount.style.border = invalid;
    } else addvalue = 1;

    if (spayment.paidamount == null) {
        errors = errors + "\n" + "Paid amount Not Entered";
        txtPAmount.style.border = invalid;
    } else addvalue = 1;

    if (spayment.balanceamount == null) {
        errors = errors + "\n" + "Balanceamount Not Entered";
        txtBAmount.style.border = invalid;
    } else addvalue = 1;

    if (spayment.supplier_id == null) {
        errors = errors + "\n" + "Supplier not selected";
        cmbSupplier.style.border = invalid;
    } else addvalue = 1;




    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtDescription.value == "" || txtCDate.value == "" || txtchequeno.value == "" || txtBAccNo.value == "" || txtBACCname.value == "" || txtBname.value == "" || txtBBName.value == "" || dteDepodate.value == "" || txtTId.value == "") {
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
        title: "Are you sure to add following Supplier Payment...?",
        text:
            "\nBill NO: " + spayment.billno +
            "\nSupplier : " + spayment.supplier_id.fullname +
            "\nGrn : " + spayment.grn_id +
            "\nGRN Amount : " + spayment.grnamount +
            "\nTotal Amount : " + spayment.totalamount +
            "\nPaid Amount : " + spayment.paidamount +
            "\nBalance Amount : " + spayment.balanceamount +
            "\nPaid Date : " + spayment.paiddate +
            "\nPaymentmethod : " + spayment.paymentmethod_id.name +
            "\nPaymentstatus : " + spayment.paymentstatus_id.name,


        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/spayment", "POST", spayment);
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

    if (oldspayment == null && addvalue == "") {
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
function fillForm(spay, rowno) {
    activerowno = rowno;

    if (oldspayment == null) {
        filldata(spay);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(spay);
            }

        });
    }

}

//Update - Refill data into form
function filldata(spay) {

    clearSelection(tblSpayment);
    selectRow(tblSpayment, activerowno, active);

    spayment = JSON.parse(JSON.stringify(spay));
    oldspayment = JSON.parse(JSON.stringify(spay));


    txtBillNo.value = spayment.billno;
    txtgrnAmount.value = spayment.grnamount;
    txtTAmount.value = spayment.totalamount;
    txtPAmount.value = spayment.paidamount;
    txtBAmount.value = spayment.balanceamount;
    txtPDate.value = spayment.paiddate;
    txtDescription.value = spayment.description;
    txtCDate.value = spayment.chequedate;
    txtchequeno.value = spayment.chequeno;
    txtBAccNo.value = spayment.bankaccno;
    txtBACCname.value = spayment.bankaccname;
    txtBname.value = spayment.bankname;
    txtBBName.value = spayment.bankbranchname;
    dteDepodate.value = spayment.depositeddatetime;
    txtTId.value = spayment.transferid;
    cmbPMethod.value = spayment.paymentmethod_id.name;
    cmbSupplier.value = spayment.supplier_id.fullname;
    cmbGrnId.value = spayment.grn_id.grncode;


    fillCombo(cmbSupplier, "Select Supplier", suppliers, "fullname", "");
    fillCombo(cmbGrnId, "Select GRN", grns, "grncode", "");
    fillCombo(cmbPMethod, "Select Payment method", paymentmethods, "name", "");


    disableButtons(true, false, false);
    setStyle(valid);
    changeTab('form');

    //Optional fields initial colour
    if(spayment.description == null)
        txtDescription.style.border= initial;

    if(spayment.chequedate == null)
        txtCDate.style.border= initial;

    if(spayment.chequeno == null)
        txtchequeno.style.border= initial;

    if(spayment.bankaccno == null)
        txtBAccNo.style.border= initial;

    if(spayment.bankaccname == null)
        txtBACCname.style.border= initial;

    if(spayment.depositeddatetime == null)
        dteDepodate.style.border= initial;

    if(spayment.bankname == null)
        txtBname.style.border= initial;

    if(spayment.bankbranchname == null)
        txtBBName.style.border= initial;

    if(spayment.transferid == null)
        txtTId.style.border= initial;
}

//Update-Display updated values msg
function getUpdates() {

    var updates = "";

    if (spayment != null && oldspayment != null) {

        if (spayment.billno != oldspayment.billno)
            updates = updates + "\nBill NO is Changed.." + oldspayment.billno + " into " + spayment.billno;

        if (spayment.grnamount != oldspayment.grnamount)
            updates = updates + "\nGrn amount is Changed.." + oldspayment.grnamount + " into " + spayment.grnamount;

        if (spayment.totalamount != oldspayment.totalamount)
            updates = updates + "\nTotal amount is Changed.." + oldspayment.totalamount + " into " + spayment.totalamount;

        if (spayment.paidamount != oldspayment.paidamount)
            updates = updates + "\n Paid amount is Changed.. " + oldspayment.paidamount + " into " + spayment.paidamount;

        if (spayment.balanceamount != oldspayment.balanceamount)
            updates = updates + "\n Balance amount is Changed.." + oldspayment.balanceamount + " into " + spayment.balanceamount;

        if (spayment.paiddate != oldspayment.paiddate)
            updates = updates + "\nPaid date is Changed.." + oldspayment.paiddate + " into " + spayment.paiddate;

        if (spayment.description != oldspayment.description)
            updates = updates + "\n description is Changed." + oldspayment.description + " into " + spayment.description;

        if (spayment.chequedate != oldspayment.chequedate)
            updates = updates + "\n Cheque date is Changed.." + oldspayment.chequedate + " into " + spayment.chequedate;

        if (spayment.chequeno != oldspayment.chequeno)
            updates = updates + "\n Cheque no is Changed.." + oldspayment.chequeno + " into " + spayment.chequeno;

        if (spayment.bankaccno != oldspayment.bankaccno)
            updates = updates + "\n  Bank acc no is Changed.." + oldspayment.bankaccno + " into " + spayment.bankaccno;

        if (spayment.bankaccname != oldspayment.bankaccname)
            updates = updates + "\n  Bank acc Name Id is Changed.." + oldspayment.bankaccname + " into " + spayment.bankaccname.name;

        if (spayment.bankname != oldspayment.bankname)
            updates = updates + "\n Bank Name is Changed.." + oldspayment.bankname + " into " + spayment.bankname;

        if (spayment.bankbranchname != oldspayment.bankbranchname)
            updates = updates + "\n Bank branch name is Changed." + oldspayment.bankbranchname + " into " + spayment.bankbranchname;

        if (spayment.depositeddatetime != oldspayment.depositeddatetime)
            updates = updates + "\n Deposited date time is Changed.." + oldspayment.depositeddatetime + " into " + spayment.depositeddatetime;

        if (spayment.transferid != oldspayment.transferid)
            updates = updates + "\n transfer id is Changed.." + oldspayment.transferid + " into " + spayment.transferid;

        if (spayment.supplier_id.fullname != oldspayment.supplier_id.fullname)
            updates = updates + "\n supplier is Changed.." + oldspayment.supplier_id.fullname + " into " + spayment.supplier_id.fullname;

        if (spayment.grn_id.grncode != oldspayment.grn_id.grncode)
            updates = updates + "\n Grn is Changed.." + oldspayment.grn_id.grncode + " into " + spayment.grn_id.grncode;

        if (spayment.paymentmethod_id.name != oldspayment.paymentmethod_id.name)
            updates = updates + "\n Payment method is Changed.." + oldspayment.paymentmethod_id.name + " into " + spayment.paymentmethod_id.name;

        if (spayment.paymentstatus_id.name != oldspayment.paymentstatus_id.name)
            updates = updates + "\n Payment status is Changed.." + oldspayment.paymentstatus_id.name + " into " + spayment.paymentstatus_id.name;

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
                title: "Are you sure to update following spayment details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/spayment", "PUT", spayment);
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
    spayment = JSON.parse(JSON.stringify(spay));

    swal({
        title: "Are you sure to delete following Supplier Payment...?",
        text:
            "\nBill NO: " + spayment.billno +
            "\nSupplier : " + spayment.supplier_id.fullname +
            "\nGrn : " + spayment.grn_id.grncode +
            "\nGRN Amount : " + spayment.grnamount +
            "\nTotal Amount : " + spayment.totalamount +
            "\nPaid Amount : " + spayment.paidamount +
            "\nBalance Amount : " + spayment.balanceamount +
            "\nPaid Date : " + spayment.paiddate +
            "\nPaymentmethod : " + spayment.paymentmethod_id.name +
            "\nPaymentstatus : " + spayment.paymentstatus_id.name,

        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/spayment", "DELETE", spayment);
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
    formattab = tblSpayment.outerHTML;

    //write print table in the new tab using .document.write
    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Supplier payments Details : </h1></div>" +
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

    var cprop = tblspayment.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        spayments.sort(
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
        spayments.sort(
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
    fillTable('tblspayment', spayments, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblspayment);
    loadForm();

    if (activerowno != "") selectRow(tblspayment, activerowno, active);


}