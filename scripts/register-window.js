const electron = require('electron');
const { ipcRenderer } = electron;
const form = document.querySelector('form');
const path = require('path');
var firebase = require("firebase/app");
require("firebase/database");
require("firebase/auth");

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCZ9jutSoUMj2znaZUc_oL84dLHY3YVmPA",
    authDomain: "dentistapp-b56b9.firebaseapp.com",
    databaseURL: "https://dentistapp-b56b9.firebaseio.com",
    projectId: "dentistapp-b56b9",
    storageBucket: "dentistapp-b56b9.appspot.com",
    messagingSenderId: "1026235558917"
  };
firebase.initializeApp(config);


var registerButton = document.getElementById('registerButton');
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

registerButton.addEventListener('click', function(e){
    e.preventDefault();
    var emailField = document.getElementById('email').value;
    var passwordField = document.getElementById('password').value;
    var fullnameField = document.getElementById('fullname').value;

    firebase.auth().createUserWithEmailAndPassword(emailField, passwordField).then(userCredentials => {
        var userData = userCredentials.user;
        createNewUser(emailField, fullnameField, userData.uid);
        Swal.fire({
            title: 'Good job!',
            text: 'Do you want to login directly?',
            type: 'success',
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Yes, Login me in!',
        }).then((result) => {
            if(result.value){
                firebase.auth().signInWithEmailAndPassword(emailField, passwordField).then(function(){
                    document.location.href="mainWindow.html";
                }).catch(function(error){
                    if(error != null){
                        console.log(error.message);
                        return;
                    }
                });
            }
        });
    }).catch(function(error){
        if(error != null){
            console.log(error.message);
            return;
        }
    });
});

function createNewUser(email, fullname, uid){
    firebase.database().ref('users/' + uid ).set({
        email: email,
        fullname: fullname
    }, function(error){
        if(error != null){
            console.log(error.message);
            return;
        }else{
            console.log('saved!');
        }
    });
}

loginButton.addEventListener('click', function(){
    document.location.href="loginWindow.html";
});

$(document).on('dblclick','body',(e) => {
    console.log('double clicked!');
    ipcRenderer.send('general:double-click',null);
});