/// <reference types="cypress" />


describe('Test log out', () =>{
   // cy.loginToApplication()
   beforeEach('login to the app', ()=>{
       
     cy.loginToApplication()
 })

//retries parametresi ile open mode da istediğimiz kadar fail oldugunda retry etmesini saglıyoruz retry etmesini saglıyoruz
//cypress.config dosyası global ama burası teste e özel bir durum
 it.only('verfiy use can log out succedfully', {retries: 2},() =>{
    
    cy.contains('Settings').click({force:true})
    cy.contains('Or click here to logout').click()
    cy.get('.navbar-nav').should('contain', 'Sign up')
})

})



