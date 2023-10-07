window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    $('[data-toggle="tooltip"]').tooltip()



    privilages = httpRequest("../privilage?module=MATERIALINVENTORY", "GET");
    txtSearchName.addEventListener("keyup", btnSearchMC);


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
    page = page - 1;                        //initially 0 page(1-1=0)
    materialinventories = new Array();      //materialinventories array


    //request materialinventory data list from the URL
    var data = httpRequest("/materialinventory/findAll?page=" + page + "&size=" + size + query, "GET");

    if (data.content != undefined) materialinventories = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);

    //fill data into table using materialinventories array
    //fill form-update, btnDeleteMc-Clear , Viewqreq-print
    fillTable('tblMaterialInventory', materialinventories, fillForm, btnDeleteMC, viewMinv);
    clearSelection(tblMaterialInventory);

    if (activerowno != "") selectRow(tblMaterialInventory, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldmaterialinventory == null) {
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
function viewMinv(Minv, rowno) {

    materialinventory = JSON.parse(JSON.stringify(Minv));


    tdMaterial.innerHTML = materialinventory.material_id.materialname;
    tdTqty.innerHTML = materialinventory.totalqty;
    tdRqty.innerHTML = materialinventory.removeqty;
    tdAqty.innerHTML = materialinventory.avaqty;
    tdInventoryStatus.innerHTML = materialinventory.inventorystatus_id.name;


    $('#MiViewModal').modal('show');
}

//Print row (as a table)
function btnPrintRowMC() {
    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'>" +
        "<body><div style='margin-top: 150px'><h1>Material Inventory Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 1500);
}

function loadForm() {
    materialinventory = new Object();
    oldmaterialinventory = null;

       disableButtons(false, true, true);
}



function disableButtons(add, upd, del) {



    // select deleted data row
    for (index in materialinventories) {
        tblMaterialInventory.children[1].children[index].lastChild.children[0].style.display = "none";
        tblMaterialInventory.children[1].children[index].lastChild.children[1].style.display = "none";

        if (materialinventories[index].inventorystatus_id.name == "Low Inventory") {
            tblMaterialInventory.children[1].children[index].style.color = "rgb(9,9,9)";
            tblMaterialInventory.children[1].children[index].style.backgroundColor = "rgba(238,114,114,0.66)";
        }
        if (materialinventories[index].inventorystatus_id.name == "Available") {
            tblMaterialInventory.children[1].children[index].style.color = "rgb(9,9,9)";
            tblMaterialInventory.children[1].children[index].style.backgroundColor = "rgba(7,141,39,0.6)";

        }
        if (materialinventories[index].inventorystatus_id.name == "Not Available") {
            tblMaterialInventory.children[1].children[index].style.color = "rgb(9,9,9)";
            tblMaterialInventory.children[1].children[index].style.backgroundColor = "rgba(253,141,49,0.66)";

        }
    }

}

//Add- Display Errors
function getErrors() {

    var errors = "";
    addvalue = "";

    if (materialinventory.avaqty == null) {
        errors = errors + "\n" + "Available quantity Not Entered";
        txtAvaqty.style.border = invalid;
    } else
        addvalue = 1;

    if (materialinventory.totalqty == null) {
        errors = errors + "\n" + " Total quantity Not Entered";
        txtTOtqty.style.border = invalid;
    } else
        addvalue = 1;


    if (materialinventory.material_id == null) {
        errors = errors + "\n" + "Material not selected";
        cmbMaterial.style.border = invalid;
    } else addvalue = 1;


    return errors;

}

//Add-click the Add button
function btnAddMC() {
    if (getErrors() == "") {
        if (txtRemoveQty.value == "") {
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

//Add-Save data in to the database
function savedata() {

    swal({
        title: "Are you sure to add following Material Inventory...?",
        text:
            "\nMaterial : " + materialinventory.material_id.materialname +
            "\nAvailable quantity : " + materialinventory.avaqty +
            "\nRemoved Quantity : " + materialinventory.removeqty +
            "\nTotal quantity: " + materialinventory.totalqty +
            "\nInventorystatus : " + materialinventory.inventorystatus_id.name,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/materialinventory", "POST", materialinventory);
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

    if (oldmaterialinventory == null && addvalue == "") {
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

//Update- Get A user confirmation for refill form
function fillForm(Minv, rowno) {
    activepage = rowno;

    if (oldmaterialinventory == null) {
        filldata(Minv);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(Minv);
            }

        });
    }

}

//Update-refill data into form
function filldata(Minv) {

    clearSelection(tblMaterialInventory);
    selectRow(tblMaterialInventory, activepage, active);

    materialinventory = JSON.parse(JSON.stringify(Minv));
    oldmaterialinventory = JSON.parse(JSON.stringify(Minv));


    txtAvaqty.value = materialinventory.avaqty;
    txtTOtqty.value = materialinventory.totalqty;


    fillCombo(cmbMaterial, "Select Material", materials, "materialname", materialinventory.material_id.materialname);


    disableButtons(true, false, false);
    setStyle(valid);

    //Optional fields initial colour
    if (materialinventory.removeqty == null)
        txtRemoveQty.style.border = initial;

}

//Update-Display updated values msg
function getUpdates() {

    var updates = "";
    if (materialinventory != null && oldmaterialinventory != null) {

        if (materialinventory.avaqty != oldmaterialinventory.avaqty)
            updates = updates + "\nAvailable Quantity :" + oldmaterialinventory.avaqty + " is Changed into " + materialinventory.avaqty;

        if (materialinventory.totalqty != oldmaterialinventory.totalqty)
            updates = updates + "\nTotal Quantity :" + oldmaterialinventory.totalqty + "is Changed into " + materialinventory.totalqty;

        if (materialinventory.removeqty != oldmaterialinventory.removeqty)
            updates = updates + "\nRemoved Quantity :" + oldmaterialinventory.removeqty + " is Changed into " + materialinventory.removeqty;

        if (materialinventory.material_id.materialname != oldmaterialinventory.material_id.materialname)
            updates = updates + "\nMaterial :" + oldmaterialinventory.material_id.materialname + " is Changed into " + materialinventory.material_id.materialname;

        if (materialinventory.inventorystatus_id.name != oldmaterialinventory.inventorystatus_id.name)
            updates = updates + "\nInventory status :" + oldmaterialinventory.inventorystatus_id.name + " is Changed into " + materialinventory.inventorystatus_id.name;

    }
    return updates;

}

//Update
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
                title: "Are you sure to update following Material Inventory details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/materialinventory", "PUT", materialinventory);
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

//Delete-row
function btnDeleteMC(Minv) {
    materialinventory = JSON.parse(JSON.stringify(Minv));

    swal({
        title: "Are you sure to delete following Material Inventory...?",
        text: "\n Material : " + materialinventory.material_id.materialname,

        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/materialinventory", "DELETE", materialinventory);
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

function btnPrintTableMC(materialinventory) {

    var newwindow = window.open();
    formattab = tblMaterialInventory.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='/resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Material Inventory Details : </h1></div>" +
        "<div>" + formattab + "</div>" +
        "</body>" +
        "</html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 1500);
}

       