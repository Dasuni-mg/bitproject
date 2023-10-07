window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    $('[data-toggle="tooltip"]').tooltip()

    //add/clear/update button event handlers
    btnAdd1.addEventListener("click", btnAddMCT);
    btnClear1.addEventListener("click", btnClearMC);
    btnUpdate1.addEventListener("click", btnUpdateMC);
    txtSearchName.addEventListener("keyup", btnSearchMC);
    cmbReservation.addEventListener("change", cmbReservationCH);
    txtGCount.addEventListener("change",getTabledetails);


    privilages = httpRequest("../privilage?module=TABLEALLOWCATION", "GET");

    //Make arrays as genders,designations,civilstatuses and employeestatuses to get list for combop box
    tabledetails = httpRequest("../tabledetail/list", "GET");
    tablestatuses = httpRequest("../tablestatus/list", "GET");
    reservations = httpRequest("../reservation/dineinreservation", "GET");

    //inner-materials array
    // tableallocations = httpRequest("../tableallocation/list", "GET");

    //services should be implemented to get services then write services to get list
    //2.make controller and repository

    //colours
    valid = "2px solid #078D27B2";
    invalid = "2px solid red";
    initial = "1px solid #d6d6c2";
    updated = "3px solid #ff9900";
    active = "rgba(7,141,39,0.6)";

    loadView();
    //calling load view function for load view side
    loadForm();
    //calling load view function for load view side
    // changeTab('form');
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
    tableallocations = new Array();    //tableallocations array

    //Request to get quotation  list from URL
    var data = httpRequest("/tableallocation/findAll?page=" + page + "&size=" + size + query, "GET");

    if (data.content != undefined) tableallocations = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);

    //fill data into table using quotations array
    //fill form-update, btnDeleteMc-Clear , Viewqreq-print
    fillTable('tblTableallocation', tableallocations, fillForm, btnDeleteMC, viewtab);
    clearSelection(tblTableallocation);

    if (activerowno != "") selectRow(tblTableallocation, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldtableallocation = null) {
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
function viewtab(tab, rowno) {

    tableallocation = JSON.parse(JSON.stringify(tab));


    tdTAcode.innerHTML = tableallocation.tableallocationcode;
    tdRDate.innerHTML = tableallocation.reserveddate;
    tdRInTime.innerHTML = tableallocation.reserveintime;
    tdROutTime.innerHTML = tableallocation.reserveintime;
    tddteAddedDate.innerHTML = tableallocation.addeddate;

    tdTStatus.innerHTML = tableallocation.tablestatus_id.name;
    tdReservation.innerHTML = tableallocation.reservation_id.reservationno;

    $('#TblAllocationModal').modal('show')

}

function btnPrintRowMC() {

    var format = printformtable.outerHTML;
    var newwindow = window.open();

    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'/>" +
        "<body><div style='margin-top: 150px'><h1>Table allocation :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 1000);
}

function cmbReservationCH(){


}

function loadForm() {
    tableallocation = new Object();
    oldtableallocation = null;


    tableallocation.tableallocationHasTableddetailList = new Array();

    // reservations = httpRequest("../reservation/listbydineinservice", "GET");

    fillCombo(cmbReservation, "Select a reservation", reservations, "reservationno", "");


    // //fill and auto select autobind
    // fillCombo(cmbTStatus, "Select sub menu status", tablestatuses, "name", "Available");
    // tableallocation.tablestatus_id = JSON.parse(cmbTStatus.value);
    // cmbTStatus.disabled = true;


    //
    // var today = new Date();
    // var month = today.getMonth() + 1;
    // if (month < 10) month = "0" + month;
    // var date = today.getDate();
    // if (date < 10) date = "0" + date;
    //
    // dteAddedDate.value = today.getFullYear() + "-" + month + "-" + date;
    // tableallocation.addeddate = dteAddedDate.value;
    // dteAddedDate.disabled = true;



    //text field empty
    txtRRDate.value = "";
    txtRTime.value = "";
    txtROTime.value = "";

    cmbReservation.value = "";


    setStyle(initial);

    // cmbTStatus.style.border = valid;
    // dteAddedDate.style.border = valid;



    disableButtons(false, true, true);

    refreshInnerForm();
}

function refreshInnerForm() {

    tableallocationHastabledetail = new Object();
    oldtableallocationHastabledetail = null;


    //inner form
    //autofill combo box

    fillCombo(cmbTablecode, "Select no of Chairs", tabledetails, "tableallcode", "");
    cmbTablecode.style.border = initial;


    //Inner table
    fillInnerTable('tblInnertblAllocation',  tableallocation.tableallocationHasTableddetailList, innerModify, innerDelete, true);



}

function getTabledetails(){
    // if(parseInt(txtGCount.value) <= 5){
    //     fillCombo(cmbTablecode, "Select no of Chairs", tabledetails, "tableallcode", "T001");
    //
    //     tableallocationHastabledetail.tableddetail_id = tabledetails;
    //
    //     console.log("AAAAAA",tableallocationHastabledetail.tableddetail_id);
    // }
    // if(parseInt(txtGCount.value)  (txtGCount.value)<= 10){
    //     fillCombo(cmbTablecode, "Select no of Chairs", tabledetails, "tableallcode", "T002");
    // }
}


function btnInnerAddMC() {
    var itmext = false;

    for (var index in tableallocation.tableallocationHasTableddetailList) {
        if (tableallocation.tableallocationHasTableddetailList[index].tableallocation_id.tableallocationcode== tableallocationHasTableddetailList.tableallocation_id.tableallocationcode) {
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
        tableallocation.tableallocationHasTableddetailList.push(tableallocationHastabledetail);
        refreshInnerForm();
    }


}
function btnInnerUpdateMC(){
    var innerErrors = getInnerErrors();
    if(innerErrors == ""){
        var innerUpdate = getinnerupdate();
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
            text: '\n ' + getInnerErrors(),
            button: true
        });
    }
}
function getInnerErrors(){


    var innerErrors = "";
    var inneraddvalue = "";


    //
    if(tableallocationHastabledetail.tablecode == null){
        innerErrors = innerErrors +"\n"+ "Select the Table code";
        cmbTablecode.style.border = invalid;
    }else{
        inneraddvalue = 1;
    }



    return innerErrors;
}

function getinnerupdate(){

    var innerupdate = "";

    if(tableallocationHastabledetail !=null && oldtableallocationHastabledetail !=null){

        if (tableallocationHastabledetail.tableddetail_id.tableallcode != oldtableallocationHastabledetail.tableddetail_id.tableallcode)
            innerupdate = innerupdate + "\n Table Code .." + oldtableallocationHastabledetail.tableddetail_id.tableallcode + " into " + tableallocationHastabledetail.tableddetail_id.tableallcode  ;
    }
    return innerupdate;
}
function innerModify(ob, innerrowno) {

    btnInnerUpdate.disabled = false;
    btnInnerUpdate.style.cursor = "pointer";

    btnInnerUpdate.disabled = false;


    innerrow = innerrowno

    tableallocationHastabledetail = JSON.parse(JSON.stringify(ob));
    oldtableallocationHastabledetail = JSON.parse(JSON.stringify(ob));


    console.log("UHHLK ",tableallocationHastabledetail)
    fillCombo(cmbTablecode, "Select no of Chairs", tabledetails, "tableallcode", tableallocationHastabledetail.tableddetail_id.tableallcode);


}

function innerDelete(innerob, innerrow) {
    swal({
        title: "Are you sure to remove Table?",
        text: "\nItem Name : " + innerob.tabledetailed_id.tablename,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            tableallocation.tableallocationHasTableddetailList.splice(innerrow, 1);
            refreshInnerForm();
        }
    });
}

function setStyle(style) {


    txtRRDate.style.border=style;
    txtRTime.style.border=style;
    txtROTime.style.border=style;
    //dteAddedDate.style.border=style;

    // cmbTStatus.style.border=style;
    cmbReservation.style.border=style;
}
function btnAddMCT() {
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

function savedata() {

    swal({
        title: "Are you sure to add following Sub menu...?",
        text:
            "\nReservation: " + JSON.parse(cmbReservation.value).reservationno +
            "\nReserved Date: " + tableallocation.reserveddate +
            "\nReserved In Time : " + tableallocation.reserveintime+
            "\nReserved Out Time : " + tableallocation.reserveouttime+
            "\nGuest Count: " + tableallocation.guestcount,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/tableallocation", "POST", tableallocation);
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
                // changeTab('table');
            } else swal({
                title: 'Save not Success... , You have following errors', icon: "error",
                text: '\n ' + response,
                button: true
            });
        }
    });

}
function disableButtons(add, upd, del) {



    if (upd || !privilages.update) {
        btnUpdate1.setAttribute("disabled", "disabled");
        $('#btnUpdate1').css('cursor', 'not-allowed');
    } else {
        btnUpdate1.removeAttribute("disabled");
        $('#btnUpdate1').css('cursor', 'pointer');
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
    for (index in tableallocations) {
        if (tableallocations[index].tablestatus_id.name == "Deleted") {
            tblTableallocation.children[1].children[index].style.color = "rgb(9,9,9)";
            tblTableallocation.children[1].children[index].style.backgroundColor = "rgba(238,114,114,0.66)";
            tblTableallocation.children[1].children[index].lastChild.children[0].disabled = true;
            tblTableallocation.children[1].children[index].lastChild.children[0].style.cursor = "not-allowed";
            tblTableallocation.children[1].children[index].lastChild.children[1].disabled = true;
            tblTableallocation.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";
        }
    }
}

function getErrors() {

    var errors = "";
    addvalue = "";


    if (tableallocation.reserveddate == null) {
        errors = errors + "\n" + "Reserved date Not Entered";
        txtRRDate.style.border = invalid;
    } else addvalue = 1;

    if (tableallocation.reserveintime == null) {
        errors = errors + "\n" + "Reserved In time Not Selected";
        txtRTime.style.border = invalid;
    } else addvalue = 1;

    if (tableallocation.reserveouttime == null) {
        errors = errors + "\n" + "Reserved Out time Not Selected";
        txtROTime.style.border = invalid;
    } else addvalue = 1;

    if (tableallocation.reservation_id == null) {
        errors = errors + "\n" + "Reservation Not Selected";
        cmbReservation.style.border = invalid;
    } else addvalue = 1;


    // msg for fill data in innertable
    if (tableallocation.tableallocationHasTableddetailList.length == 0) {
        cmbInnerTableDetail.style.border = invalid;
        errors = errors + "\n" + "Table Details not added";

    } else addvalue = 1;


    return errors;

}
function btnClearMC() {
    //Get Cofirmation from the User window.confirm();
    checkerr = getErrors();

    if (oldtableallocation == null && addvalue == "") {
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
function fillForm(tab, rowno) {
    activerowno = rowno;

    if (oldtableallocation == null) {
        filldata(tab);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(tab);
            }
        });
    }
}

function filldata(tab) {
    clearSelection(tblTableallocation);
    selectRow(tblTableallocation, activerowno, active);

    tableallocation = JSON.parse(JSON.stringify(tab));
    oldtableallocation = JSON.parse(JSON.stringify(tab));

    txtRRDate.value=tableallocation.reserveddate;
    txtRRDate.disabled=true;

    txtRTime.value=tableallocation.reserveintime;
    txtROTime.value=tableallocation.reserveouttime;
    //dteAddedDate.value = tableallocation.addeddate;

    fillCombo(cmbReservation, "Select a reservation", reservations, "reservationno", tableallocation.reservation_id.reservationno);
    cmbReservation.disabled=true;

    //fill and auto select autobind
    //
    // fillCombo(cmbTStatus, "", tablestatuses, "name", "");
    // cmbTStatus.disabled=false;

    disableButtons(true, false, false);
    setStyle(valid);
    refreshInnerForm();
    $('#tnlAllocation').modal('show')


}

//Update-Display updated values msg
function getUpdates() {

    var updates = "";

    if (tableallocation != null && oldtableallocation != null) {

        if (tableallocation.tableallocationcode != oldtableallocation.tableallocationcode)
            updates = updates + "\ntableallocation Code is Changed";

        if (tableallocation.reserveddate != oldtableallocation.reserveddate)
            updates = updates + "\nReserveddate is Changed";

        if (tableallocation.reservetime != oldtableallocation.reserveintime)
            updates = updates + "\nReserved in Time  is Changed";

        if (tableallocation.reservetime != oldtableallocation.reserveouttime)
            updates = updates + "\nReserved Out Time  is Changed";

        if (tableallocation.addeddate != oldtableallocation.addeddate)
            updates = updates + "\nAddeddate is Changed";


        if (tableallocation.reservation_id.cname != oldtableallocation.reservation_id.cname)
            updates = updates + "\nReservation is Changed";
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
                title: "Are you sure to update following Table details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/tableallocation", "PUT", tableallocation);
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
                            // changeTab('table');
                            $('#tnlAllocation').modal('hide')

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

function btnDeleteMC(tab) {
    tableallocation = JSON.parse(JSON.stringify(tab));

    swal({
        title: "Are you sure to delete following submenu...?",
        text:
            "\nTable Allocation code : " + tableallocation.tableallocationcode,

        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/tableallocation", "DELETE", tableallocation);
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

function btnInnerClearMC() {

    if (tableallocationHastabledetail.tableallcode != null ) {
        swal({
            title: "Are you sure to clear Table Details?",
            text: "\n",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                refreshInnerForm();
            }
        });
    } else {
        refreshInnerForm();
    }
}


function btnSearchMC() {
    activepage = 1;
    loadSearchedTable();
}

function btnSearchClearMC() {
    loadView();
}

function btnPrintTableMC(tab) {

    var newwindow = window.open();
    formattab = tblSubmenu.outerHTML;
    //write print table in the new tab
    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Submenu Details : </h1></div>" +
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