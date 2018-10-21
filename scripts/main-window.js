const electron = require('electron');
const { ipcRenderer } = electron;
// load database
var Datastore = require('nedb');
var path = require('path');
var dbpath = path.join(__dirname,'../scripts/profiles_db');
var db = new Datastore({filename: dbpath });
db.loadDatabase(function(err){
});
var profiles = [];
var selected;
// load list to table
function loadProfiles( search ){
    if(search === undefined || search === '' ) {
        db.find({},(err,docs) => {
        profiles = docs;
        loadRows();
        }); //end find
    } else {
        var arg = new RegExp(search);
        var query = getQuery(selected,arg);
        console.log(selected);
        db.find(query, (err,docs) => {
        profiles = docs;
        loadRows();
        }); //end find search
    }
} // end loadProfiles
function editRow(id){
    var item = id;
    ipcRenderer.send('profile:edit', item);
}
function deleteRow(id){
    db.remove({_id: id }, (err, numRemoved) => {  });
    loadProfiles('');
}

function loadRows(){
        $('.profile-list table tbody').empty();
    for (var i = profiles.length - 1; i >= 0; i--) {
        var lname = profiles[i]['lastname'];
        var fname = profiles[i]['firstname'];
        var mname = profiles[i]['middlename'];
        var sex = profiles[i]['sex'];
        var age = profiles[i]['age'];
        var address = profiles[i]['address'] === undefined ? ' - ' : profiles[i]['address'];
        var pid = profiles[i]['_id'];

        $('.profile-list table tbody').append(
            '<tr>' +
            '<td>' + lname + '</td>' +
            '<td>' + fname + '</td>' +
            '<td>' + mname + '</td>' +
            '<td>' + sex + '</td>' +
            '<td>' + age + '</td>' +
            '<td>' + address + '</td>' +
            '<td>' + '<a href="#" class="edit-button" id="'+ pid + '"><span class="oi oi-pencil"></span></a>' + '</td>' +
            '<td>' + '<a href="#" class="delete-button" id="'+ pid + '"><span class="oi oi-x"></span></a>' + '</td>' +
            '</tr>');
    }
    // create click event for edit row
    $('.edit-button').on('click', function() {
        var id = $(this).attr('id');
        editRow(id);
    });
    // create click event for delete row
    $('.delete-button').on('click', function() {
        var id = $(this).attr('id');
        deleteRow(id);
    });
}
// initial load
$(document).ready(() => {
    $('input[name=search]').focus();
    loadProfiles('');
});
// search function
$('input[name=search]').on('change', function(){
    var arg = $(this).val();
    loadProfiles(arg);
});
$('#search-select').change(function(){
    var selection = $(this).find("option:selected").val();
    selected = selection;
    console.log('selection: ' + selection);
});

// create click event for new profile
$('#new-profile').on('click',() => {
    var item = null;
    ipcRenderer.send('profile:create', item);
     });

// create query for search-selection
function getQuery( selection, arg ) {
    switch (selection) {
        case '1':
            return { lastname: arg };

            break;
        case '2':
            return { firstname: arg };
            break;
        case '3':
            return { middlename: arg };
            break;
        case '4':
            return {sex: arg };
            break;
        case '5':
            return {age: arg };
            break;
        case '6':
            return {address: arg };
            break;
        default:
            return {firstname: arg };
            break;
    }
}