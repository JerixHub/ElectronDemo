const electron = require('electron');
const { ipcRenderer } = electron;
// load database
var Datastore = require('nedb');
var path = require('path');
var dbpath = path.join(__dirname,'../scripts/user_db');
var db = new Datastore({filename: dbpath, autoload: true });
// add form listener
var form = document.querySelector('form');
form.addEventListener('submit', submitForm );
let adminuser;
let oldpw;
let encrypted_pw;
let pwBytes;
const key = 'zOrqYsyunulq64Md';


function loadSettings(){
    db.findOne({ _id: 'zOrqYsyunulq64Md' }, (err,doc) => {
        console.log(doc);
        adminuser = doc['username'];
        encrypted_pw = doc['password'];
        pwBytes = CryptoJS.AES.decrypt(encrypted_pw, 'DentalApp');
        oldpw = pwBytes.toString(CryptoJS.enc.Utf8);
        $('#username').val(adminuser);
    });
}

$(document).ready(() => {
    loadSettings();
});
// submit callback
function submitForm(e){
    e.preventDefault();
    var newname = $('#username').val();
    var old = $('#old-password').val();
    var newpw = $('#new-password').val();
    var confirmpw = $('#confirm-password').val();
    var encrypted = CryptoJS.AES.encrypt(newpw, 'DentalApp');
    if( adminuser == newname && old == '') {
        return;
    }
    if( old == '' ) {
        db.update({ _id: 'zOrqYsyunulq64Md' }, {$set: { username: newname } }, {upsert: false}, (err, numReplaced) => {
                 if(err == null) {
                    $('.notification').text('Saved.');
                }
         });
        return;
    } else if (old !== oldpw ) {
        console.log('old-password: ' + old);
        console.log('old-pw: ' + oldpw);
        $('.notification').text('Incorrect password.');
        return;
    } else if (newpw !== confirmpw) {
        console.log('new-pw: ' + newpw);
        console.log('confirm-pw: ' + confirmpw);
        $('.notification').text('New and Confirm Passwords are not the same.');
        return;
    } else if ( newpw == '' || confirmpw == '' ){
        $('.notification').text('Password cannot be empty.');
        return;
    } else {
        console.log('encrypted: ' + encrypted.toString());
        db.update({ _id: 'zOrqYsyunulq64Md' }, { $set: { "password": encrypted } }, {upsert: false}, (err, numReplaced) => {
        console.log(err);
                 if(err == null) {
                    $('.notification').text('Saved.');
                }
         });
            return;
    }
}