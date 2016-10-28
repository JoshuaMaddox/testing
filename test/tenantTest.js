process.env.NODE_ENV = 'test'
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../testApp')
const Tenant = require('../models/Tenant')
const { expect, request } = chai

chai.use(chaiHttp)

describe('API routes for Tenants: ', () => {

  let tenantId;


    beforeEach(() => {
      return Tenant.create({name: {first: 'Joshua', last: 'Maddox'}, expectedRentPrice: 3650})
    })

  describe('GET /', () => {
    it('should respond with 200', () => {
      return chai.request(app)
        .get('/api/tenants')
        .then(res => {
          expect(res).to.have.status(200)
          expect(res.body[0].name.first).to.equal('Joshua')
        })
    })
  })

  describe('POST /', () => {
    it('Should create a new tenant', () => {
      let newTenant = {name: {first: 'Bob', last: 'BoBobBob'}, expectedRentPrice: 1010}
      return chai.request(app)
        .post('/api/tenants')
        .send(newTenant)
        .then(res => {
          tenantId = res.body._id
          expect(res).to.have.status(200)
          expect(res.body.name.first).to.equal('Bob')
        })
    })
  })

  describe('PUT /', () => {
    it('Should edit a tenant', () => {
      let editedTenant = {name: {first: 'Bob EDITED', last: 'BoBobBob'}, expectedRentPrice: 10101111111111}
      return chai.request(app)
        .put(`/api/tenants/edit/${tenantId}`)
        .send(editedTenant)
        .then(res => {
          expect(res).to.have.status(200)
          expect(res.body.name.first).to.equal('Bob EDITED')
        })
    })
  })

  describe('DELETE /', () => {
    it('Should delete a tenant', () => {
      return chai.request(app)
        .delete(`/api/tenants/${tenantId}`)
        .then(res => {
          let deletedTrue = 1
          expect(res).to.have.status(200)
          expect(res.body.filter((tenant) => {
            if(tenant._id == tenantId){
              return tenant
            }
            return
          }).length).to.equal(0)
        })
    })
  })

  after(() => {
    return Tenant.remove({})
  })
  
})