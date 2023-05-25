/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }


/**
 * 
 * jvt token kullanıcagız authless  authorization için aldıgıgımız token i storage edecegiz ve browser acıldıgında herseferinde onu kullanacagız 
 * tekrar tekrar post reqest atmaya ve login olmaya gerek kalmayacak
 */






Cypress.Commands.add('loginToApplication', ()=>{
   /* cy.visit('/login')
    cy.get('[placeholder="Email"]').type("pacacierdogan1@gmail.com")
    cy.get('[placeholder="Password"]').type("123")
    cy.get('form').submit()
*/

        const userCredential = {
             "user": {
                "email": Cypress.env("username"),
                "password" : Cypress.env("password")
            }
        }

cy.request('POST', Cypress.env('apiUrl') + '/api/users/login', userCredential)
.its('body').then(body => {
    const token =body.user.token
    cy.wrap(token).as('token')
    cy.visit('/', {
        onBeforeLoad (win){
            win.localStorage.setItem('jwtToken', token)
        }
    })

})

})

