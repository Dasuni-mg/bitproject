
window.addEventListener("load",initial);

function initial(){

    activerowno = "";
    activepage = 1;
    var query = "&searchtext=";
    loadTable(1,cmbPageSize.value,query);
}

function loadTable(page,size,query) {
    page = page - 1;
    activecreservations = new Array();
    var data = httpRequest("/reservation/findAllactive?page="+page+"&size="+size+query,"GET"); //hada gththa function eken data tika gnnwa
    if(data.content!= undefined) activecreservations = data.content; //data ekee thibba content eka ara gnnwa
    createPagination('pagination',data.totalPages, data.number+1,paginate);
    fillTable('tblMainReservation',activecreservations,fillForm,btnDeleteMC,viewitem);
    clearSelection(tblMainReservation); //selected raw ekak thiyanwanm clear krnna ooni

    if(activerowno!="")selectRow(tblMainCustomers,activerowno,active); //active row ekak thiyanawanm mark wenna ooni

}

function paginate(page) {
    var paginate;
    if(oldemployee==null){
        paginate=true;
    }else{
        if(getErrors()==''&&getUpdates()==''){
            paginate=true;
        }else{
            paginate = window.confirm("Form has Some Errors or Update Values. " +
                "Are you sure to discard that changes ?");
        }
    }
    if(paginate) {
        activepage=page;
        activerowno=""
        loadForm();
        loadSearchedTable();
    }

}
function fillForm(){

}
function btnDeleteMC(){}
function viewitem(){}



//Table Functions
function tableManin(parentid,id,metadata, hasBtn=true){
    var parent = document.getElementById(parentid);
    var table = createElement('table',id);
    table.border = 2;
    table.classList.add('table');
    table.classList.add('table-striped');
    table.classList.add('table-hover');

    var thead = createElement('thead');
    thead.classList.add('thead-light');
    var tbody = createElement('tbody');
    tbody.classList.add('table-info')
    var row1 = createElement('tr');
    var th = createElement('th');
    th.innerHTML="Index";
    th.style.width='75px';

    th.classList.add('tableFonts')

    row1.appendChild(th);

    var row2 = createElement('tr');
    var th = createElement('th');
    //row2.appendChild(th);
    for(var i=1; i<=metadata.length; i++){
        var th = createElement('th');
        th.setAttribute('datatype',metadata[i-1]['datatype']);
        if(typeof metadata[i-1]['property']=='function'){
            th.setAttribute('property',metadata[i-1]['property'].name);
            th.setAttribute('propertytype','function');
            th.setAttribute('cindex',i);
            // th.onclick = function () {
            //     sortTable(this.getAttribute('cindex'));
            // }

        }else{
            th.setAttribute('property',metadata[i-1]['property']);
            th.setAttribute('propertytype','attribute');
            th.setAttribute('cindex',i);
            th.onclick = function () {
                //sortTable(this.getAttribute('cindex'));
            }
        }

        th.innerHTML = metadata[i-1]['name'];
        //th.innerHTML = metadata[i-1]['name'] + "   " + '<i class="fa fa-sort isort" aria-hidden="true"></i>';
        row1.appendChild(th);
        // var th = createElement('th');
        // if(metadata[i-1]['search']){
        //     var input = createElement('input');
        //     input.setAttribute('type','text');
        //     input.setAttribute('placeholder','Search By '+metadata[i-1]['name']);
        //     input.setAttribute('onkeyup','filterTable(this)');
        //     input.setAttribute('index',i);
        //     input.classList.add('form-control');
        //     input.classList.add('input-sm');
        //     th.appendChild(input);
        // }
        // row2.appendChild(th);
    }

    if(hasBtn){
        var th = createElement('th');
        th.classList.add('modifybutton');
        th.style.width='180px'
        th.innerHTML="Modify";
        row1.appendChild(th);
        var th = createElement('th');
        row2.appendChild(th);
        table.setAttribute('hasButton','1');
    }else{
        table.setAttribute('hasButton','0');
    }
    thead.appendChild(row1);
    thead.appendChild(row2);
    table.appendChild(thead);
    table.appendChild(tbody);
    parent.appendChild(table);

}