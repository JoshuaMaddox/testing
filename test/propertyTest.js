process.env.NODE_ENV = 'test'
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../testApp')
const Property = require('../models/Property')
const Tenant = require('../models/Tenant')
const { expect, request } = chai

chai.use(chaiHttp)


describe('API routes', () => {
  
  let propId;
  let tenantId;

  describe('GET /', () => {

    before(() => {
      return Property.create({name: 'Blue Hills', rentPrice: 3650})
    })

    before(() => {
      return Tenant.create({name: {first: 'Joshua', last: 'Maddox'}, expectedRentPrice: 3650})
    })

    it('should respond with 200', () => {
      return chai.request(app)
        .get('/api/properties')
        .then(res => {
          propId = res.body[0]._id
          expect(res).to.have.status(200)
        })
    })

    it('should respond with 200', () => {
      return chai.request(app)
        .get('/api/tenants')
        .then(res => {
          tenantId = res.body[0]._id
          expect(res).to.have.status(200)
        })
    })

    it('it should post a new property', () => {
      let property = {
        name: 'Black Hills',
        rentPrice: 2500
      }
      return chai.request(app)
        .post('/api/properties')
        .send(property)
        .then(res => {
          expect(res).to.have.status(200)
        })
    })

    it('Should edit a property', () => {
      let property = {
        name: 'Black Hills EDITED',
        rentPrice: 1000500
      }
      return chai.request(app)
        .put('/api/properties/edit/' + propId)
        .send(property)
        .then(res => {
          expect(res).to.have.status(200)
          expect(res.body.name).to.equals('Black Hills EDITED')
        })
    })

    it('Should add a tenant to a property', () => {
      return chai.request(app)
        .put(`/api/properties/${propId}/addTenant/${tenantId}`)
        .send()
        .then(res => {
          expect(res).to.have.status(200)
          expect(res.body.tenants[0]).to.equal(tenantId)
        })
    })

    it('Should check rent revenue and number of tenants', () => {
      return chai.request(app)
        .get('/api/properties/financials')
          .then(res => {
            expect(res).to.have.status(200)
            expect(res.body.rentedRevenue).to.equal(1000500)
            expect(res.body.tenants).to.equal(1)
          })  
    })

    after(() => {
      return Property.remove({})
    })

    after(() => {
      return Tenant.remove({})
    })

  })

})