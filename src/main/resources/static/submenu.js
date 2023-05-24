window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    $('[data-toggle="tooltip"]').tooltip()

    //add/clear/update button event handlers
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);
    txtSearchName.addEventListener("keyup", btnSearchMC);
    txtqty.addEventListener("keyup", txtqtyMC);


    privilages = httpRequest("../privilage?module=SUBMENU", "GET");

    //Make arrays as genders,designations,civilstatuses and employeestatuses to get list for combop box
    submenucategories = httpRequest("../submenucategory/list", "GET");
    submenustatuses = httpRequest("../submenustatus/list", "GET");
    employees = httpRequest("../employee/list", "GET");

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
    submenus = new Array();    //quotations array

    //Request to get quotation  list from URL
    var data = httpRequest("/submenu/findAll?page=" + page + "&size=" + size + query, "GET");

    if (data.content != undefined) submenus = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);

    //fill data into table using quotations array
    //fill form-update, btnDeleteMc-Clear , Viewqreq-print
    fillTable('tblSubmenu', submenus, fillForm, btnDeleteMC, viewsubm);
    clearSelection(tblSubmenu);

    if (activerowno != "") selectRow(tblSubmenu, activerowno, active);

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
function viewsubm(subm, rowno) {

    submenu = JSON.parse(JSON.stringify(subm));

    tdSMCode.innerHTML = submenu.submenucode;
    tdSMname.innerHTML = submenu.submenuname;
    tdSMCategory.innerHTML = submenu.submenucategory_id.name;
    tdprice.innerHTML = submenu.price;
    tdAddeddate.innerHTML = submenu.addeddate;
    tdSMStatus.innerHTML = submenu.submenustatus_id.name;
    tdEmployee.innerHTML = submenu.employee_id.callingname;


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

function txtqtyMC() {

    if(txtqty.value == "0") {
        swal({
            title: "Quantity cannot be 0!",
            text: "\n",
            icon: "warning",
            button: false,
            timer: 1200
        });

        txtqty.style.border = invalid;
        txtqty.value = "";
        txtqty.style.border = initial;
    }
}

function loadForm() {
    submenu = new Object();
    oldsubmenu = null;

    submenu.submenuHasMaterialList = new Array();

    fillCombo(cmbSCategory, "Select sub menu category", submenucategories, "name", "");


    //fill and auto select autobind
    fillCombo(cmbSstatus, "Select sub menu status", submenustatuses, "name", "Available");
    submenu.submenustatus_id = JSON.parse(cmbSstatus.value);
    cmbSstatus.disabled = true;

    fillCombo(cmbEmployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    submenu.employee_id = JSON.parse(cmbEmployee.value);
    cmbEmployee.disabled = true;


    var today = new Date();
    var month = today.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var date = today.getDate();
    if (date < 10) date = "0" + date;

    dateAddedDate.value = today.getFullYear() + "-" + month + "-" + date;
    submenu.addeddate = dateAddedDate.value;
    dateAddedDate.disabled = true;


    nextsm = httpRequest("../submenu/nextsm", "GET");
    txtSMcode.value = nextsm.submenucode;
    submenu.submenucode = txtSMcode.value;
    txtSMcode.disabled = true;


    //text field empty
    txtSMName.value = "";
    txtPrice.value = "";
    txtDescription.value = "";

    setStyle(initial);
    cmbSstatus.style.border = valid;
    cmbEmployee.style.border = valid;
    dateAddedDate.style.border = valid;
    txtSMcode.style.border = valid;

    disableButtons(false, true, true);

    refreshInnerForm();
}

function refreshInnerForm() {

    submenuHasMaterial = new Object();
    oldsubmenuHasMaterial = null;


    //inner form
    //autofill combo box
    fillCombo(cmbInnerMaterial, "Select Material", materials, "materialname", "");
    txtqty.value = "";
    cmbInnerMaterial.style.border = initial;
    txtqty.style.border = initial;


    //Inner table
    fillInnerTable('tblInnerMaterial', submenu.submenuHasMaterialList, innerModify, innerDelete, true);
    btnInnerUpdateSMC.disabled = true;
    btnInnerUpdateSMC.style.cursor = "not-allowed";

    btnInnerAddSMC.disabled = false;
    btnInnerAddSMC.style.cursor = "pointer";

}

function getErrorsInner() {

    var errors = "";
    var addvalue = "";

    if(submenuHasMaterial.material_id == null) {
        cmbInnerMaterial.style.border = invalid;
        errors = errors + "\n" + "Material not added";
    } else  addvalue = 1;

    if(submenuHasMaterial.qty == null) {
        txtqty.style.border = invalid;
        errors = errors + "\n" + "Quantity not entered";
    } else  addvalue = 1;

    return errors;

}

function btnInnerAddMC() {
    var itmext = false;


        for (var index in submenu.submenuHasMaterialList) {
            if (submenu.submenuHasMaterialList[index].material_id.materialname == submenuHasMaterial.material_id.materialname) {
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

            refreshInnerForm();
        }else{
            swal({
                title: "Are you sure..?",
                text: "Add follownig details....\n"+
                    "\n Material :"+ submenuHasMaterial.material_id.materialname+
                    "\n Quantity :"+ submenuHasMaterial.qty,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    swal({
                        title: "Are you sure..?",
                        text:"\n" ,

                        icon: "success",
                        buttons: false,
                        timer: 1500,
                    })


                    submenu.submenuHasMaterialList.push(submenuHasMaterial);
                    refreshInnerForm();
                }
            });

        }
}

function btnInnerClearMC() {

    if(submenuHasMaterial.material_id != null || submenuHasMaterial.qty) {
        swal({
            title: "Are you sure to clear Material?",
            text: "\n",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if(willDelete) {
                refreshInnerForm();
            }
        });
    } else {
        refreshInnerForm();
    }
}

function innerDelete(innerob, innerrow) {
    swal({
        title: "Are you sure to remove Material?",
        text: "\nMaterial Name : " + innerob.material_id.materialname,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            submenu.submenuHasMaterialList.splice(innerrow, 1);
            refreshInnerForm();
        }
    });
}

function getinnerupdate(){

    var innerupdate = "";

    if(submenuHasMaterial !=null && oldsubmenuHasMaterial !=null){

        if (submenuHasMaterial.material_id.materialname!= oldsubmenuHasMaterial.material_id.materialname)
            innerupdate = innerupdate + "\nMaterial .." + oldsubmenuHasMaterial.material_id.materialname+ " into " + submenuHasMaterial.material_id.materialname;

        if (submenuHasMaterial.qty!= oldsubmenuHasMaterial.qty)
            innerupdate = innerupdate + "\nQuantity is Changed.." + oldsubmenuHasMaterial.qty+ " into " + submenuHasMaterial.qty;

    }
    return innerupdate;
}

function btnInnerUpdateMC(){

    var innerErrors = getErrorsInner();
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
                        submenu.submenuHasMaterialList[innerrow] = submenuHasMaterial;

                        refreshInnerForm();

                    }
                });



        }
    }else{
        swal({
            title: 'You have following errors in your form', icon: "error",
            text: '\n ' + getErrorsInner(),
            button: true
        });
    }
}

function innerModify(ob,innerrowno) {
    btnInnerUpdateSMC.disabled = false;
    btnInnerUpdateSMC.style.cursor = "pointer";


    innerrow =  innerrowno

    submenuHasMaterial = JSON.parse(JSON.stringify(ob));
    oldsubmenuHasMaterial = JSON.parse(JSON.stringify(ob));
    console.log("SUB MENU EDIT ",submenuHasMaterial.material_id.materialname)

    // const subMenulist = menuHasSubmenu.submenu_id;

    fillCombo(cmbInnerMaterial, "Select material",  materials, "materialname", submenuHasMaterial.material_id.materialname);
    txtqty.value = submenuHasMaterial.qty;

}

function innerrview() {

}

function setStyle(style) {

    txtSMcode.style.border = style;
    txtSMName.style.border = style;
    cmbSCategory.style.border = style;
    cmbSstatus.style.border = style;
    txtDescription.style.border = style;
    dateAddedDate.style.border = style;
    txtPrice.style.border = style;
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
    for (index in submenus) {
        if (submenus[index].submenustatus_id.name == "Deleted") {
            tblSubmenu.children[1].children[index].style.color = "#f00";
            tblSubmenu.children[1].children[index].style.border = "2px solid red";
            tblSubmenu.children[1].children[index].lastChild.children[1].disabled = true;
            tblSubmenu.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";
        }
    }
}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (submenu.submenucode == null) {
        errors = errors + "\n" + "Sub menu code Not Entered";
        txtSMcode.style.border = invalid;
    } else addvalue = 1;

    if (submenu.submenuname == null) {
        errors = errors + "\n" + "Sub menuname Not Entered";
        txtSMName.style.border = invalid;
    } else addvalue = 1;

    if (submenu.submenucategory_id == null) {
        errors = errors + "\n" + "Sub Menu category Not Selected";
        cmbSCategory.style.border = invalid;
    } else addvalue = 1;


    if (submenu.submenustatus_id == null) {
        errors = errors + "\n" + "Sub Menu status Not Selected";
        cmbSstatus.style.border = invalid;
    } else addvalue = 1;

    if (submenu.price == null) {
        errors = errors + "\n" + "Price Not Entered";
        txtPrice.style.border = invalid;
    } else addvalue = 1;


    // msg for fill data in innertable
    if (submenu.submenuHasMaterialList.length == 0) {
        cmbInnerMaterial.style.border = invalid;
        errors = errors + "\n" + "Sub menu material not added";

    } else addvalue = 1;


    return errors;

}

function checkValidation() {

    addvalue = "";

    if (submenu.submenuname != null) addvalue = 1;

    if (submenu.submenucategory_id != null) addvalue = 1;

    if (submenu.price != null) addvalue = 1;

    if (submenu.description != null) addvalue = 1;

    if (submenuHasMaterial.qty != null) addvalue = 1;

    if (submenuHasMaterial.material_id != null) addvalue = 1;

    // msg for fill data in inner submenu table
    if (submenu.submenuHasMaterialList.length != 0) addvalue = 1;

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
        title: "Are you sure to add following Sub menu...?",
        text:
            "\nSub menu code: " + submenu.submenucode +
            "\nSub menu Name: " + submenu.submenuname +
            "\n Sub Menu Category : " + submenu.submenucategory_id.name +
            "\n Sub Menu Status : " + submenu.submenustatus_id.name +
            "\n Added Date : " + submenu.addeddate +
            "\n Employee : " + submenu.employee_id.callingname +
            "\n Price: " + submenu.price,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/submenu", "POST", submenu);
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
    checkerr = checkValidation();

    if (oldsubmenu == null && addvalue == "") {
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

function fillForm(subm, rowno) {
    activepage = rowno;

    if (oldsubmenu == null) {
        filldata(subm);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(subm);
            }

        });
    }

}

function filldata(subm) {
    clearSelection(tblSubmenu);
    selectRow(tblSubmenu, activepage, active);

    submenu = JSON.parse(JSON.stringify(subm));
    oldsubmenu = JSON.parse(JSON.stringify(subm));


    txtSMcode.value = submenu.submenucode;
    txtSMName.value = submenu.submenuname;    txtDescription.value = submenu.description;
    dateAddedDate.value = submenu.addeddate;
    txtPrice.value = submenu.price;


    fillCombo(cmbSCategory, "Select Sub menu category", submenucategories, "name", submenu.submenucategory_id.name);
    fillCombo(cmbSstatus, "Select sub menu status", submenustatuses, "name",submenu.submenustatus_id.name);
    fillCombo(cmbEmployee, "Select Employee", employees, "callingname", submenu.employee_id.callingname);


    disableButtons(true, false, false);
    setStyle(valid);
    changeTab('form');


    //Optional fields initial colour
    if (submenu.description == null)
        txtDescription.style.border = initial;
}

//Update-Display updated values msg
function getUpdates() {

    var updates = "";

    if (submenu != null && oldsubmenu != null) {

        if (submenu.submenucode != oldsubmenu.submenucode)
            updates = updates + "\nSubmenu Code is Changed";

        if (submenu.submenuname != oldsubmenu.submenuname)
            updates = updates + "\nsub menu name is Changed";

        if (submenu.addeddate != oldsubmenu.addeddate)
            updates = updates + "\nAdded date is Changed";

        if (submenu.description != oldsubmenu.description)
            updates = updates + "\nDescription is Changed";

        if (submenu.price != oldsubmenu.price)
            updates = updates + "\nPrice is Changed";

        if (submenu.submenustatus_id.name != oldsubmenu.submenustatus_id.name)
            updates = updates + "\n Sub menu status is Changed";

        if (submenu.submenucategory_id.name != oldsubmenu.submenucategory_id.name)
            updates = updates + "\nSub menu category is Changed";
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
                title: "Are you sure to update following Sub menu details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/submenu", "PUT", submenu);
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
                            $('#tableview').modal('hide')

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

function btnDeleteMC(subm) {
    submenu = JSON.parse(JSON.stringify(subm));

    swal({
        title: "Are you sure to delete following submenu...?",
        text:
            "\nSub menu code : " + submenu.submenucode +
            "\nSub menu name: " + submenu.submenuname +
            "\nsub menu category: " + submenu.submenucategory_id.name,

        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/submenu", "DELETE", submenu);
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

function btnPrintTableMC(subm) {

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