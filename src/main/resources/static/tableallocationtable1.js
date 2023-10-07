window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    $('[data-toggle="tooltip"]').tooltip()

    //add/clear/update button event handlers
    btnAdd2.addEventListener("click", btnAddMCT);
    btnClear1.addEventListener("click", btnClearMC);
   
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
    valid = "3px solid #078D27B2";
    invalid = "3px solid red";
    initial = "1px solid #d6d6c2";
    updated = "3px solid #ff9900";
    active = "rgba(7,141,39,0.6)";

    loadViewT();
    //calling load view function for load view side
    loadFormT();
    //calling load view function for load view side
    // changeTab('form');
    //calling form tab

}

function loadViewT() {

    //Search Area
    txtSearchName.value = "";
    txtSearchName.style.background = "";

    //Table Area
    activerowno = "";
    activepage = 1;
    var query = "&searchtext=";
    loadTable(1, cmbPageSize.value, query);
}

function cmbReservationCH(){


}

function loadFormT() {
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

    refreshInnerFormT();
}

function refreshInnerFormT() {

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


function btnInnerAddMCT() {
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
        refreshInnerFormT();
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

                        refreshInnerFormT();

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
            refreshInnerFormT();
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
            "\nTableallocation code: " + tableallocation.tableallocationcode +
            "\nReservation: " + JSON.parse(cmbReservation.value).reservationno +
            "\nReserved Date: " + tableallocation.reserveddate +
            "\nReserved In Time : " + tableallocation.reserveintime+
            "\nReserved Out Time : " + tableallocation.reserveouttime+
            "\nGuest Count: " + tableallocation.guestcount +
            "\nAdded date: " + tableallocation.addeddate,

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
                loadFormTT();
                changeTab('table');
            } else swal({
                title: 'Save not Success... , You have following errors', icon: "error",
                text: '\n ' + response,
                button: true
            });
        }
    });

}
function disableButtons(add, upd, del) {


    if (add || !privilages.add) {
        btnAdd2.setAttribute("disabled", "disabled");
        $('#btnAdd2').css('cursor', 'not-allowed');
    } else {
        btnAdd2.removeAttribute("disabled");
        $('#btnAdd2').css('cursor', 'pointer')
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
        loadFormT();
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                loadFormT();
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
    refreshInnerFormT();
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
                            loadFormT();
                            // changeTab('table');

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
                loadFormT();
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
                refreshInnerFormT();
            }
        });
    } else {
        refreshInnerFormT();
    }
}
function btnInnerAddMCT() {
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
        refreshInnerFormT();
    }


}

function btnSearchMC() {
    activepage = 1;
    loadSearchedTable();
}

function btnSearchClearMC() {
    loadViewT();
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
    loadFormT();

    if (activerowno != "") selectRow(tblEmployee, activerowno, active);


}