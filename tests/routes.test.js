const chai = require('chai');
const expect = chai.expect;
const should = chai.should;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../app.js');
const mongoose = require('mongoose');
const config = require('./../config.json')
const Book = require('../models/book.model');
const Users = require('../models/user.model');
const Institution = require('../models/institution.model');
const testdomain = "utdallas.edu";
let mockInstitution = {
	name: 'test',
	url: 'test',
	email_domain: testdomain
}
mockInstitution = new Institution(mockInstitution)
const testdomain_2 = "cali.edu";
let token;

let mockUser = {
	name: 'John Doe',
	email: 'johndoe@utdallas.edu',
	role: 'administrator',
	password: '_password'
}
let mockBook_1 = {
	title: 'test1',
	author: 'test1',
	isbn: 'test1-123',
	institution : testdomain
}
let mockBook_2 = {
	title: 'test2',
	author: 'test2',
	isbn: 'test2-123',
	institution : testdomain_2
}
mockBook_2 = new Book(mockBook_2)

describe('Users', () => {
	before((done)=>{
		mongoose.connect(config.connectionString)
		const db = mongoose.connection
		db.on('error', console.error.bind(console, 'connection error'))
		db.once('open', ()=>{
			console.log("We are connected to the test DB")
			done();
		})
	})
	

describe('Test database', () => {
	it ("saves", (done)=>{
		mockBook_2.save()
		mockInstitution.save(done)
	})
	it("saves the institution correctly", (done) => {
			Institution.find({ email_domain: testdomain}, (err, res)=>{
				if (err) {
					throw err;
				}
				if (res.length === 0) {
					throw new Error('No data!')
				}
				done()
		})
	})
})


	
describe('create users route', () => {
	let createdUser;
	it('creates users without failing', (done) => {
    	chai.request(app)
	  		.post('/users/create')
	   		.send(mockUser)
		 	.then((response) => {
            	return Users.find({
              		email: 'johndoe@utdallas.edu'
            		});
		 	}) .then(result => {           
					setTimeout(()=>{
						createdUser = result[0]
						expect(result).to.have.lengthOf(1);
						done();
					})
          		}).catch(error => {
			 		 console.log(error);
			  		done();
		  			})
	  });
	  
	  it('stores the right user name', ()=>{			
			return expect(createdUser.name).to.be.equal('John Doe');
	  })
	  it('stores the right user role', ()=>{			
			return expect(createdUser.role).to.be.equal('administrator');
  	  })


  it('fails when user domain does not exist', (done) => {
	let newUser = {...mockUser}
	newUser.email = "johndoe@random.edu"
    chai.request(app)
	  .post('/users/create')
	   .send(newUser)
		 .then((response) => {
			 setTimeout(()=>{
				expect(response).to.have.status(400)
				done()
			 })
		 }).catch(error => {
			  console.log(error);
			  done();
		  })
  });

  it('fails when role is not student, administrator or academic', (done) => {
	let newUser = {...mockUser}
	newUser.role = "randomrole"
	chai.request(app)
		.post('/users/create')
		.send(newUser)
		.then((response) => {
			console.log(response.text)
			setTimeout(()=>{
				expect(response).to.have.status(400)
				done()
			})

		}).catch(error => {
				console.log(error);
				done();
			})
});
})


describe('users login route', () => {
	it('user login without failing', (done) => {
	  chai.request(app)
		.post('/users/signin')
		 .send(mockUser)
		   .then((response) => {
			   token = response.body.token;
			   setTimeout(()=>{
					expect(token.length).to.be.greaterThan(10)
					done();
			   })
		   }).catch(error => {
				console.log(error);
				done();
			})
	});
  })

describe('protected book route', () => {
	it('can add books in users institution', (done) => {
	  chai.request(app)
		.post('/books')
		.set('Authorization', 'Bearer '+token)
		 .send(mockBook_1)
		   .then((response) => {
			console.log(response.text)
			setTimeout(()=>{
				expect(response).to.have.status(200)
				done()
			})
		   }) .catch(error => {
				console.log(error);
				done();
			})
	});
  })
  
  describe('protected book route', () => {
	it('can get books in user institution', (done) => {
	  chai.request(app)
		.get('/books')
		.set('Authorization', 'Bearer '+token)
		   .then((response) => {
			console.log("the response is ", response.text)
			setTimeout(()=>{
				expect(response).to.have.status(200)
			})
			return Book.find({
				institution: testdomain
			  }) })
			  .then((res) => {
			//should not see testdomain 2 books
			setTimeout(()=>{
				expect(res).to.have.lengthOf(1);
				done()
			})
		   }) .catch(error => {
				console.log(error);
				done();
			})
	});

	it('403 forbidden if invalid token is entered', (done) => {
		let newToken = token + "random"
		chai.request(app)
		  .get('/books')
		  .set('Authorization', 'Bearer '+newToken)
			 .then((response) => {
			  console.log(response.text)
			  setTimeout(()=>{
				expect(response).to.have.status(403)
				done()
			  })
			 }) .catch(error => {
				  console.log(error);
				  done();
			  })
	  });
  })

after((done) => {
	mongoose.connect(config.connectionString, ()=>{
		mongoose.connection.db.dropDatabase(done)
	});
  });

})