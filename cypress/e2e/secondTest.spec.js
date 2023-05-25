/// <reference types="cypress" />


describe('Test log out', () =>{
    cy.loginToApplication()
})


it('verfiy use can log out succedfully', () =>{

    cy.contains('Setting').click()
    cy.contains('Or click here to logout').click()
    cy.get('.navbar-nav').should('contain', 'Sign up')
})