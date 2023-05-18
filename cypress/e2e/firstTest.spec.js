/// <reference types="cypress" />

const exp = require("constants")

describe("Test with backend", ()=>{
   
    beforeEach('login to the app', ()=>{
       
       /**
        * mack dosyasındaki tags degerlerini kullanmasını sagladık
        */
        cy.intercept('GET', 'https://api.realworld.io/api/tags', {fixture : 'tags.json'}) //sayfa ilk acıldıgında kontrol edeceğimiz için once yazıyoruz
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
    it("verify correct request and response", ()=>{

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


    /**mock dosyasonda kullandıgımız degerlerin kontrolunu sagladık */
    it.only('verify popular tags are displayed', ()=>{

        //cy.log('we log in')

        cy.get('.tag-list')
        .should('contain', 'cypress')
        .and('contain', 'automation')
        .and('contain', 'testing')

    })


    it.only('verify global feed likes count', ()=>{

        cy.intercept('GET', 'https://api.realworld.io/api/articles/feed*', {"articles":[],"articlesCount":0})
        cy.intercept('GET', 'https://api.realworld.io/api/articles**', {fixture: "articles.json"})


        cy.contains('Global Feed').click()
        cy.get('app-article-list button').then(heartlist =>{

            expect(heartlist[0]).to.contain('1')
            expect(heartlist[1]).to.contain('5')
        })

        cy.fixture('articles').then(file =>{
            const articleLink=file.articles[1].slug
            file.articles[1].favoritesCount =6
            cy.intercept('POST', 'https://api.realworld.io/api/articles/'+articleLink+'/favorite',file)


        })

        cy.get('app-article-list button').eq(1).click().should('contain','6')
    })


})