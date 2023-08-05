import API from "./API.js";
import Router from "./Router.js";

const Auth = {
    isLoggedIn: false,
    account: null,
    postLogin : (response,user) =>{
        if(response.ok){
            Auth.isLoggedIn=true,
            Auth.account = user
            Auth.updateStatus();
            Router.go('/account')

        }else{
            alert(response.message);
        }
        // Credential Management API Storage
        if(window.PasswordCredentials && user.password){
            const credentials = new PasswordCredentials({
                id: user.email,
                password: user.password,
                name: 'ashu'
            })
            try {
            navigator.credentials.store(credentials)
            }catch(e){
                console.log(e)
            }
        }
    },
    register : async (event) => {
        event.preventDefault();
        const user = {
            name: document.getElementById('register_name').value,
            email: document.getElementById('register_email').value,
            password: document.getElementById('register_password').value
        }
        const response = await API.register(user)
        Auth.postLogin(response,user);
    },
    checkAuthOptions: async () =>{
        const response = await API.checkAuthOptions({
            email: document.getElementById("login_email").value
        });
        Auth.loginStep = 2;
        console.log(response)
        if(response.password){
            document.getElementById("login_section_password").hidden = false;
        }
        if(response.webauthn){
            document.getElementById("login_section_webauthn").hidden = false;
        }
    },
    login: async (event) => {
        if(event) event.preventDefault();
        if(Auth.loginStep ==1 ){
            Auth.checkAuthOptions();
        }else {
            // Step 2
            const credentials = {
                email: document.getElementById('login_email').value,
                password: document.getElementById('login_password').value
            }
            const response = await API.login(credentials)
            Auth.postLogin(response,{
                ...credentials,
                name:response.name
            })
        }
        
    },
    addWebAuthn: async () => {
        const options = await API.webAuthn.registrationOptions();
        options.authenticatorSelection.residentKey = 'required';
        options.authenticatorSelection.requireResidentKey = true;
        options.extentions = {
            credProps: true
        }
        const authRes = await SimpleWebAuthnBrowser.startRegistration(options);
        const verificationRes = await API.webAuthn.registrationVerification(authRes);
        if(verificationRes.ok){
            alert('You can now login with WebAuthn')
        }else {
            alert(verificationRes.message)
        }
    },
    webAuthnLogin: async() => {
        const email = document.getElementById('login_email').value;
        const options = await API.webAuthn.loginOptions(email);
        const loginRes = await SimpleWebAuthnBrowser.startAuthentication(options);
        const verificationRes = await API.webAuthn.loginVerification(email,loginRes);
        if(verificationRes.Ok) {
            Auth.postLogin(verificationRes,verificationRes.user)
        }else {
            alert(verficationRes.message);
        }
    },
    autoLogin: async () => {
        if(window.PasswordCredentials){
            const credentials = await navigator.credentials.get({password:true});
            document.getElementById('login_email').value = credentials.id;
            document.getElementById('login_password').value = credentials.password;
            // Optional for force login
            Auth.login();

            console.log(credentials)
        }
    },
    logout:() =>{
        Auth.isLoggedIn=false;
        Auth.account = null;
        Auth.updateStatus();
        Router.go('/')
        if(window.PasswordCredentials){
            // Once logged out, it'll prevent auto login
            navigator.credentials.preventSilentAccess();
        }
    },
    updateStatus() {
        if (Auth.isLoggedIn && Auth.account) {
            document.querySelectorAll(".logged_out").forEach(
                e => e.style.display = "none"
            );
            document.querySelectorAll(".logged_in").forEach(
                e => e.style.display = "block"
            );
            document.querySelectorAll(".account_name").forEach(
                e => e.innerHTML = Auth.account.name
            );
            document.querySelectorAll(".account_username").forEach(
                e => e.innerHTML = Auth.account.email
            );

        } else {
            document.querySelectorAll(".logged_out").forEach(
                e => e.style.display = "block"
            );
            document.querySelectorAll(".logged_in").forEach(
                e => e.style.display = "none"
            );

        }
    },    
    loginStep:1,
    init: () => {
        document.getElementById('login_section_password').hidden = true;
        document.getElementById('login_section_webauthn').hidden = true;
    },
}
Auth.updateStatus();
Auth.autoLogin();

export default Auth;

// make it a global object
window.Auth = Auth;
