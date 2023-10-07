window.addEventListener("load", initialize);


//Initializing Functions
function initialize() {

    $('[data-toggle="tooltip"]').tooltip()

    //add/clear/update button event handlers
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    cmbUnitType.addEventListener("change", cmbUnitTypeCH);

    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=MATERIAL", "GET");

    //1.Make arrays as materialcategories,materialstatuses and unittypes to get list for combop box
    materialcategories = httpRequest("../materialcategory/list", "GET");
    materialstatuses = httpRequest("../materialstatus/list", "GET");
    unittypes = httpRequest("../unittype/list", "GET");
    //services should be implemented to get services then write services to get list
    //2.make controller and repository



    //colours
    valid = "3px solid #078D27B2";
    invalid = "3px solid red";
    initial = " #d6d6c2";
    updated = "3px solid #ff9900";
    active = "rgba(7,141,39,0.6)";


    //calling load view function for load view side
    loadView();
    //calling load form function for refresh form side
    loadForm();
    //load form tab
    $('#tableview').modal('hide');
}

function loadView() {

    //Search Area
    txtSearchName.value = "";                    // initially no need to search anything
    txtSearchName.style.background = "";

    //Table Area
    activerowno = "";                          // initially active row number= 0
    activepage = 1;                            // initially active page = 1
    var query = "&searchtext=";
    loadTable(1, cmbPageSize.value, query);
}

//for fill data into table
function loadTable(page, size, query) {
    page = page - 1;                           //initially 0 page(1-1=0)
    materials = new Array();                   //materials list

    //Request to get material list from URL
    var data = httpRequest("/material/findAll?page=" + page + "&size=" + size + query, "GET");

    if (data.content != undefined) materials = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);

    //fill data into table using materials array
    //fill form-update, btnDeleteMc-Clear , Viewqreq-print
    fillTable('tblMaterial', materials, fillForm, btnDeleteMC, viewmat);
    clearSelection(tblMaterial);

    if (activerowno != "") selectRow(tblMaterial, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldmaterial == null) {
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
function viewmat(mat, rowno) {

    material = JSON.parse(JSON.stringify(mat));

    tdMaterialCode.innerHTML = material.materialcode;
    tdMaterialName.innerHTML = material.materialname;
    tdUnitSize.innerHTML = material.unitsize;

    tdMaterialCategory.innerHTML = material.materialcategory_id.name;
    tdUnitType.innerHTML = material.unittype_id.name;

    $('#materialViewModal').modal('show');
}

//Print row (as a table)
function btnPrintRowMC() {
    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'>" +
        "<body><div style='margin-top: 150px'><h1>Material Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 1500);
}

function cmbUnitTypeCH() {
    txtMaterialName.value = material.materialname + " " + material.unitsize + " " + material.unittype_id.name;
    material.materialname = txtMaterialName.value;
    txtMaterialName.style.border = valid;
}

function loadForm() {
    material = new Object();
    oldmaterial = null;

    //fill data into combo box
    //fillcombo(fieldId, message,dataList,displayproperty,selected value


    fillCombo(cmbMaterialCategory, "Select Material Category", materialcategories, "name", "");
    fillCombo(cmbUnitType, "Select unit type", unittypes, "name", "");


    //text field empty


    txtMaterialName.value = "";
    txtUnitSize.value = "";
    txtRop.value = "";



    // set field to initial color
    setStyle(initial);


    disableButtons(false, true, true);
}

function setStyle(style) {


    txtMaterialName.style.border = style;
    txtUnitSize.style.border = style;
    cmbMaterialCategory.style.border = style;
    cmbUnitType.style.border = style;
    txtRop.style.border = style;


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
    for (index in materials) {
        if (materials[index].materialstatus_id.name == "Deleted") {
            tblMaterial.children[1].children[index].style.color = "#f00";
            tblMaterial.children[1].children[index].style.border = "2px solid red";

            tblMaterial.children[1].children[index].lastChild.children[0].disabled = true;
            tblMaterial.children[1].children[index].lastChild.children[0].style.cursor = "not-allowed";

            tblMaterial.children[1].children[index].lastChild.children[1].disabled = true;
            tblMaterial.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";
        }
    }

}

//Add- Display Errors
function getErrors() {

    var errors = "";
    addvalue = "";

    if (material.materialcategory_id == null) {
        errors = errors + "\n" + "Material Category Not Selected";
        cmbMaterialCategory.style.border = invalid;
    } else addvalue = 1;

    if (material.materialname == null) {
        errors = errors + "\n" + "Material name  Not Entered";
        txtMaterialName.style.border = invalid;
    } else
        addvalue = 1;

    if (material.unitsize == null) {
        errors = errors + "\n" + "Unit size Not Entered";
        txtUnitSize.style.border = invalid;
    } else addvalue = 1;

    if (material.unittype_id == null) {
        errors = errors + "\n" + "Unit type not selected";
        cmbUnitType.style.border = invalid;
    } else addvalue = 1;

    if (material.rop == null) {
        errors = errors + "\n" + "ROP Not Entered";
        txtRop.style.border = invalid;
    } else addvalue = 1;

    return errors;

}

//Add-click the Add button
function btnAddMC() {
    if (getErrors() == "") {                   //If there are no errors

            savedata();                                         //if optional fields are not acceptable then save data

    } else {                                                      // if there are errors display errors
        swal({
            title: "You have following errors",
            text: "\n" + getErrors(),
            icon: "error",
            button: true,
        });

    }
}

//Add-Save data in to the database
function savedata() {

    swal({
        title: "Are you sure to add following material...?",
        text:
            "\nMaterial code: " + material.materialcode +
            "\nMaterial Category : " + material.materialcategory_id.name +
            "\nMaterial Name : " + material.materialname +
            "\nUnit size : " + material.unitsize +
            "\nUnit type : " + material.unittype_id.name+
            "\nROP : " + material.rop,


        icon: "warning",
        buttons: true,
        dangerMode: true,

    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/material", "POST", material);
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
                $('#tableview').modal('show');
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

    if (oldmaterial == null && addvalue == "") {
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

//update
function fillForm(mat, rowno) {
    activerowno = rowno;

    if (oldmaterial == null) {
        filldata(mat);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(mat);
            }

        });
    }

}

//update- refill data into form
function filldata(mat) {
    clearSelection(tblMaterial);
    selectRow(tblMaterial, activerowno, active);

    material = JSON.parse(JSON.stringify(mat));
    oldmaterial = JSON.parse(JSON.stringify(mat));



    txtMaterialName.value = material.materialname;
    txtUnitSize.value = material.unitsize;


    //fillcombo(fieldId, message,dataList,displayproperty,selected value
    fillCombo(cmbMaterialCategory, "", materialcategories, "name", material.materialcategory_id.name);
    fillCombo(cmbUnitType, "", unittypes, "name", material.unittype_id.name);

    disableButtons(true, false, false);
    setStyle(valid);
    $('#tableview').modal('hide');


}

//Update-Display updated values msg
function getUpdates() {

    var updates = "";

    if (material != null && oldmaterial != null) {

        if (material.materialcode != oldmaterial.materialcode)
            updates = updates + "\n Material Code is Changed";

        if (material.materialname != oldmaterial.materialname)
            updates = updates + "\n Material name is Changed";


        if (material.unitsize != oldmaterial.unitsize)
            updates = updates + "\n Unit size is Changed";

        if (material.materialcategory_id.name != oldmaterial.materialcategory_id.name)
            updates = updates + "\n Material category is Changed";

        if (material.unittype_id.name != oldmaterial.unittype_id.name)
            updates = updates + "\n Unit type is Changed";


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
                title: "Are you sure to update following material details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/material", "PUT", material);
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
                            $('#tableview').modal('show');

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

//Delete
function btnDeleteMC(mat) {
    material = JSON.parse(JSON.stringify(mat));

    swal({
        title: "Are you sure to delete following material...?",
        text: "\n Material Code : " + material.materialcode +
            "\n Material Name : " + material.materialname,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/material", "DELETE", material);
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

// print table
function btnPrintTableMC(material) {

    var newwindow = window.open();
    formattab = tblMaterial.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        " <link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Material Details : </h1></div>" +
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