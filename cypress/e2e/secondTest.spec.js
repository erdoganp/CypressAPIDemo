/// <reference types="cypress" />


describe('Test log out', () =>{
   // cy.loginToApplication()
   beforeEach('login to the app', ()=>{
       
     cy.loginToApplication()
 })


 it.only('verfiy use can log out succedfully', () =>{
    
    cy.contains('Settings').click({force:true})
    cy.contains('Or click here to logout').click()
    cy.get('.navbar-nav').should('contain', 'Sign up')
})

})



