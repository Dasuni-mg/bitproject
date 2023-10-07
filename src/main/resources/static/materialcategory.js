window.addEventListener("load", initialize);


//Initializing Functions
function initialize() {

    $('[data-toggle="tooltip"]').tooltip()

    //add/clear/update button event handlers
    btnAdd1.addEventListener("click", btnAddMC1);

//colours
    valid = "3px solid #078D27B2";
    invalid = "3px solid red";
    initial = "1px solid #d6d6c2";
    updated = "3px solid #ff9900";
    active = "rgba(7,141,39,0.6)";


    //calling load view function for load view side
    loadView();
    //calling load form function for refresh form side
    loadForm1();
    //load form tab
    // $('#tableview').modal('hide');
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


function loadForm1() {
    materialcategory = new Object();
    oldmaterialcategory = null;


    txtMaterialCategory.value = "";

    // set field to initial color
    setStyle(initial);

}

function setStyle(style) {
    txtMaterialCategory.style.border = style;
}


//Add-click the Add button
function btnAddMC1() {
    savedata1();                                         //if optional fields are not acceptable then save data
}

//Add-Save data in to the database
function savedata1() {

    swal({
        title: "Are you sure to add following material...?",
        text:
            "\nUnit Type: " + materialcategory.name,
        icon: "warning",
        buttons: true,
        dangerMode: true,
        className: "purple-swal"

    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/materialcategory", "POST", materialcategory);
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
                loadForm1();

            } else swal({
                title: 'Save not Success... , You have following errors', icon: "error",
                text: '\n ' + response,
                button: true, className: "purple-swal"
            });
        }
    });

}
