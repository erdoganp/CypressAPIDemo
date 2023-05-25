/// <reference types="cypress" />

const exp = require("constants")

describe("Test with backend", ()=>{
   
    beforeEach('login to the app', ()=>{
       
       /**
        * mock dosyasındaki tags degerlerini kullanmasını sagladık
        */
      //  cy.intercept('GET', 'https://api.realworld.io/api/tags', {fixture : 'tags.json'}) //sayfa ilk acıldıgında kontrol edeceğimiz için once yazıyoruz
        cy.intercept({method: 'Get', path: 'tags'}, {fixture : 'tags.json'})
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

        cy.wait('@postArticles')
        cy.get('@postArticles').then(xhr =>{
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('this is body of the article1')
            expect(xhr.response.body.article.description).to.equal('this is a description1')
        })
    })

    it("intercepting and modifiying the request and response", ()=>{

    ///    cy.intercept('POST', 'https://api.realworld.io/api/articles/)',(req) =>{
       //     req.body.article.description="this is a description2"
       // } ).as('postArticles') 


        cy.intercept('POST', '**/articles',(req) =>{
            req.reply(res =>{
                expect(res.body.article.description).to.equal('This is a description1')
                res.body.article.description="his is a description2"
            })
        } ).as('postArticles') 

        cy.contains("New Article").click()
        cy.get('[formcontrolname="title"]').type('this is the title17')
        cy.get('[formcontrolname="description"]').type('this is a description1')
        cy.get('[formcontrolname="body"]').type('this is body of the article1')
        cy.contains('Publish Article').click({force:true})

        cy.wait('@postArticles').then(xhr =>{
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('this is body of the article1')
            expect(xhr.response.body.article.description).to.equal('this is a description1')
        })
    })


    /**mock dosyasonda kullandıgımız degerlerin kontrolunu sagladık */
    it('verify popular tags are displayed', ()=>{

        //cy.log('we log in')

        cy.get('.tag-list')
        .should('contain', 'cypress')
        .and('contain', 'automation')
        .and('contain', 'testing')

    })

/** bu teste de web sayfasına login oldugumuzda ilk açılan sayfa my article sayfası
 * biz bu sayfa acıldıktan sonra intercept ile sayfayı tutuyoruz
 * burda global feed sayfasına yonlenip begeni sayılarını assert ediyoruz.
 * kendi ürettiğimiz articles dosyasındaki ikinci articlein begeni sayısını 6 a esitleyip bunuda  post ile uyguluyoruz.
 * en son olarak da bunu assert ediyoruz
 */
    it('verify global feed likes count', ()=>{

        cy.intercept('GET', 'https://api.realworld.io/api/articles/feed*', {"articles":[],"articlesCount":0}) //my articles sayfası bu kısım
        cy.intercept('GET', 'https://api.realworld.io/api/articles**', {fixture: "articles.json"}) // global articles


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

/***************************************************************** */

/*************************************************** 
 * Senaryo olarak once bir tane article create ettik 
 * daha sonra bu article i delete ettik
 * Global feed sayfasına gidip delete edildiğini assert ettik bu sekilde testi tamamladık
****************************************************/
    it.only('delete a new article in a globla feed', ()=>{

        /*artık burda credential kullanmamıza gerek kalmadı cunku alias token i kullanıyoruz commands.js de
        const userCredential = {
            "user": {
                "email": "pacacierdogan1@gmail.com",
                "password": "123"
            }
        }
      */
        const bodyRequest = {
            "article": {
                "title": "Request from API19",
                "description": "API test is very easy",
                "body": "Article body",
                "tagList": [
                    "sgas",
                    "sgasgf",
                    "sdgd"
                ]
            }
        }


        
        //cy.request('POST', 'https://api.realworld.io/api/users/login', userCredential)
        //.its('body').then(body => {
         // const token =body.user.token



           //commands.js de belirttiğimiz alias tokenı kullandık
        cy.get('@token').then(token => {
             

            cy.request({
                url : Cypress.env('apiUrl')+'/api/articles/', //hangi env ile calısmak istersek bu sekilde belirtiyoruz.
                headers: {'Authorization' : 'Token ' +token},
                method : 'POST',
                body : bodyRequest
            }).then(response =>{
                expect(response.status).to.equal(200)
            })


            cy.contains('Global Feed').click({force : true})
            cy.get('.preview-link').first().click({force : true})
            cy.get('.article-actions').contains(' Delete Article ').click({force : true})

            cy.request({
                url: Cypress.env('apiUrl')+'/api/articles?limit=10&offset=0',
                headers: {'Authorization' : 'Token ' +token},
                method : 'GET'

            }).its('body').then(body =>{
                expect(body.articles[0].title).not.to.equal('Request from API19')
            })

        })
    })

//************************************************* */
})