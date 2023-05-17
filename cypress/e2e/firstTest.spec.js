/// <reference types="cypress" />

describe("Test with backend", ()=>{
   
    beforeEach('login to the app', ()=>{
        cy.loginToApplication()
    })

    it('should log in', ()=>{
        cy.log('içerdeyimmm')
    })


    
    /**
     * intercept methodunu çalıstıracagımız senaryodna once yazıyoruz.
     * eger kayıt islemi yapacaksak POST keywordunu kullanıyoruz.
     * as methodu ile bir postArticles instance yaratıp response dan donen degerleri ona atıyoruz
     */
    it.only("verify correct request and response", ()=>{

        cy.intercept('POST', 'https://api.realworld.io/api/articles/').as('postArticles') 

        cy.contains("New Article").click()
        cy.get('[formcontrolname="title"]').type('this is the title11')
        cy.get('[formcontrolname="description"]').type('this is a description1')
        cy.get('[formcontrolname="body"]').type('this is body of the article1')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles').then(xhr =>{
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('this is body of the article1')
            expect(xhr.response.body.article.description).to.equal('this is a description1')
        })
    })


})