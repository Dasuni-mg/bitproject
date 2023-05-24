window.addEventListener("load", initializeC);

//Initializing Functions- run when load the html
function initializeC() {

    $('[data-toggle="tooltip"]').tooltip()

    // //add/clear/update button event handlers
     btnAdd1.addEventListener("click", btnAddMCCUS);

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
    initial = "3px solid #d6d6c2";
    updated = "3px solid #ff9900";
    active = "rgba(250,210,11,0.7)";


    loadFormC();
    //calling load view function for load view side

}



function loadFormC() {
    //customer front end object
    customer = new Object();
    oldcustomer = null;

//Auto selected Registered No
    nextcu = httpRequest("../customer/nextcu", "GET");
    txtRegNo.value = nextcu.regno;
    customer.regno = txtRegNo.value;
    txtRegNo.disabled = true;


    //text field empty when form load(without auto bind fields)
    txtFname.value = "";
    txtLname.value = "";
    txtmno1.value = "";
    txtmno2.value = "";
    txtNic.value = "";
    txtAddress.value = "";

    setStyleC(initial);

    //for auto bind fields(border colour valid= green)
    txtRegNo.style.border = valid;


    disableButtonsC(false, true);
}


function disableButtonsC(add, upd, del) {

    if (add || !privilages.add) {
        btnAdd1.setAttribute("disabled", "disabled");
        $('#btnAdd1').css('cursor', 'not-allowed');
    } else {
        btnAdd1.removeAttribute("disabled");
        $('#btnAdd1').css('cursor', 'pointer')
    }

    // if (upd || !privilages.update) {
    //     btnUpdate1.setAttribute("disabled", "disabled");
    //     $('#btnUpdate1').css('cursor', 'not-allowed');
    // } else {
    //     btnUpdate1.removeAttribute("disabled");
    //     $('#btnUpdate1').css('cursor', 'pointer');
    // }

    // if (!privilages.update) {
    //     $(".buttonup").prop('disabled', true);
    //     $(".buttonup").css('cursor', 'not-allowed');
    // } else {
    //     $(".buttonup").removeAttr("disabled");
    //     $(".buttonup").css('cursor', 'pointer');
    // }
    //
    // if (!privilages.delete) {
    //     $(".buttondel").prop('disabled', true);
    //     $(".buttondel").css('cursor', 'not-allowed');
    // } else {
    //     $(".buttondel").removeAttr("disabled");
    //     $(".buttondel").css('cursor', 'pointer');
    // }

    // // select deleted data row
    // for (index in reservations) {
    //     if (reservations[index].reservationstatus_id.name == "Deleted") {
    //         tblDelivery.children[1].children[index].style.color = "#f00";
    //         tblDelivery.children[1].children[index].style.border = "2px solid red";
    //         tblDelivery.children[1].children[index].lastChild.children[1].disabled = true;
    //         tblDelivery.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";
    //
    //     }
    // }

}

function setStyleC(style) {

    txtRegNo.style.border = style;
    txtFname.style.border = style;
    txtLname.style.border = style;
    txtmno1.style.border = style;
    txtmno2.style.border = style;
    txtNic.style.border = style;
    txtAddress.style.border = style;


}

function getErrorsC() {

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

//Add-click the Add button
function btnAddMCCUS() {
    if (getErrorsC() == "") {                   //If there are no errors
        if (txtmno2.value == "" || txtNic.value =="") {     //Check empty optinal fields are acceptable or not
            swal({
                title: "Are you sure to continue...?",           //display msg when there are empty optional fields
                text: "Form has some empty fields.....",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    savedataC();                                 //if empty optional fields are ok then save data to the database
                }
            });

        } else {
            savedataC();                                         //if optional fields are not acceptable then save data
        }
    } else {                                                      // if there are errors display errors
        swal({
            title: "You have following errors",
            text: "\n" + getErrorsC(),
            icon: "error",
            button: true,
        });

    }
}
function savedataC() {

    swal({
        title: "Are you sure to add following customer...?",
        text: "\nRegistration NO: " + customer.regno +
            "\nFirst Name : " + customer.fname +
            "\nLast Name : " + customer.lname +
            "\nMobile no1 : " + customer.mobileno,

        icon: "warning",
        buttons: true,
        dangerMode: true,
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
                    timer: 1200
                });
                activepage = 1;
                activerowno = 1;
                // loadSearchedTable();
                loadFormC();


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
    checkerr = getErrorsC();

    if (oldcustomer == null && addvalue == "") {
        loadFormC();
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                loadFormC();
            }

        });
    }

}



