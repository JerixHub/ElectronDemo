const electron = require('electron');
const { ipcRenderer } = electron;
const path = require('path');
const url = require('url');
const BrowserWindow = require('electron').remote.BrowserWindow;

var config = {
    apiKey: "AIzaSyCZ9jutSoUMj2znaZUc_oL84dLHY3YVmPA",
    authDomain: "dentistapp-b56b9.firebaseapp.com",
    databaseURL: "https://dentistapp-b56b9.firebaseio.com",
    projectId: "dentistapp-b56b9",
    storageBucket: "dentistapp-b56b9.appspot.com",
    messagingSenderId: "1026235558917"
  };
firebase.initializeApp(config);

const registerButton = document.getElementById('registerButton');
registerButton.addEventListener('click', function(e){
    document.location.href="registerWindow.html";
});

var loginButton = document.getElementById('loginButton');
var togglePasswordVisibility = document.getElementById('togglePasswordVisibility');


togglePasswordVisibility.addEventListener('click', function(e){
    e.preventDefault();
    var open_eye = document.getElementById('open-eye');
    var close_eye = document.getElementById('close-eye');
    var passwordField = document.getElementById('password');

    if(open_eye.classList.contains('hide')){
        open_eye.classList.remove('hide');
        close_eye.classList.add('hide');
        passwordField.type = 'password';
    }else{
        close_eye.classList.remove('hide');
        open_eye.classList.add('hide');
        passwordField.type = 'text';
    }
});

loginButton.addEventListener('click', function(e){
    e.preventDefault();
    var emailField = document.getElementById('email').value;
    var passwordField = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(emailField, passwordField).then(function(){
        document.location.href="mainWindow.html";
    }).catch(function(error){
        if(error != null){
            console.log(error.message);
            return;
        }
    });
});

const isProduction = require('electron-is-running-in-asar');
if(isProduction()) {

}

$(document).on('dblclick','body',(e) => {
    console.log('double clicked!');
    ipcRenderer.send('general:double-click',null);
});

$(document).ready(() => {
    $('#email').focus();
});