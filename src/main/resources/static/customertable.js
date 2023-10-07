window.addEventListener("load", initialize);

//Initializing Functions- run when load the html
function initialize() {

    $('[data-toggle="tooltip"]').tooltip()

    btnAdd1.addEventListener("click", btnAddMC);
    btnClear1.addEventListener("click", btnClearMC);
    btnUpdate1.addEventListener("click", btnUpdateMC);

    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=CUSTOMER", "GET");

    //1.Make arrays as customerstatuses and emplooyes to get list for combo box
    customerstatuses = httpRequest("../customerstatus/list", "GET");
    employees = httpRequest("../employee/list", "GET");

    //services should be implemented to get services then write services to get list
    //2.make controller and repository


    //colours
    valid = "3px solid #078D27B2";
    invalid = "3px solid red";
    initial = "1px solid #d6d6c2";
    updated = "3px solid #ff9900";
    active = "rgba(7,141,39,0.6)";


    loadView();
    //calling load view function for load view side
    loadForm();
    //calling load view function for load view side
    //changeTab('form');
    //calling form tab
}

//loadview eka athule thamai loadtable eka thiyenne
function loadView() {

    //Search Area
    txtSearchName.value = "";
    txtSearchName.style.background = "";

    //Table Area
    activerowno = "";
    activepage = 1;              //palaweni eke pennanne anthimata add kala data
    var query = "&searchtext=";
    loadTable(1, cmbPageSize.value, query);
}

//for fill data into table
function loadTable(page, size, query) {
    page = page - 1;             //initially 0 page(1-1=0)
    customers = new Array();     //customers list

    // Request to get customer list from URL
    var data = httpRequest("/customer/findAll?page=" + page + "&size=" + size + query, "GET");

    if (data.content != undefined) customers = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);

    //fill data into table using customers array
    //fill form-update, btnDeleteMc-Clear , Viewqreq-print
    fillTable('tblCustomer', customers, fillForm, btnDeleteMC, viewcus);
    clearSelection(tblCustomer);

    if (activerowno != "") selectRow(tblCustomer, activerowno, active);

}

//check nic already exist or not
function customerNICBinder(){

    var val = txtNic.value.trim();


    if(val !=""){

        var regpattern = new RegExp('^(([0-9]{9}[vVxX])|([0-2]{12}))$');
        //test eken krnne api input krna nic ekai set krla thiyena regex pattern ekai equal da kiyla
        if(regpattern.test(val)){

            var response = httpRequest("customer/byNIC?nic="+val,"GET")
            console.log(response);
            if(response == ""){
                customer.nic = val;
                if(oldcustomer !=null && customer.nic != oldcustomer.nic){
                    txtNic.style.border = updated;
                }else{
                    txtNic.style.border = valid;
                }


            }else{
                swal({
                    title: "NIC Already Exist....!",
                    text: "\n\n",
                    icon: "warning",
                    button: false,timer:1500,
                    className: "purple-swal"
                });
            }

        }else{
            txtNic.style.border = invalid;
            customer.nic = null;
        }
    }else{
        if(txtNic.required){
            txtNic.style.border = invalid;
        }else{
            txtNic.style.border = initial;
        }
        customer.nic = null;
    }

}


//check mobile already exist or not
function customerMobileBinder(){

    var val = txtmno1.value.trim();


    if(val !=""){

        var regpattern = new RegExp('^0\\d{9}$');
        //test eken krnne api input krna mobileno ekai set krla thiyena regex pattern ekai equal da kiyla
        if(regpattern.test(val)){

            var response = httpRequest("customer/byMobile?mobileno="+val,"GET")
            console.log(response);
            if(response == ""){
                customer.mobileno = val;
                if(oldcustomer !=null && customer.mobileno != oldcustomer.mobileno){
                    txtmno1.style.border = updated;
                }else{
                    txtmno1.style.border = valid;
                }


            }else{
                swal({
                    title: "This Mobile No is  Already Exist....!",
                    text: "\n\n",
                    icon: "warning",
                    button: false,
                    timer:1500,
                    className: "purple-swal"
                });
            }

        }else{
            txtmno1.style.border = invalid;
            customer.mobileno = null;
        }
    }else{
        if(txtmno1.required){
            txtmno1.style.border = invalid;
        }else{
            txtmno1.style.border = initial;
        }
        customer.mobileno = null;
    }

}


function paginate(page) {
    var paginate;
    if (oldcustomer == null) {
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
function viewcus(cus, rowno) {

    customer = JSON.parse(JSON.stringify(cus));


    tdRegNo.innerHTML = customer.regno;
    tdFname.innerHTML = customer.fname;
    tdLname.innerHTML = customer.lname;
    tdmno1.innerHTML = customer.mobileno;
       tdNic.innerHTML = customer.nic;
    tdAddress.innerHTML = customer.address;


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
    //customer front end object
    customer = new Object();
    oldcustomer = null;





    //text field empty when form load(without auto bind fields)
    txtFname.value = "";
    txtLname.value = "";
    txtmno1.value = "";
    txtmno2.value = "";
    txtNic.value = "";
    txtAddress.value = "";

    setStyle(initial);


    disableButtons(false, true);
}

function setStyle(style) {

    txtFname.style.border = style;
    txtLname.style.border = style;
    txtmno1.style.border = style;
    txtmno2.style.border = style;
    txtNic.style.border = style;
    txtAddress.style.border = style;


}

function disableButtons(add, upd) {

    if (add || !privilages.add) {
        btnAdd1.setAttribute("disabled", "disabled");
        $('#btnAdd1').css('cursor', 'not-allowed');
    } else {
        btnAdd1.removeAttribute("disabled");
        $('#btnAdd1').css('cursor', 'pointer')
    }

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

    for (index in customers) {
        if (customers[index].customerstatus_id.name == "Deleted") {
            tblCustomer.children[1].children[index].style.color = "rgb(9,9,9)";
            tblCustomer.children[1].children[index].style.backgroundColor = "rgba(238,114,114,0.66)";

            tblCustomer.children[1].children[index].lastChild.children[0].disabled = true;
            tblCustomer.children[1].children[index].lastChild.children[0].style.cursor = "not-allowed";

            tblCustomer.children[1].children[index].lastChild.children[1].disabled = true;
            tblCustomer.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";
        }
    }
}

function getErrors() {

    var errors = "";
    addvalue = "";


    if (customer.fname == null) {
        errors = errors + "\n" + "First Name is Not Entered";
        txtFname.style.border = invalid;
    } else addvalue = 1;

    if (customer.lname == null) {
        errors = errors + "\n" + "Last Name Not is Entered";
        txtLname.style.border = invalid;
    } else addvalue = 1;

    if (customer.mobileno == null) {
        errors = errors + "\n" + "Mobile No 1 is Not Entered";
        txtmno1.style.border = invalid;
    } else addvalue = 1;

    if (customer.address == null) {
        errors = errors + "\n" + "Customer Address is Not Entered";
        txtAddress.style.border = invalid;
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
            // Add custom style here
            className: "purple-swal",
        });

    }
}

function savedata() {

    swal({
        title: "Are you sure to add following customer...?",
        text: "\nRegistration NO: " + customer.regno +
            "\nFirst Name : " + customer.fname +
            "\nLast Name : " + customer.lname +
            "\nMobile no1 : " + customer.mobileno +
            "\nNIC : " + customer.nic ,
        icon: "warning",
        buttons: true,
        dangerMode: true,
        // Add custom style here
        className: "purple-swal",
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/customer", "POST", customer);
            if (response == "0") {
                swal({
                    position: 'center',
                    icon: 'success',
                    title: 'Customer has been  \n Added SuccessFully..!',
                    text: '\n',
                    button: false,
                    timer: 1200,

                });
                activepage = 1;
                activerowno = 1;
                loadSearchedTable();
                loadForm();
                $('#exampleModal').modal('hide')
            } else swal({
                title: 'Save not Success... , You have following errors', icon: "error",
                text: '\n ' + response,
                button: true,
                className: "purple-swal"
            });
        }
    });

}

function btnClearMC() {
    //Get Cofirmation from the User window.confirm();
    checkerr = getErrors();

    if (oldcustomer == null && addvalue == "") {
        loadForm();
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            className: "purple-swal"
        }).then((willDelete) => {
            if (willDelete) {
                loadForm();
            }

        });
    }

}

//Update - Get a user confirmation for refill form
function fillForm(cus, rowno) {
    activerowno = rowno;

    if (oldcustomer == null) {
        filldata(cus);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,className: "purple-swal"
        }).then((willDelete) => {
            if (willDelete) {
                filldata(cus);
            }

        });
    }

}

//Update - Refill data into form
function filldata(cus) {

    clearSelection(tblCustomer);
    selectRow(tblCustomer, activerowno, active);

    customer = JSON.parse(JSON.stringify(cus));
    oldcustomer = JSON.parse(JSON.stringify(cus));


    txtFname.value = customer.fname;
    txtLname.value = customer.lname;
    txtmno1.value = customer.mobileno;
    txtmno2.value = customer.secondno;
    txtNic.value = customer.nic;
    txtAddress.value = customer.address;


    disableButtons(true, false, false);
    setStyle(valid);
    //changeTab('form');
    $('#exampleModal').modal('show')
}

//Update-Display updated values msg
function getUpdates() {

    var updates = "";

    if (customer != null && oldcustomer != null) {

        if (customer.regno != oldcustomer.regno)
            updates = updates + "\nRegistration NO is Changed.." + oldcustomer.regno + " into " + customer.regno;

        if (customer.fname != oldcustomer.fname)
            updates = updates + "\nFirst Name is Changed.." + oldcustomer.fname + " into " + customer.fname;

        if (customer.lname != oldcustomer.lname)
            updates = updates + "\nLast Name is Changed.." + oldcustomer.lname + " into " + customer.lname;

        if (customer.mobileno != oldcustomer.mobileno)
            updates = updates + "\n Mobile No is Changed.. " + oldcustomer.mobileno + " into " + customer.mobileno;

        if (customer.secondno != oldcustomer.secondno)
            updates = updates + "\n Second No is Changed.." + oldcustomer.secondno + " into " + customer.secondno;

        if (customer.nic != oldcustomer.nic)
            updates = updates + "\n NIC is Changed.." + oldcustomer.nic + " into " + customer.nic;

        if (customer.address != oldcustomer.address)
            updates = updates + "\n Address is Changed." + oldcustomer.address + " into " + customer.address;

        if (customer.description != oldcustomer.description)
            updates = updates + "\n Description is Changed.." + oldcustomer.description + " into " + customer.description;

        if (customer.addeddate != oldcustomer.addeddate)
            updates = updates + "\n Added date is Changed.." + oldcustomer.addeddate + " into " + customer.addeddate;

        if (customer.point != oldcustomer.point)
            updates = updates + "\n Point is Changed.." + oldcustomer.point + " into " + customer.point;

        if (customer.customerstatus_id.name != oldcustomer.customerstatus_id.name)
            updates = updates + "\n Customer Status Id is Changed.." + oldcustomer.customerstatus_id.name + " into " + customer.customerstatus_id.name;

        if (customer.employee_id.name != oldcustomer.employee_id.name)
            updates = updates + "\n Added Employee is Changed.." + oldcustomer.employee_id.name + " into " + customer.employee_id.name;


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
                timer: 1200,
                className: "purple-swal"
            });
        else {                                                                                      //if there are updates then
            swal({
                title: "Are you sure to update following customer details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,className: "purple-swal"
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/customer", "PUT", customer);
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
                            $('#exampleModal').modal('hide')

                        } else swal({
                            title: 'Failed to add ...', icon: "error",
                            text: 'You have following error \n' + response,
                            button: true,
                            className: "purple-swal"
                        });
                    }
                });
        }
    } else
        swal({
            title: 'You have following errors in your form', icon: "error",
            text: '\n ' + getErrors(),
            button: true,
            className: "purple-swal"
        });

}

function btnDeleteMC(cus) {
    customer = JSON.parse(JSON.stringify(cus));

    swal({
        title: "Are you sure to delete following customer...?",
        text: "\n customer Number : " + customer.regno +
            "\n customer Fullname : " + customer.fname + " " + customer.lname,
        icon: "warning", buttons: true, dangerMode: true,className: "purple-swal"
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/customer", "DELETE", customer);
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
                    icon: "error", button: true,className: "purple-swal"
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
function btnPrintTableMC(customer) {

    var newwindow = window.open();
    formattab = tblCustomer.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='/resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>customers Details : </h1></div>" +
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

    var cprop = tblcustomer.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        customers.sort(
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
        customers.sort(
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
    fillTable('tblcustomer', customers, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblcustomer);
    loadForm();

    if (activerowno != "") selectRow(tblcustomer, activerowno, active);


}



