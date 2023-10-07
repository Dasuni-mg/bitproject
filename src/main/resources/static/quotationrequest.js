window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    $('[data-toggle="tooltip"]').tooltip()

    //add/clear/update button event handlers
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);
    txtSearchName.addEventListener("keyup", btnSearchMC);


    privilages = httpRequest("../privilage?module=QUOTATIONREQUEST", "GET");
    //Make arrays as suppliers,qrstatuses and emplooyes to get list for combop box
    suppliers = httpRequest("../supplier/list", "GET");


    //services should be implemented to get services then write services to get list
    //2.make controller and repository

    //colours
    valid = "3px solid #078D27B2";
    invalid = "3px solid red";
    initial = " #d6d6c2";
    updated = "3px solid #ff9900";
    active = "rgba(7,141,39,0.6)";

    loadView();
    //calling load view function for load view side
    loadForm();
    //calling load view function for load view side



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
    page = page - 1;                    //initially 0 page(1-1=0)
    quotationrequests = new Array();    //quotationrequests array

    //request quotationrequest data list from the URL
    var data = httpRequest("/quotationrequest/findAll?page=" + page + "&size=" + size + query, "GET");

    if (data.content != undefined) quotationrequests = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);

    //fill data into table using quotation requests array
    //fill form-update, btnDeleteMc-Clear , Viewqreq-print
    fillTable('tblQuotationRequest', quotationrequests, fillForm, btnDeleteMC, viewqreq);
    clearSelection(tblQuotationRequest);

    if (activerowno != "") selectRow(tblQuotationRequest, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldquotationrequest == null) {
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
function viewqreq(qreq, rowno) {

    quotationrequest = JSON.parse(JSON.stringify(quotationrequest));

    tdQRcode.innerHTML = quotationrequest.qrcode;
    tdsupid.innerHTML = quotationrequest.supplier_id;
    tdemployee.innerHTML = quotationrequest.employee_id.callingname;
    tdRdate.innerHTML = quotationrequest.requireddate;


    $('#tableview').modal('show')
}

//Print row (as a table)
function btnPrintRowMC() {
    var format = printformtable.outerHTML;
    var newwindow = window.open();

    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'/>" +
        "<body><div style='margin-top: 150px'><h1>Quotation Request Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 1000);
}

function loadForm() {
    quotationrequest = new Object();

    oldquotationrequest = null;
    //no old object when the form is loading


    //fill data into combo box
    // fieldid,Message,Data list(array name),Display property, selected value
    fillCombo(cmbSupplier, "Select a supplier", suppliers, "fullname", "");

    //text field empty
    dateRequiredDate.value = "";


    //auto bind fields
    setStyle(initial);


    disableButtons(false, true, true);
}

function setStyle(style) {

    dateRequiredDate.style.border = style;
    cmbSupplier.style.border = style;
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
    for (index in quotationrequests) {
        if (quotationrequests[index].qrstatus_id.name == "Deleted") {
            tblQuotationRequest.children[1].children[index].style.color = "rgb(9,9,9)";
            tblQuotationRequest.children[1].children[index].style.backgroundColor = "rgba(238,114,114,0.66)";

            tblQuotationRequest.children[1].children[index].lastChild.children[1].disabled = true;
            tblQuotationRequest.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";
        }

        tblQuotationRequest.children[1].children[index].lastChild.children[0].disabled = true;
        tblQuotationRequest.children[1].children[index].lastChild.children[0].style.cursor = "not-allowed";

    }
}
function getErrors() {


    var errors = "";
    addvalue = "";

    if (quotationrequest.requireddate == null) {
        errors = errors + "\n" + "Required Date Not Entered";
        dateRequiredDate.style.border = invalid;
    } else addvalue = 1;


    if (quotationrequest.supplier_id == null) {
        errors = errors + "\n" + "Supplier  Not Selected";
        cmbSupplier.style.border = invalid;
    } else addvalue = 1;

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {

            savedata();

    } else {
        swal({
            title: "You have following errors",
            text: "\n" + getErrors(),
            icon: "error",
            button: true,
            className: "purple-swal",
        });

    }
}

function savedata() {

    swal({
        title: "Are you sure to add following quotation request...?",
        text:    "\n Supplier : " + quotationrequest.supplier_id.fullname +
           "\n Required Date : " + quotationrequest.requireddate,

        icon: "warning",
        buttons: true,
        dangerMode: true,className: "purple-swal",
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/quotationrequest", "POST", quotationrequest);
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
                loadSearchedTable();
                loadForm();
                $('#tableview').modal('show');

            } else swal({
                title: 'Save not Success... , You have following errors', icon: "error",
                text: '\n ' + response,
                button: true,
                className: "purple-swal",
            });
        }
    });
}

function btnClearMC() {
    //Get Cofirmation from the User window.confirm();
    checkerr = getErrors();

    if (oldquotationrequest == null && addvalue == "") {
        loadForm();
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,className: "purple-swal",
        }).then((willDelete) => {
            if (willDelete) {
                loadForm();
            }
        });
    }
}

//Update - Get a user confirmation for refill form
function fillForm(qreq, rowno) {
    activerowno = rowno;

    //check old object null or not
    if (oldquotationrequest == null) {
        filldata(qreq);
    } else {
        swal({
            title: "Form has some values, updates values...Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,className: "purple-swal",
        }).then((willDelete) => {
            if (willDelete) {
                filldata(qreq);
            }
        });
    }
}

//Update - Refill data into form
function filldata(qreq) {
    clearSelection(tblQuotationRequest);
    selectRow(tblQuotationRequest, activerowno, active);

    quotationrequest = JSON.parse(JSON.stringify(qreq));
    oldquotationrequest = JSON.parse(JSON.stringify(qreq));


    dateRequiredDate.value=quotationrequest.requireddate;

    fillCombo(cmbSupplier, "", suppliers, "fullname", "quotationrequest.supplier_id.fullname");

    disableButtons(true, false, false);
    setStyle(valid);

    $('#tableview').modal('hide')



}

//Update-Display updated values msg
function getUpdates() {

    var updates = "";

    if (quotationrequest != null && oldquotationrequest != null) {
        if (quotationrequest.requireddate != oldquotationrequest.requireddate)
            updates = updates + "\nRequired Date :" + oldquotationrequest.requireddate + " is Changed into " + quotationrequest.requireddate ;


        if (quotationrequest.supplier_id.fullname != oldquotationrequest.supplier_id.fullname)
            updates = updates + "\nSupplier :" + oldquotationrequest.supplier_id.fullname+ " is Changed into " + quotationrequest.supplier_id.fullname ;
    }

    return updates;
}

//update
function btnUpdateMC() {
    var errors = getErrors();
    if (errors == "") {
        var updates = getUpdates();
        if (updates == "")
            swal({
                title: 'Nothing Updated..!',icon: "warning",
                text: '\n',
                button: false,
                timer: 1200,className: "purple-swal",});
        else {
            swal({
                title: "Are you sure to update following Quotation Request details...?",
                text: "\n"+ getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,className: "purple-swal",
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/quotationrequest", "PUT", quotationrequest);
                        if (response == "0") {
                            swal({
                                position: 'center',
                                icon: 'success',
                                title: 'Your work has been Done \n Update SuccessFully..!',
                                text: '\n',
                                button: false,
                                timer: 1200,
                            });
                            loadSearchedTable();
                            loadForm();
                            $('#tableview').modal('show');

                        } else window.alert("Failed to Update as \n\n" + response);
                    }
                });
        }
    } else
        swal({
            title: 'You have following errors in your form', icon: "error",
            text: '\n ' + getErrors(),
            button: true,className: "purple-swal",
        });

}

function btnDeleteMC(qreq) {
    quotationrequest = JSON.parse(JSON.stringify(qreq));

    swal({
        title: "Are you sure to delete following Quotation Request...?",
        text: "\n QR code: " + quotationrequest.qrcode,
        icon: "warning", buttons: true, dangerMode: true,className: "purple-swal",
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/quotationrequest", "DELETE", quotationrequest);
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
                    icon: "error", button: true,className: "purple-swal",
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

//Print-Table
function btnPrintTableMC(quotationrequest) {

    var newwindow = window.open();
    formattab = tblQuotationRequest.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='/resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Quotation Request Details : </h1></div>" +
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