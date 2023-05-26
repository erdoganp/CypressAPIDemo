const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportHeight : 1080,
  viewportwidth : 1920,
  "video" : true,
  /**eger test ortamında veya farklı ortamlarda testler calıstırılmak istenirse burada belirtilen api urller ver credentiallar ile 
   * bu test ortamlarında senaryolar calstırılabilir
   */
  env :{
    username : "pacacierdogan1@gmail.com", //cypresss.env.son dosyasına yazdıgımız degerler buradaki degerleri override eder
    password : "123",
    apiUrl :    "https://api.realworld.io"
   /**  
    username : "pacacierdogan1@gmail.com",
    password : "123",
    apiUrl :    "campus.test-hub.ku.edu.tr",
    username : "pacacierdogan1@gmail.com",
    password : "123",
    apiUrl :    "campus.uat-hub.ku.edu.tr"
 */
  },
  e2e: {

    setupNodesEvents(on,config){
      const username =process.env.DB_USERNAME
      const password=process.env.PASSWORD

      if(!password){
        throw new Error('missing PASSWORD enviroment variable')
      }

      config.env={username,password}
      return config
    },
    baseUrl: 'http://localhost:4200',
    //baseUrl: 'https://campus.test-hub.ku.edu.tr/',
    specPattern: 	"cypress/e2e/**/*.{js,jsx,ts,tsx}",
    excludeSpecPattern : ["**/1-getting-started/*","**/2-advanced-examples/*"]
  },
})