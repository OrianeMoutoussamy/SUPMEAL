import swaggerJSDoc from 'swagger-jsdoc';
export const swaggerDocument = swaggerJSDoc({definition:{openapi:'3.0.3',info:{title:'SUPMEAL API',version:'1.0.0',description:'API REST de gestion de recettes, cookbooks, planning et messagerie.'},servers:[{url:'http://localhost:4000/api'}],components:{securitySchemes:{bearerAuth:{type:'http',scheme:'bearer',bearerFormat:'JWT'}}}},apis:[]});
