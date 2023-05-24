window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    $('[data-toggle="tooltip"]').tooltip()

    //add/clear/update button event handlers
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);


    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=DAILYREMOVE", "GET");

    //Make arrays as materials,removereasons,dailyremovestatuses and employees to get list for combop box
    materials = httpRequest("../material/list", "GET");
    removereasons = httpRequest("../removereason/list", "GET");
    employees = httpRequest("../employee/list", "GET");
    dailyremovestatuses = httpRequest("../dailyremovestatus/list", "GET");
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

function paginate(page) {
    var paginate;
    if (olddailyremove == null) {
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
    page = page - 1;                //initially 0 page(1-1=0)
    dailyremoves = new Array();     //dailyremoves array

    //Request to get dailyremove  list from URL
    var data = httpRequest("/dailyremove/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) dailyremoves = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);

    //fill data into table using quotation requests array
    //fill form-update, btnDeleteMc-Clear , Viewqreq-print
    fillTable('tblDailyRemove', dailyremoves, fillForm, btnDeleteMC, viewdRem);
    clearSelection(tblDailyRemove);

    if (activerowno != "") selectRow(tblDailyRemove, activerowno, active);

}

//print row -get data into the print table
function viewdRem(dRem, rowno) {

    dailyremove = JSON.parse(JSON.stringify(dRem));

    tdDrCode.innerHTML = dailyremove.dailyremovecode;
    tdMaterial.innerHTML = dailyremove.material_id.materialname;
    tdrqty.innerHTML = dailyremove.removeqty;
    tdRReason.innerHTML = dailyremove.removereason_id.name;
    tddateDailyRemove.innerHTML = dailyremove.dailyremovedate;
    tddescription.innerHTML = dailyremove.description;
    tdEmployee.innerHTML = dailyremove.employee_id.callingname;
    tdDRStatus.innerHTML = dailyremove.dailyremovestatus_id.name;

    $('#DRViewModal').modal('show')

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
    dailyremove = new Object();
    olddailyremove = null;

    fillCombo(cmbMaterial, "Select Material", materials, "materialname", "");
    fillCombo(cmbRReason, "Select Remove Reason", removereasons, "name", "");

    fillCombo(cmbDRStatus, "", dailyremovestatuses, "name", "Available");
    dailyremove.dailyremovestatus_id = JSON.parse(cmbDRStatus.value);
    cmbDRStatus.disabled = true;


    fillCombo(cmbEmployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    dailyremove.employee_id = JSON.parse(cmbEmployee.value);
    // |JSON.parse| --> Cmb boxwlt value set wenne JSON Stringwlin hind aye gnnkot gnne JSON Parse krl JavaScript objct ekk wdyt
    //combo box walata values set wenne json strings walin,ae gannakota ganne json parse karala eka js obj ekak widiyata
    cmbEmployee.disabled = true;

    nextdr = httpRequest("../dailyremove/nextdr","GET");
    txtDrCode.value = nextdr.dailyremovecode;
    dailyremove.dailyremovecode = txtDrCode.value;
    txtDrCode.disabled = true;


    //text field empty
    txtrqty.value = "";
    dateDailyRemove.value = "";
    txtDescription.value = "";

    setStyle(initial);
    cmbEmployee.style.border = valid;
    cmbDRStatus.style.border = valid;
    txtDrCode.style.border = valid;

    disableButtons(false, true, true);
}

function setStyle(style) {


    txtDrCode.style.border = style;
    txtrqty.style.border = style;
    dateDailyRemove.style.border = style;
    txtDescription.style.border = style;
    cmbRReason.style.border = style;
    cmbMaterial.style.border = style;

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
    for (index in dailyremoves) {
        if (dailyremoves[index].dailyremovestatus_id.name == "Deleted") {
            tblDailyRemove.children[1].children[index].style.color = "#f00";
            tblDailyRemove.children[1].children[index].style.border = "2px solid red";
            tblDailyRemove.children[1].children[index].lastChild.children[1].disabled = true;
            tblDailyRemove.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

function getErrors() {
    var errors = "";
    addvalue = "";

    if (dailyremove.material_id == null) {
        errors = errors + "\n" + "Material Not Selected";
        cmbMaterial.style.border = invalid;
    } else addvalue = 1;

    if (dailyremove.removeqty == null) {
        errors = errors + "\n" + "Remove quantity Not Entered";
        txtrqty.style.border = invalid;
    } else addvalue = 1;

    if (dailyremove.removereason_id == null) {
        errors = errors + "\n" + "Remove Reason Not Selected";
        cmbRReason.style.border = invalid;
    } else addvalue = 1;

    if (dailyremove.dailyremovedate == null) {
        errors = errors + "\n" + "Daily remove date Not Entered";
        dateDailyRemove.style.border = invalid;
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
        title: "Are you sure to add following Daily Remove...?",
        text:
            "\nDaily Remove code: " + dailyremove.dailyremovecode +
            "\nMaterial : " + dailyremove.material_id.materialname +
            "\nRemove quantity : " + dailyremove.removeqty +
            "\nRemove reason : " + dailyremove.removereason_id.name +
            "\nDaily Remove Date : " + dailyremove.dailyremovedate +
            "\nStatus : " + dailyremove.dailyremovestatus_id.name,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/dailyremove", "POST", dailyremove);
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

    if (olddailyremove == null && addvalue == "") {
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

function fillForm(dRem, rowno) {
    activerowno = rowno;

    if (olddailyremove == null) {
        filldata(dRem);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(dRem);
            }

        });
    }

}

function filldata(dRem) {
    clearSelection(tblDailyRemove);
    selectRow(tblDailyRemove, activerowno, active);

    dailyremove = JSON.parse(JSON.stringify(dRem));
    olddailyremove = JSON.parse(JSON.stringify(dRem));


    txtDrCode.value = dailyremove.dailyremovecode
    txtrqty.value = dailyremove.removeqty
    dateDailyRemove.value = dailyremove.dailyremovedate
    txtDescription.value = dailyremove.description

    fillCombo(cmbRReason, "", removereasons, "name", dailyremove.removereason_id.name);
    fillCombo(cmbMaterial, "", materials, "materialname", dailyremove.material_id.materialname);
    fillCombo(cmbDRStatus, "", dailyremovestatuses, "name", dailyremove.dailyremovestatus_id.name);
    cmbDRStatus.disabled = false; //updte ekedi status ek select krnna eneble wela tyen oona

    disableButtons(true, false, false);
    setStyle(valid);

    //Optional fields initial colour
    if(dailyremove.description == null)
        txtDescription.style.border= initial;
}

//Update-Display updated values msg
function getUpdates() {

    var updates = "";

    if (dailyremove != null && olddailyremove != null) {

        if (dailyremove.dailyremovecode != olddailyremove.dailyremovecode)
            updates = updates + "\nDaily Remove Code :" + olddailyremove.dailyremovecode + " is Changed into " + dailyremove.dailyremovecode;

        if (dailyremove.removeqty != olddailyremove.removeqty)
            updates = updates + "\nDaily Remove Quantity :" + olddailyremove.removeqty + "KG is Changed into " + dailyremove.removeqty + "KG";


        if (dailyremove.dailyremovedate != olddailyremove.dailyremovedate)
            updates = updates + "\nDaily Remoived Date :" + olddailyremove.dailyremovedate + " is Changed into " + dailyremove.dailyremovedate;

        if (dailyremove.description != olddailyremove.description)
            updates = updates + "\nDescription :" + olddailyremove.description + " is Changed into " + dailyremove.description;


        if (dailyremove.material_id.materialname != olddailyremove.material_id.materialname)
            updates = updates + "\nMaterial :" + olddailyremove.material_id.materialname + " is Changed into " + dailyremove.material_id.materialname;


        if (dailyremove.removereason_id.name != olddailyremove.removereason_id.name)
            updates = updates + "\nMaterial remove reason :" + olddailyremove.removereason_id.name + " is change into " + dailyremove.removereason_id.name;

        if (dailyremove.dailyremovestatus_id.name != olddailyremove.dailyremovestatus_id.name)
            updates = updates + "\nStatus :" + olddailyremove.dailyremovestatus_id.name + " is change into " + dailyremove.dailyremovestatus_id.name;

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
                title: "Are you sure to update following dailyremove details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/dailyremove", "PUT", dailyremove);
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

function btnDeleteMC(dRem) {
    dailyremove = JSON.parse(JSON.stringify(dRem));

    swal({
        title: "Are you sure to delete following Daily Remove...?",
        text: "\n Daily Remove code : " + dailyremove.dailyremovecode,

        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/dailyremove", "DELETE", dailyremove);
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

function btnPrintTableMC(dailyremove) {

    var newwindow = window.open();
    formattab = tblDailyRemove.outerHTML;


    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='/resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Daily Remove Details : </h1></div>" +
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