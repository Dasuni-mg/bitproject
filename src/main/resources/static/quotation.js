window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    $('[data-toggle="tooltip"]').tooltip()

    //add/clear/update button event handlers
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);
    txtSearchName.addEventListener("keyup", btnSearchMC);
    cmbSupplier.addEventListener("change", cmbSupplierMC);
    cmbSupplier.addEventListener("change", cmbSupplierMC1);


    privilages = httpRequest("../privilage?module=QUOTATION", "GET");

    //Make arrays as genders,designations,civilstatuses and employeestatuses to get list for combop box
    quotationrequests = httpRequest("../quotationrequest/list", "GET");
    quotationstatuses = httpRequest("../quotationstatus/list", "GET");
    employees = httpRequest("../employee/list", "GET");
    suppliers = httpRequest("../supplier/list", "GET");
    //inner-materials array
    materials = httpRequest("../material/list", "GET");

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
    page = page - 1;            //initially 0 page(1-1=0)
    quotations = new Array();    //quotations array

    //Request to get quotation  list from URL
    var data = httpRequest("/quotation/findAll?page=" + page + "&size=" + size + query, "GET");

    if (data.content != undefined) quotations = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);

    //fill data into table using quotations array
    //fill form-update, btnDeleteMc-Clear , Viewqreq-print
    fillTable('tblQuotation', quotations, fillForm, btnDeleteMC, viewquo);
    clearSelection(tblQuotation);

    if (activerowno != "") selectRow(tblQuotation, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldquotation = null) {
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
function viewquo(quo, rowno) {

    quotation = JSON.parse(JSON.stringify(quo));

    tdQCode.innerHTML = quotation.quotationcode;
    tdQRequest.innerHTML = quotation.quotationrequest_id.name;
    tdRDate.innerHTML = quotation.receiveddate;
    tdVFrom.innerHTML = quotation.validfrom;
    tdVTo.innerHTML = quotation.validto;
    tdAddDate.innerHTML = quotation.addeddate;
    tdQStatus.innerHTML = quotation.quotationstatus_id.name;
    tdEmployee.innerHTML = quotation.employee_id.callingname;


    $('#dataViewModal').modal('show')

}

function btnPrintRowMC() {

    var format = printformtable.outerHTML;
    var newwindow = window.open();

    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'/>" +
        "<body><div style='margin-top: 150px'><h1>Quotation Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 1000);
}

//when select supplier auto select quotation requests related to that supplier
// Service-[/quotationrequest/listbysupplier?supplierid=]
function cmbSupplierMC() {
    quotationrequestsbysupplier = httpRequest("/quotationrequest/listbysupplier?supplierid=" + JSON.parse(cmbSupplier.value).id, "GET");
    fillCombo(cmbQrequest, "Select Quotation Request", quotationrequestsbysupplier, "qrcode", "");


}


///when select supplier auto select materials suppliy by that supplier
// Service-[/material/materiallistbysupplier?supplierid=]
function cmbSupplierMC1() {
    materialbysupplier = httpRequest("/material/materiallistbysupplier?supplierid=" + JSON.parse(cmbSupplier.value).id, "GET");
    fillCombo(cmbInnerMaterial, "Select Material", materialbysupplier, "materialname", "");


}


function loadForm() {
    quotation = new Object();
    oldquotation = null;

    quotation.quotationHasMaterialList = new Array();

    fillCombo(cmbQrequest, "Select Quotation Request", quotationrequests, "qrcode", "");
    fillCombo(cmbSupplier, "Select Supplier", suppliers, "fullname", "");


    //fill and auto select autobind
    fillCombo(cmbQStatus, "", quotationstatuses, "name", "Valid");
    quotation.quotationstatus_id = JSON.parse(cmbQStatus.value);
    cmbQStatus.disabled = true;

    fillCombo(cmbEmployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    quotation.employee_id = JSON.parse(cmbEmployee.value);
    cmbEmployee.disabled = true;


    var today = new Date();
    var month = today.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var date = today.getDate();
    if (date < 10) date = "0" + date;

    dateAddedDate.value = today.getFullYear() + "-" + month + "-" + date;
    quotation.addeddate = dateAddedDate.value;
    dateAddedDate.disabled = true;


//Date ek assign krnw
    dateRDate.max = today.getFullYear() + "-" + month + "-" + date;

    //Currnt dte ek arn varible ekk hdnw
    let tody = new Date();

    //Currnt dte ek arn varible ekk hdnw
    let beforeoneweek = new Date();

    //beforeonemonth variable ekt apit oon dws gaana set krnw
    beforeoneweek.setDate(tody.getDate() - 7);
    // |tody.getDate() - 30| --> Ad dte ek arn eekn dws 30k adu krnw

    //Month ek arn varible ekk hdnw
    let rmnth = beforeoneweek.getMonth() + 1; //Array [0-11] en hind 1k ekthu krnw (0+1)

    if(rmnth < 10)
        rmnth = "0" + rmnth

    //Day ek arn varible ekk hdnw
    let rday = beforeoneweek.getDate(); //Return type ek range ekk (1-29/30/31)

    if(rday < 10)
        rday = "0" + rday

    dateRDate.min = beforeoneweek.getFullYear() + "-" + rmnth + "-" + rday;

    /*3.*/
    //Date ek assign krnw
    dateVFrom.min = today.getFullYear() + "-" + month + "-" + date;

    //Currnt dte ek arn varible ekk hdnw
    let oneweek = new Date();

    //onemonth variable ekt apit oon dws gaana set krnw
    oneweek.setDate(tody.getDate() + 7);

    //Month ek arn varible ekk hdnw
    let vfmnth = oneweek.getMonth() + 1; //Array [0-11] en hind 1k ekthu krnw (0+1)

    if(vfmnth < 10)
        vfmnth = "0" + vfmnth

    //Day ek arn varible ekk hdnw
    let vfday = oneweek.getDate(); //Return type ek range ekk (1-29/30/31)

    if(vfday < 10)
        vfday = "0" + vfday

    dateVFrom.max = oneweek.getFullYear() + "-" + vfmnth + "-" + vfday;

    /*4.*/
    //Date ek assign krnw
    dateVTo.min = today.getFullYear() + "-" + month + "-" + date;

    //Currnt dte ek arn varible ekk hdnw
    let afteroneweek = new Date();

    //afteroneweek variable ekt apit oon dws gaana set krnw
    afteroneweek.setDate(tody.getDate() + 7);

    //week ek arn varible ekk hdnw
    let vtmnth = afteroneweek.getDate() + 7; //Array [0-11] en hind 1k ekthu krnw (0+1)

    if(vtmnth < 10)
        vtmnth = "0" + vtmnth

    //Day ek arn varible ekk hdnw
    let vtday = afteroneweek.getDate(); //Return type ek range ekk (1-29/30/31)

    if(vtday < 10)
        vtday = "0" + vtday

    dateVTo.max = afteroneweek.getFullYear() + "-" + vtmnth + "-" + vtday;


    //auto select quotationcode
    nextqt = httpRequest("../quotation/nextqt", "GET");
    txtQcode.value = nextqt.quotationcode;
    quotation.quotationcode = txtQcode.value;
    txtQcode.disabled = true;


    //text field empty

    dateRDate.value = "";
    dateVFrom.value = "";
    dateVTo.value = "";
    txtDescription.value = "";

    setStyle(initial);
    cmbQStatus.style.border = valid;
    cmbEmployee.style.border = valid;
    dateAddedDate.style.border = valid;
    txtQcode.style.border = valid;

    disableButtons(false, true, true);

    refreshInnerForm();
}

function refreshInnerForm() {

    quotationHasMaterial = new Object();
    oldquotationHasMaterial = null;


    //inner form
    //autofill combo box
    fillCombo(cmbInnerMaterial, "Select Material", materials, "materialname", "");
    txtpprice.value = "";
    cmbInnerMaterial.style.border = initial;
    txtpprice.style.border = initial;


    //Inner table
    fillInnerTable('tblInnerMaterial', quotation.quotationHasMaterialList, innerModify, innerDelete, false);

}

function btnInnerAddMC() {
    var itmext = false;

    for (var index in quotation.quotationHasMaterialList) {
        if (quotation.quotationHasMaterialList[index].material_id.materialname == quotationHasMaterial.material_id.materialname) {
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
        quotation.quotationHasMaterialList.push(quotationHasMaterial);
        refreshInnerForm();
    }


}

function innerModify() {

}

function innerDelete(innerob, innerrow) {
    swal({
        title: "Are you sure to remove Item?",
        text: "\nItem Name : " + innerob.item_id.itemname,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            supplier.supplierHasItemList.splice(innerrow, 1);
            refreshInnerForm();
        }
    });
}

function innerrview() {

}

function setStyle(style) {
    txtQcode.style.border = style;
    dateRDate.style.border = style;
    dateVFrom.style.border = style;
    dateVTo.style.border = style;
    dateAddedDate.style.border = style;
    txtDescription.style.border = style;
    cmbQStatus.style.border = style;
    cmbQrequest.style.border = style;
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
    for (index in quotations) {
        if (quotations[index].quotationstatus_id.name == "Deleted") {
            tblQuotation.children[1].children[index].style.color = "#f00";
            tblQuotation.children[1].children[index].style.border = "2px solid red";
            tblQuotation.children[1].children[index].lastChild.children[1].disabled = true;
            tblQuotation.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (quotation.quotationcode == null) {
        errors = errors + "\n" + "Quotation code Not Entered";
        txtQcode.style.border = invalid;
    } else addvalue = 1;

    if (cmbSupplier.value == "") {
        errors = errors + "\n" + "Supplier Not Selected";
        cmbSupplier.style.border = invalid;
    } else addvalue = 1;

    if (quotation.receiveddate == null) {
        errors = errors + "\n" + "Received Date Not Selected";
        dateRDate.style.border = invalid;
    } else addvalue = 1;


    if (quotation.quotationrequest_id == null) {
        errors = errors + "\n" + "Quotation Request Not Selected";
        cmbQrequest.style.border = invalid;
    } else addvalue = 1;

    if (quotation.validfrom == null) {
        errors = errors + "\n" + "Date Valid From Not Selected";
        dateVFrom.style.border = invalid;
    } else addvalue = 1;

    if (quotation.validto == null) {
        errors = errors + "\n" + "Date Valid To Not Selected";
        dateVTo.style.border = invalid;
    } else addvalue = 1;

    if (quotation.validto == null) {
        errors = errors + "\n" + "Date Valid To Not Selected";
        dateVTo.style.border = invalid;
    } else addvalue = 1;

    // msg for fill data in innertable
    if (quotation.quotationHasMaterialList.length == 0) {
        cmbInnerMaterial.style.border = invalid;
        errors = errors + "\n" + "Supplier material not added";

    } else addvalue = 1;


    return errors;

}

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

function savedata() {

    swal({
        title: "Are you sure to add following Quotation...?",
        text:

            "\nSupplier : " + quotation.quotationrequest_id.supplier_id.fullname +
            "\nQuotation Request: " + quotation.quotationrequest_id.qrcode +
            "\n Valid from : " + quotation.validfrom +
            "\n Valid To : " + quotation.validto +
            "\n Added Date : " + quotation.addeddate +
            "\n Quotation Status : " + quotation.quotationstatus_id.name +
            "\n Employee : " + quotation.employee_id.callingname,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/quotation", "POST", quotation);
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

function fillForm(quo, rowno) {
    activepage = rowno;

    if (oldquotation == null) {
        filldata(quo);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(quo);
            }

        });
    }

}

function filldata(quo) {
    clearSelection(tblQuotation);
    selectRow(tblQuotation, activepage, active);

    quotation = JSON.parse(JSON.stringify(quo));
    oldquotation = JSON.parse(JSON.stringify(quo));


    txtQcode.value = quotation.quotationcode;
    dateRDate.value = quotation.receiveddate;
    dateVFrom.value = quotation.validfrom;
    dateVTo.value = quotation.validto;
    dateAddedDate.value = quotation.addeddate;
    txtDescription.value = quotation.description;

    fillCombo(cmbQStatus, "Select Quotation Status", quotationstatuses, "name", quotation.quotationstatus_id.name);
    fillCombo(cmbQrequest, "Select Quotation Request", quotationrequests, "name", quotation.quotationrequest_id.name);
    fillCombo(cmbEmployee, "Select Employee", employees, "callingname", quotation.employee_id.callingname);
    fillCombo(cmbSupplier, "Select Suppliers", suppliers, "fullname", quotation.quotationrequest_id.supplier_id.fullname);


    disableButtons(true, false, false);
    setStyle(valid);
    changeTab('form');

    refreshInnerForm();

    //Optional fields initial colour
    if (quotation.description == null)
        txtDescription.style.border = initial;
}

//Update-Display updated values msg
function getUpdates() {

    var updates = "";

    if (quotation != null && oldquotation != null) {

        if (quotation.quotationcode != oldquotation.quotationcode)
            updates = updates + "\nQuotation Code is Changed";

        if (quotation.receiveddate != oldquotation.receiveddate)
            updates = updates + "\nReceived Date is Changed";

        if (quotation.validfrom != oldquotation.validfrom)
            updates = updates + "\nValid from is Changed";

        if (quotation.validto != oldquotation.validto)
            updates = updates + "\nValid to is Changed";

        if (quotation.addeddate != oldquotation.addeddate)
            updates = updates + "\nAdded Date is Changed";

        if (quotation.quotationrequest_id.name != oldquotation.quotationrequest_id.name)
            updates = updates + "\nQuotation Request is Changed";

        if (quotation.quotationstatus_id.name != oldquotation.quotationstatus_id.name)
            updates = updates + "\nQuotation status is Changed";

        if (quotation.description != oldquotation.description)
            updates = updates + "\nDescription is Changed";

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
                title: "Are you sure to update following Quotation details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/quotation", "PUT", quotation);
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

function btnDeleteMC(quo) {
    quotation = JSON.parse(JSON.stringify(quo));

    swal({
        title: "Are you sure to delete following employee...?",
        text:
            "\nSupplier : " + quotation.quotationrequest_id.supplier_id.fullname +
            "\nQuotation Request: " + quotation.quotationrequest_id.qrcode +
            "\n Valid from : " + quotation.validfrom +
            "\n Valid To : " + quotation.validto +
            "\n Added Date : " + quotation.addeddate +
            "\n Quotation Status : " + quotation.quotationstatus_id.name +
            "\n Employee : " + quotation.employee_id.callingname,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/quotation", "DELETE", quotation);
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

function btnSearchClearMC() {
    loadView();
}

function btnPrintTableMC(quo) {

    var newwindow = window.open();
    formattab = tblQuotation.outerHTML;
    //write print table in the new tab
    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Quotation Details : </h1></div>" +
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