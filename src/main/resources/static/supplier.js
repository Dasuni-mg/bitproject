window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    $('[data-toggle="tooltip"]').tooltip()

    //add/clear/update button event handlers
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);
    txtSearchName.addEventListener("keyup", btnSearchMC);
    cmbInnerMaterialCat.addEventListener("change", cmbInnerMaterialCatMC);


    privilages = httpRequest("../privilage?module=SUPPLIER", "GET");

    // //Make arrays as supplierstatuses and employees to get list for combop box
    // supplierstatuses = httpRequest("../supplierstatus/list", "GET");
    // employees = httpRequest("../employee/list", "GET");
    bankbranches = httpRequest("../bankbranch/list", "GET");
    banknames = httpRequest("../bankname/list", "GET");

    //inner-materials array
    materials = httpRequest("../material/list", "GET");
    materialcategories = httpRequest("../materialcategory/list", "GET");
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
    txtSearchName.value = "";                      // initially no need to search anything
    txtSearchName.style.background = "";

    //Table Area
    activerowno = "";                            // initially active row number= 0
    activepage = 1;                               // initially active page = 1
    var query = "&searchtext=";
    loadTable(1, cmbPageSize.value, query);
}

function paginate(page) {
    var paginate;
    if (oldsupplier == null) {
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
    page = page - 1;                     //initially 0 page(1-1=0)
    suppliers = new Array();             //suppliers list

    //Request to get supplier  list from URL
    var data = httpRequest("/supplier/findAll?page=" + page + "&size=" + size + query, "GET");

    if (data.content != undefined) suppliers = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);

    //fill data into table using suppliers array
    //fill form-update, btnDeleteMc-Clear , Viewqreq-print
    fillTable('tblSupplier', suppliers, fillForm, btnDeleteMC, viewsup);
    clearSelection(tblSupplier);

    if (activerowno != "") selectRow(tblSupplier, activerowno, active);

}

//print row -get data into the print table
function viewsup(sup, rowno) {

    supplier = JSON.parse(JSON.stringify(sup));


    tdRegNo.innerHTML = supplier.regno;
    tdfname.innerHTML = supplier.fullname;
    tdcpname.innerHTML = supplier.cpname;
    tdcontactno1.innerHTML = supplier.contactno1;
    tdemail.innerHTML = supplier.email;
    tdaddress.innerHTML = supplier.address;
    tdaddeddate.innerHTML = supplier.addeddate;
    // tddescription.innerHTML = supplier.description;
    tdbankholdername.innerHTML = supplier.bankholdername;
    tdbankname.innerHTML = supplier.bankname;
    tdbankbranchname.innerHTML = supplier.bankbranchname;
    tdbankaccountno.innerHTML = supplier.bankholdername;
    tdarreasamount.innerHTML = supplier.arreasamount;

    $('#SpplierViewModal').modal('show')

}

function cmbInnerMaterialCatMC() {

    materialbymaterialcategory = httpRequest("/material/materiallistbymateriallcategory?materialcategoryid=" + JSON.parse(cmbInnerMaterialCat.value).id, "GET");
    fillCombo(cmbInnerMaterial, "Select Material", materialbymaterialcategory, "materialname", "");
    cmbInnerMaterial.style.border = initial;
}


function supplierMobileBinder(){

    var val = txtConNo1.value.trim();


    if(val !=""){

        var regpattern = new RegExp('^0\\d{9}$');
        //test eken krnne api input krna mobileno ekai set krla thiyena regex pattern ekai equal da kiyla
        if(regpattern.test(val)){

            var response = httpRequest("customer/byMobile?mobileno="+val,"GET")
            console.log(response);
            if(response == ""){
                supplier.contactno1 = val;
                if(oldsupplier !=null && supplier.contactno1 != oldsupplier.contactno1){
                    txtConNo1.style.border = updated;
                }else{
                    txtConNo1.style.border = valid;
                }


            }else{
                swal({
                    title: "This Contact No is  Already Exist....!",
                    text: "\n\n",
                    icon: "warning",
                    button: false,
                    timer:1500,
                    className: "purple-swal"
                });
            }

        }else{
            txtConNo1.style.border = invalid;
            supplier.contactno1 = null;
        }
    }else{
        if(txtConNo1.required){
            txtConNo1.style.border = invalid;
        }else{
            txtConNo1.style.border = initial;
        }
        supplier.contactno1 = null;
    }

}

function supplierMobileBinder2(){

    var val = txtConNo2.value.trim();


    if(val !=""){

        var regpattern = new RegExp('^0\\d{9}$');
        //test eken krnne api input krna mobileno ekai set krla thiyena regex pattern ekai equal da kiyla
        if(regpattern.test(val)){

            var response = httpRequest("customer/byMobile?mobileno="+val,"GET")
            console.log(response);
            if(response == ""){
                supplier.contactno2 = val;
                if(oldsupplier !=null && supplier.contactno2 != oldsupplier.contactno2){
                    txtConNo2.style.border = updated;
                }else{
                    txtConNo2.style.border = valid;
                }


            }else{
                swal({
                    title: "This Contact No is  Already Exist....!",
                    text: "\n\n",
                    icon: "warning",
                    button: false,
                    timer:1500,
                    className: "purple-swal"
                });
            }

        }else{
            txtConNo2.style.border = invalid;
            supplier.contactno2 = null;
        }
    }else{
        if(txtConNo2.required){
            txtConNo2.style.border = invalid;
        }else{
            txtConNo2.style.border = initial;
        }
        supplier.contactno2 = null;
    }

}

function supplierEmailBinder(){

    var val = txtEmail.value.trim();


    if(val !=""){

        var regpattern = new RegExp('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$');
        //test eken krnne api input krna mobileno ekai set krla thiyena regex pattern ekai equal da kiyla
        if(regpattern.test(val)){

            var response = httpRequest("customer/byMobile?mobileno="+val,"GET")
            console.log(response);
            if(response == ""){
                supplier.email = val;
                if(oldsupplier !=null && supplier.email != oldsupplier.email){
                    txtEmail.style.border = updated;
                }else{
                    txtEmail.style.border = valid;
                }


            }else{
                swal({
                    title: "This Email is  Already Exist....!",
                    text: "\n\n",
                    icon: "warning",
                    button: false,
                    timer:1500,
                    className: "purple-swal"
                });
            }

        }else{
            txtEmail.style.border = invalid;
            supplier.email = null;
        }
    }else{
        if(txtEmail.required){
            txtEmail.style.border = invalid;
        }else{
            txtEmail.style.border = initial;
        }
        supplier.email = null;
    }

}
//Print row (as a table)
function btnPrintRowMC() {

    var format = printformtable.outerHTML;
    var newwindow = window.open();

    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'/>" +
        "<body><div style='margin-top: 150px'><h1>Supplier Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 1000);
}

function loadForm() {
    supplier = new Object();
    oldsupplier = null;

    supplier.supplierhasmaterialList = new Array();

    // //Auto fill combo box
    // fillCombo(cmbSupplierStatus, "", supplierstatuses, "name", "Available");
    // fillCombo(cmbAddedBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    //
    // supplier.supplierstatus_id = JSON.parse(cmbSupplierStatus.value);
    // cmbSupplierStatus.disabled = true;
    //
    // supplier.employee_id = JSON.parse(cmbAddedBy.value);
    // cmbAddedBy.disabled = true;
    //
    // //create date object
    //
    // var today = new Date();
    // //get month--> array(0-11)
    // var month = today.getMonth() + 1;
    // //browser format of month is YYYY-MM-DD(jan-01,feb-02,..)
    // if (month < 10) month = "0" + month;//YYYY-MM-DD
    // //browser format of date is YYYY-MM-DD(01,02,..)
    // //get date-->range(1-31)
    // var date = today.getDate();
    // if (date < 10) date = "0" + date;//YYYY-MM-DD
    //
    // dteAddeddate.value = today.getFullYear() + "-" + month + "-" + date;
    // supplier.doassignment = dteAddeddate.value;
    // dteAddeddate.disabled = true;
    //
    // //Auto selected Registered No
    // nextsup = httpRequest("../supplier/nextsup","GET");
    // txtRegNo.value = nextsup.regno;
    // supplier.regno = txtRegNo.value;
    // txtRegNo.disabled = true;
    //

    //text field empty
    fillCombo(cmbBankBranchName, "Select Bank Branch", bankbranches, "name", "");
    cmbBankBranchName.style.border = initial;

    fillCombo(cmbBankName, "Select Bank Name", banknames, "name", "");
    cmbBankName.style.border = initial;

    txtFullname.value = "";
    txtConNo2.value = "";
    txtConNo1.value = "";
    txtCPName.value = "";
    txtEmail.value = "";
    txtAddress.value = "";
    txtBAccNo.value = "";


    // set field to initial color
    setStyle(initial);


    disableButtons(false, true, true);

    refreshInnerForm();
}

function refreshInnerForm() {

    Supplierhasmaterial = new Object();
    oldSupplierhasmaterial = null;


    //inner form
    //autofill combo box
    fillCombo(cmbInnerMaterial, "Select Material", materials, "materialname", "");
    cmbInnerMaterial.style.border = initial;

    fillCombo(cmbInnerMaterialCat, "Select Material Category", materialcategories, "name", "");
    cmbInnerMaterialCat.style.border = initial;


    //Inner table
    fillInnerTable('tblInnerMaterial', supplier.supplierhasmaterialList, innerModify, innerDelete, innerrview);

    btnInnerUpdate.disabled = true;
    btnInnerUpdate.style.cursor = "not-allowed";

    btnInnerAdd.disabled = false;
    btnInnerAdd.style.cursor = "pointer";


    // if (submenuHasMaterial.materialcategory_id == null) {
    //     fillCombo(cmbInnerMaterial, "Select Material", materials, "materialname", "");
    //     cmbInnerMaterial.style.border = initial;
    // } else {
    //
    //     cmbInnerMaterialCatMC();
    //     cmbInnerMaterial.style.border = initial;
    // }
}

function getErrorsInner() {

    var errors = "";
    addvalue = "";

    if (Supplierhasmaterial.material_id == null) {
        cmbInnerMaterial.style.border = invalid;
        errors = errors + "\n" + "Material Not Selected";
    } else addvalue = 1;

    if (Supplierhasmaterial.materialcategory_id == null) {
        cmbInnerMaterialCat.style.border = invalid;
        errors = errors + "\n" + "Material Category Not Selected";
    } else addvalue = 1;

    return errors;

}

function getinnerupdate() {

    var innerupdate = "";

    if (Supplierhasmaterial != null && oldSupplierhasmaterial != null) {

        if (Supplierhasmaterial.material_id.materialname != oldSupplierhasmaterial.material_id.materialname)
            innerupdate = innerupdate + "\nMaterail .." + oldSupplierhasmaterial.material_id.materialname + " into " + Supplierhasmaterial.material_id.materialname;

        if (Supplierhasmaterial.materialcategory_id.name != oldSupplierhasmaterial.materialcategory_id.name)
            innerupdate = innerupdate + "\nMaterail Category .." + oldSupplierhasmaterial.materialcategory_id.name + " into " + Supplierhasmaterial.materialcategory_id.name;

    }
    return innerupdate;
}

function btnInnerAddMC() {
    var itmext = false;

    if (getErrorsInner() == "") {
        for (var index in supplier.supplierhasmaterialList) {
            if (supplier.supplierhasmaterialList[index].material_id.materialname == Supplierhasmaterial.material_id.materialname) {
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
                className: "purple-swal",
            });
        } else {
            supplier.supplierhasmaterialList.push(Supplierhasmaterial);
            refreshInnerForm();
        }
    } else {
        swal({
            title: "You have following errors",
            text: "\n" + getErrorsInner(),
            icon: "error",
            buttons: true, className: "purple-swal",
        })
    }
}

function btnInnerClearMC() {

    console.log(Supplierhasmaterial.material_id != null);
    if (Supplierhasmaterial.material_id != null || Supplierhasmaterial.materialcategory_id != null ) {
        swal({
            title: "Are you sure to clear Material?",
            text: "\n",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            className: "purple-swal",
        }).then((willDelete) => {
            if (willDelete) {
                refreshInnerForm();
            }
        });
    } else {
        refreshInnerForm();
    }
}

function btnSupplierInnerUpdateMC() {

    var innerErrors = getErrorsInner();
    if (innerErrors == "") {
        var innerUpdate = getinnerupdate();
        if (innerUpdate == "") {
            swal({
                title: 'Nothing Updated..!', icon: "warning",
                text: '\n',
                button: true,
                timer: 1200,
                className: "purple-swal",
            });
        } else {
            swal({
                title: "Are you sure to inner form update following details...?",
                text: "\n" + innerUpdate,
                icon: "warning", buttons: true, dangerMode: true, className: "purple-swal",
            })
                .then((willDelete) => {
                    if (willDelete) {
                        swal({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been Done \n Update SuccessFully..!',
                            text: '\n',
                            button: false,
                            timer: 1200,

                        });
                        supplier.supplierhasmaterialList[innerrow] = Supplierhasmaterial;
                        refreshInnerForm();
                    }
                });
        }
    } else {
        swal({
            title: 'You have following errors in your form', icon: "error",
            text: '\n ' + getErrorsInner(),
            button: true,
            className: "purple-swal",
        });
    }
}

function innerModify(ob, innerrowno) {
    btnInnerUpdate.disabled = false;
    btnInnerUpdate.style.cursor = "pointer";
    btnInnerAdd.disabled = true;

    innerrow = innerrowno

    Supplierhasmaterial = JSON.parse(JSON.stringify(ob));
    oldSupplierhasmaterial = JSON.parse(JSON.stringify(ob));

    // const subMenulist = menuHasSubmenu.submenu_id;

    fillCombo(cmbInnerMaterialCat, "Select Material Category", materialcategories, "name", Supplierhasmaterial.materialcategory_id.name);

    fillCombo(cmbInnerMaterial, "Select material", materials, "materialname", Supplierhasmaterial.material_id.materialname);

}

function innerDelete(innerob, innerrow) {
    swal({
        title: "Are you sure to remove Material?",
        text: "\nItem Name : " + innerob.material_id.materialname,
        icon: "warning",
        buttons: true,
        dangerMode: true, className: "purple-swal",
    }).then((willDelete) => {
        if (willDelete) {
            supplier.supplierhasmaterialList.splice(innerrow, 1);
            refreshInnerForm();
        }
    });
}

function innerrview() {

}

function setStyle(style) {
    txtFullname.style.border = style;
    txtConNo2.style.border = style;
    txtConNo1.style.border = style;
    txtCPName.style.border = style;
    txtEmail.style.border = style;
    txtAddress.style.border = style;
    txtBAccNo.style.border = style;
    txtBHName.style.border = style;
    // txtArreasAmount.style.border = style;
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
    for (index in suppliers) {
        if (suppliers[index].supplierstatus_id.name == "Deleted") {
            {
                tblSupplier.children[1].children[index].style.color = "rgb(9,9,9)";
                tblSupplier.children[1].children[index].style.backgroundColor = "rgba(238,114,114,0.66)";

                //disable update when deleted
                tblSupplier.children[1].children[index].lastChild.children[0].disabled = true;
                tblSupplier.children[1].children[index].lastChild.children[0].style.cursor = "not-allowed";

                tblSupplier.children[1].children[index].lastChild.children[1].disabled = true;
                tblSupplier.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";
            }

        }
    }
}

//Add- Display Errors
function getErrors() {

    var errors = "";
    addvalue = "";

    if (supplier.fullname == null) {
        errors = errors + "\n" + "Supplier full name Not Entered";
        txtFullname.style.border = invalid;
    } else addvalue = 1;

    if (supplier.contactno1 == null) {
        errors = errors + "\n" + "Contact no Not Entered";
        txtConNo1.style.border = invalid;
    } else addvalue = 1;

    if (supplier.cpname == null) {
        errors = errors + "\n" + "Contact person name Not Entered";
        txtCPName.style.border = invalid;
    } else addvalue = 1;

    if (supplier.email == null) {
        errors = errors + "\n" + "Email Not Entered";
        txtEmail.style.border = invalid;
    } else addvalue = 1;

    if (supplier.address == null) {
        errors = errors + "\n" + "Address  Not Entered";
        txtAddress.style.border = invalid;
    } else addvalue = 1;

    if (supplier.bankname_id == null) {
        errors = errors + "\n" + "Bank Name Not Selected";
        cmbBankName.style.border = invalid;
    } else addvalue = 1;

    if (supplier.bankbranch_id == null) {
        errors = errors + "\n" + "Bank Branch Name Not Selected";
        cmbBankBranchName.style.border = invalid;
    } else addvalue = 1;

    // msg for fill data in innertable
    if (supplier.supplierhasmaterialList.length == 0) {
        cmbInnerMaterial.style.border = invalid;
        errors = errors + "\n" + "Supplier material not added";

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
    console.log(supplier)
    swal({
        title: "Are you sure to add following supplier...?",
        text: "\n Full Name : " + supplier.fullname +
            "\n Contact No : " + supplier.contactno1 +
            "\n Contact Person Name  : " + supplier.cpname +
            "\n Bank Name  : " + supplier.bankname_id.name +
            "\n Email : " + supplier.email +
            "\n Address : " + supplier.address,
        icon: "warning",
        buttons: true,
        dangerMode: true, className: "purple-swal",
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/supplier", "POST", supplier);
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
                // changeTab('table');
                $('#tableview').modal('show')
            } else swal({
                title: 'Save not Success... , You have following errors', icon: "error",
                text: '\n ' + response,
                button: true, className: "purple-swal",
            });
        }
    });

}

function btnClearMC() {
    //Get Cofirmation from the User window.confirm();
    checkerr = getErrors();

    if (oldsupplier == null && addvalue == "") {
        loadForm();
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true, className: "purple-swal",
        }).then((willDelete) => {
            if (willDelete) {
                loadForm();
            }

        });
    }

}

function fillForm(sup, rowno) {
    activepage = rowno;

    if (oldsupplier == null) {
        filldata(sup);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true, className: "purple-swal",
        }).then((willDelete) => {
            if (willDelete) {
                filldata(sup);
            }

        });
    }

}

function filldata(sup) {

    clearSelection(tblSupplier);
    selectRow(tblSupplier, activepage, active);

    supplier = JSON.parse(JSON.stringify(sup));
    oldsupplier = JSON.parse(JSON.stringify(sup));

    console.log("Sup ", supplier)

    txtFullname.value = supplier.fullname;
    txtConNo2.value = supplier.contactno1;
    txtConNo1.value = supplier.cpname;
    txtCPName.value = supplier.cpname;
    txtEmail.value = supplier.email;
    txtAddress.value = supplier.address;
    txtBAccNo.value = supplier.bankaccountno;
    txtBHName.value = supplier.bankholdername;
    // txtArreasAmount.value = supplier.arreasamount;



    fillCombo(cmbBankName, "Select Bank Name", banknames, "name", supplier.bankname_id.name);
    fillCombo(cmbBankBranchName, "Select Bank Branch", bankbranches, "name", supplier.bankbranch_id.name);


    disableButtons(true, false, false);
    setStyle(valid);

    refreshInnerForm()
    $('#tableview').modal('hide')

}

//Update-Display updated values msg
function getUpdates() {

    var updates = "";

    if (supplier != null && oldsupplier != null) {
        if (supplier.fullname != oldsupplier.fullname)
            updates = updates + "\nFullname is Changed";

        if (supplier.contactno1 != oldsupplier.contactno1)
            updates = updates + "\nContact No is Changed";

        if (supplier.cpname != oldsupplier.cpname)
            updates = updates + "\nContact Person Name is Changed";

        if (supplier.contactno2 != oldsupplier.contactno2)
            updates = updates + "\n Second No is Changed";

        if (supplier.email != oldsupplier.email)
            updates = updates + "\n Email is Changed";

        if (supplier.address != oldsupplier.address)
            updates = updates + "\n Address is Changed";

        if (supplier.bankholdername != oldsupplier.bankholdername)
            updates = updates + "\n Bankholder Name is Changed";

        if (supplier.bankname_id.name != oldsupplier.bankname_id.name )
            updates = updates + "\nBank Name is Changed";

        if (supplier.bankbranch_id.name != oldsupplier.bankbranch_id.name)
            updates = updates + "\nBank Branch is Changed";


        if (supplier.bankaccountno != oldsupplier.bankaccountno)
            updates = updates + "\n Bank Account No is Changed";

        // if (supplier.arreasamount != oldsupplier.arreasamount)
        //     updates = updates + "\n Arreas Amount is Changed";

        // console.log("OLD",oldsupplier.oldSupplierhasmaterial);
        // console.log("New",supplier.Supplierhasmaterial);
        console.log("New", supplier.Supplierhasmaterial);
        console.log("New", oldsupplier.oldSupplierhasmaterial);

        if (isEqual(supplier.supplierhasmaterialList, oldsupplier.supplierhasmaterialList, 'material_id')) {
            updates = updates + "\nMaterial is changed !";
        }
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
                timer: 1200, className: "purple-swal",
            });
        else {
            swal({
                title: "Are you sure to update following supplier details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true, className: "purple-swal",
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/supplier", "PUT", supplier);
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
                            $('#tableview').modal('show')

                        } else window.alert("Failed to Update as \n\n" + response);
                    }
                });
        }
    } else
        swal({
            title: 'You have following errors in your form', icon: "error",
            text: '\n ' + getErrors(),
            button: true, className: "purple-swal",
        });

}

//Delelete function-delete a row from the table
function btnDeleteMC(sup) {
    supplier = JSON.parse(JSON.stringify(sup));

    swal({
        title: "Are you sure to delete following supplier...?",
        text: "\n Reg No : " + supplier.regno +
            "\n suppliernam : " + supplier.fullname,
        icon: "warning", buttons: true, dangerMode: true, className: "purple-swal",
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/supplier", "DELETE", supplier);
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
                    icon: "error", button: true, className: "purple-swal",
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

function btnPrintTableMC(supplier) {


    //open new tab in the browser
    var newwindow = window.open();
    formattab = tblSupplier.outerHTML;


    //write print table in the new tab
    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Supplier Details : </h1></div>" +
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