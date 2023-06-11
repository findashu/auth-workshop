# All about Authentication

Authentication(Authn) verifies the identity of a users or service. We will go through Authentication on Web.

## Concepts (Types of Auth Available Today for Web)

* Credentials
* Sigle Sign On (SSO)
* 2FA (Two-Factor Authentication)
* MFA (Multi-Factor Authentication)
* OAuth 2.0
* JWT (JSON Web Token)
* OTP (One TIme Password)
* Public Key Cyptography

## Implementting Auth

### Custom Auth

It's the way its been all always.

* User/Pass
* WebAuthn

### Identity Providers

* OpenID
* SAML 2.0
* Sign in with .. (Google, Github, Facebook etc...)

### Identity As a Service (IDaaS)



## Security Risks

* Man in the Middle Attacks
* Keyloggers
* Easy to guess passwords
* Web Servers and DBs Attacks
* Phishing and Social Engineering Attacks

With these many risks, we kept adding layers and layers of security to the system (eg. 2FA, MFA ..). But with these layers user experience becomes a problem and risk is still there are secrets / MF can be vulnerable.

We as developers should try to find the balance between Security and User experience and make system usable and secured. We can help Password Managers to identify correct feilds in the HTML Form.

### Enhancing Login Forms

* Connected Labels for each element. (using for attribute)
* Don't use placeholders as labels
* Using HTML symantics
* On SPAs, form names different for registration and login forms.
* Let the user make the password visible (especially on Mobiles)
* Help Password Managers with autocomplete HTML attributes
* Help Accessibility with area-described by attribute or instructions.
* One SPAs, use submit form event and submission will be triggered by a pushstate.

```HTML

<!-- Should be in Signup/Registration, it helps password manager to differentiate if its new password you need or any stored pass. In this it'll be able to suggest strong password -->
<input type="password" autocomplete="new-password">

<!-- Should be on login page -->
<input type="password" autocomplete="current-password">

<!--  -->
<input type="text" autocomplete="name">

<!-- if email going to be username for signin -->
<input type="email" autocomplete="username">


```
