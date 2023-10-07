window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    $('[data-toggle="tooltip"]').tooltip()

    //add/clear/update button event handlers
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);
    cmbInnerSMcategory.addEventListener("change", cmbInnerSMcategoryCH);

    $('.js-example-basic-single').select2();

    privilages = httpRequest("../privilage?module=MENU", "GET");
    menustatuses = httpRequest("../menustatus/list", "GET");
    menucategories = httpRequest("../menucategory/list", "GET");


    //inner array
    submenus = httpRequest("../submenu/list", "GET");
    submenucategories = httpRequest("../submenucategory/list", "GET");
    employees= httpRequest("../employee/list","GET");

    //services should be implemented to get services then write services to get list
    //2.make controller and repository


    //colours
    valid = "2px solid #078D27B2";
    invalid = "2px solid red";
    initial = "1px solid #d6d6c2";
    updated = "3px solid #ff9900";
    active = "rgba(250,210,11,0.7)";



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
    page = page - 1;            //initially 0 page(1-1=0)
    menus = new Array();    //menus array

    //Request to get quotation  list from URL
    var data = httpRequest("/menu/findAll?page=" + page + "&size=" + size + query, "GET");

    if (data.content != undefined) menus = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);

    //fill data into table using quotations array
    //fill form-update, btnDeleteMc-Clear , Viewqreq-print
    fillTable('tblMenu', menus, fillForm, btnDeleteMC, viewmenu);
    clearSelection(tblMenu);

    if (activerowno != "") selectRow(tblMenu, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldmenu = null) {
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
function viewmenu(mnu, rowno) {

    menu = JSON.parse(JSON.stringify(mnu));

    tdMCode.innerHTML= menu.menucode;
    tdMCategory.innerHTML=menu.menucategory_id.name;
    tdMenuName.innerHTML= menu.menuname;
    tdPrice.innerHTML= menu.price;


    $('#MenuViewModal').modal('show')

}

function btnPrintRowMC() {

    var format = printformtable.outerHTML;
    var newwindow = window.open();

    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'/>" +
        "<body><div style='margin-top: 150px'><h1>Menu Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 1000);
}

function cmbInnerSMcategoryCH() {
    cmbInnerSubmenu.disabled = false;
    submenusbysubmenucategory = httpRequest("/submenu/ListBySubmenu?submenuid=" + JSON.parse(cmbInnerSMcategory.value).id, "GET");
    fillCombo(cmbInnerSubmenu, "Select Sub Menu", submenusbysubmenucategory, "submenuname", "");
    cmbInnerSubmenu.style.border = initial;

}

function loadForm() {
    menu = new Object();
    oldmenu = null;

    $('#collapseOne').collapse('hide');
    menu.menuHasSubmenuList= new Array();

    fillCombo(cmbMCategory, "Select a Menu category", menucategories, "name", "");

    nxtmenuname = httpRequest("/menu/nextmenuname","GET");
    console.log("Menuname ",nxtmenuname.menucode)
    txtMName.value = nxtmenuname.menucode;
    menu.menuname = txtMName.value;
    txtMName.style.border = valid;
    txtMName.disabled = true;






    //text field empty


    txtPrice.value = "";


    setStyle(initial);




    disableButtons(false, true, true);


    refreshSubmenuInnerForm();
}

function refreshSubmenuInnerForm() {

    menuHasSubmenu = new Object();
    oldmenuHasSubmenu = null;

    cmbInnerSubmenu.disabled = true;
    //inner form submenu
    //autofill combo box

    fillCombo(cmbInnerSubmenu, "Select sub menu", submenus, "submenuname", "");
    fillCombo(cmbInnerSMcategory, "Select sub category", submenucategories, "name", "");
    console.log("Submenu ,",submenucategories)

    cmbInnerSubmenu.style.border = initial;
    cmbInnerSMcategory.style.border = initial;


    //Inner table
    fillInnerTable('tblInnerSubmenu', menu.menuHasSubmenuList, innerModify, innerSubmenuDelete, true);
    btnInnerUpdateSMC.disabled = true;
    btnInnerUpdateSMC.style.cursor = "not-allowed";

    btnInnerAddSMC.disabled = false;
    btnInnerAddSMC.style.cursor = "pointer";


}

function saveInnerdata(){

    var itmext = false;
    for (var index in menu.menuHasSubmenuList)
        //menuHasSubmenuList eke objct one by one read krnw
        if (menu.menuHasSubmenuList[index].submenu_id.submenucategory_id.name == menuHasSubmenu.submenu_id.submenucategory_id.name) {
            itmext = true;
            break;
        }

    if (itmext) {
        swal({
            title: "Already exist!",
            icon: "warning",
            text: '\n',
            customClass: "swal-bg",
            button: false,
            timer: 1200,
        });
        refreshSubmenuInnerForm();
    }else{
        swal({
            title: "Are you sure..?",
            text: "Add follownig details....\n"+
                "\n Sub Menu Category :"+ menuHasSubmenu.submenu_id.submenucategory_id.name+
                "\n Sub Menu  :"+ menuHasSubmenu.submenu_id.submenuname,
            icon: "warning",
            buttons: true,
            html: true,
            customClass: "swal-bg",
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
                menu.menuHasSubmenuList.push(menuHasSubmenu);
                refreshSubmenuInnerForm();
            }
        });
    }
}

function getInnerErrors(){


    var innerErrors = "";
    var inneraddvalue = "";

    console.log("menuhas ",menuHasSubmenu)
    //
    if(menuHasSubmenu.submenucategory_id == null){
        innerErrors = innerErrors +"\n"+ "Select the Sub Menu Category";
        cmbInnerSMcategory.style.border = invalid;
    }else{
        inneraddvalue = 1;
    }


    if(menuHasSubmenu.submenu_id== null){
        innerErrors = innerErrors +"\n"+ "Select the Sub Menu";

      cmbInnerSubmenu.style.border = invalid;
    }else{
        inneraddvalue = 1;
    }

    return innerErrors;
}

function getinnerupdate(){

    var innerupdate = "";

    if(menuHasSubmenu !=null && oldmenuHasSubmenu !=null){

        if (menuHasSubmenu.submenu_id.submenucategory_id.name != oldmenuHasSubmenu.submenu_id.submenucategory_id.name)
            innerupdate = innerupdate + "\nSub Menu Category .." + oldmenuHasSubmenu.submenu_id.submenucategory_id.name + " into " + menuHasSubmenu.submenu_id.submenucategory_id.name ;

        if (menuHasSubmenu.submenu_id.submenuname != oldmenuHasSubmenu.submenu_id.submenuname)
            innerupdate = innerupdate + "\nSub Menu is Changed.." + oldmenuHasSubmenu.submenu_id.submenuname+ " into " + menuHasSubmenu.submenu_id.submenuname;

    }
    return innerupdate;
}

function btnSubmenuInnerAddMC() {
  var innerErrors =  getInnerErrors();

    if (innerErrors == "") {
        saveInnerdata();


        } else {
        swal({
            title: "You don't fill some feilds ...!",
            text:innerErrors ,
            icon: "warning",
            buttons: true,

        })

        // refreshSubmenuInnerForm();
    }


}

function innerSubmenuDelete(innerob, innerrow) {
    swal({
        title: "Are you sure to remove Sub Menu?",
        text: "\nSubmenu Name : " + innerob.submenu_id.submenuname,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            menu.menuHasSubmenuList.splice(innerrow, 1);
            refreshSubmenuInnerForm();
        }
    });
}

function btnSubmenuInnerUpdateMC(){

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
                        menu.menuHasSubmenuList[innerrow] = menuHasSubmenu;

                        refreshSubmenuInnerForm();
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

function innerModify(ob,innerrowno) {
    btnInnerUpdateSMC.disabled = false;
    btnInnerUpdateSMC.style.cursor = "pointer";
    cmbInnerSubmenu.disabled = false;
    btnInnerAddSMC.disabled=true;
    innerrow =  innerrowno

    menuHasSubmenu = JSON.parse(JSON.stringify(ob));
    oldmenuHasSubmenu = JSON.parse(JSON.stringify(ob));
    console.log("SUB MENU EDIT ",menuHasSubmenu.submenu_id.submenucategory_id.name)

    // const subMenulist = menuHasSubmenu.submenu_id;

    fillCombo(cmbInnerSMcategory, "Select sub menu",  submenucategories, "name", menuHasSubmenu.submenu_id.submenucategory_id.name);
    fillCombo(cmbInnerSubmenu, "Select sub menu category", submenus, "submenuname", menuHasSubmenu.submenu_id.submenuname);

}

function btnSubmenuInnerClearMC(){

    swal({
        title: "Are you sure to Clear the form...?",
        // text: "Form has some empty fields.....",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            refreshSubmenuInnerForm();

        }
    });
}

function setStyle(style) {


    txtPrice.style.border = style;
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
    for (index in menus) {
        if (menus[index].menustatus_id.name == "Deleted") {
            tblMenu.children[1].children[index].style.color = "rgb(9,9,9)";
            tblMenu.children[1].children[index].style.backgroundColor = "rgba(238,114,114,0.66)";

            tblMenu.children[1].children[index].lastChild.children[0].disabled = true;
            tblMenu.children[1].children[index].lastChild.children[0].style.cursor = "not-allowed";

        }
    }

}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (menu.menucategory_id ==null) {
        errors = errors + "\n" + "Menu Category Not Selected";
        cmbMCategory.style.border = invalid;
    } else addvalue = 1;

    if (menu.menuname == null) {
        errors = errors + "\n" + "Menu Name Not Entered";
        txtMName.style.border = invalid;
    } else addvalue = 1;

    if (menu.price == null) {
        errors = errors + "\n" + "Price not Entered";
        txtPrice.style.border = invalid;
    } else addvalue = 1;

    // msg for fill data in inner submenu table
    if (menu.menuHasSubmenuList.length == 0) {
         // cmbInnerSubmenu.style.border = invalid;
        // $('.cmdSubcategory .select2-selection').css('border',invalid);
        errors = errors + "\n" + "sub menu not selected";

        // cmbInnerSMcategory.style.border=invalid;
        // errors = errors + "\n" + "sub menucategory not selected";
    } else addvalue = 1;

    return errors;

}

function checkValidation() {

    addvalue = "";

    if (menu.price != null) addvalue = 1;

    if (menu.menuname != null) addvalue = 1;

    // msg for fill data in inner submenu table
    if (menu.menuHasSubmenuList.length != 0) addvalue = 1;

}

function btnAddMC() {

    if(getErrors()==""){
        savedata();
    }else{
        swal({
            title: "You have following errors",
            text: "\n"+getErrors(),
            icon: "error",
            button: true,
        });

    }















}

function savedata() {

    swal({
        title: "Are you sure to add following Menu...?",
        text:

            "\n Menu category : " + JSON.parse(cmbMCategory.value).name +
            "\n Menu Name : " + menu.menuname +
            "\n price : " + menu.price,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/menu", "POST", menu);
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

    if (oldmenu == null && addvalue == "") {
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

function fillForm(mnu, rowno) {
    activepage = rowno;

    if (oldmenu == null) {
        filldata(mnu);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(mnu);
            }

        });
    }

}

function filldata(mnu) {
    clearSelection(tblMenu);
    selectRow(tblMenu, activepage, active);

    menu = JSON.parse(JSON.stringify(mnu));
    oldmenu = JSON.parse(JSON.stringify(mnu));

    txtMName.value= menu.menuname ;
    txtPrice.value= menu.price ;



    fillCombo(cmbMCategory, "Select Menu Category", menucategories, "name", menu.menucategory_id.name);

    disableButtons(true, false, false);
    setStyle(valid);




    console.log("sub menu list ", menu.menuHasSubmenuList)

    refreshSubmenuInnerForm();
    $('#tableview').modal('hide')

    // console.log("Inner List",menu.menuHasSubmenuList)
    // fillInnerTable('tblInnerSubmenu', menu.menuHasSubmenuList, innerModify, innerSubmenuDelete, true);
}

//Update-Display updated values msg
function getUpdates() {

    var updates = "";

    if (menu != null && oldmenu != null) {

        // if (menu.menucode != oldmenu.menucode)
        //     updates = updates + "\nmenu Code is Changed";

        if (menu.menuname != oldmenu.menuname)
            updates = updates + "\nmenuname is Changed";

        if (menu.price != oldmenu.price)
            updates = updates + "\nprice is Changed";

        if (menu.addeddate != oldmenu.addeddate)
            updates = updates + "\naddeddate  is Changed";

        if (menu.description != oldmenu.description)
            updates = updates + "\ndescription is Changed";

        if (menu.menustatus_id.name != oldmenu.menustatus_id.name)
            updates = updates + "\nmenu status is Changed";

        console.log("old",oldmenu.menuHasSubmenuList)
        console.log("new",menu.menuHasSubmenuList)

        if(isEqual(menu.menuHasSubmenuList,oldmenu.menuHasSubmenuList,'submenucategory_id')){
            updates = updates + "\nSub Menu is Changed !";
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
                timer: 1200
            });
        else {
            swal({
                title: "Are you sure to update following Menu details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/menu", "PUT", menu);
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
            button: true
        });

}

function btnDeleteMC(mnu) {
    menu = JSON.parse(JSON.stringify(mnu));

    swal({
        title: "Are you sure to delete following menu...?",
        text:
            "\nMenu code: " + menu.menucode +
            "\nMenu Name: " + menu.menuname ,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/menu", "DELETE", menu);
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

function btnPrintTableMC(mnu) {

    var newwindow = window.open();
    formattab = tblMenu.outerHTML;
    //write print table in the new tab
    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Menu Details : </h1></div>" +
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