const express = require('express')
const router = express.Router()

const Property = require('../models/Property')

router.route('/')
  .get((req, res) => {
    Property.find()
      .populate('tenants')
      .then(properties => { res.send(properties) })
      .catch(err => { res.status(400).send(err) })
  })
  .post((req, res) => {
    Property.create(req.body)
      .then(property => { res.send(property) })
      .catch(err => { res.status(400).send(err) })
  })

router.route('/edit/:id')
  .put((req, res) => {
    Property.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
    .populate('tenants')
    .then(property => {
      res.send(property)
    })
    .catch(err => {
      res.status(400).send(err)
    })
  })

router.route('/financials')
  .get((req, res) => {
    Property.calcFinancials()
      .then(financials => {
        res.send(financials)
      })
      .catch(err => {
        res.status(400).send(err)
      })
  })

router.route('/:id')
  .get((req, res) => {
    Property.findById(req.params.id)
      .populate('tenants')
      .then(property => res.send(property))
      .catch(err => res.status(400).send(err))
  })
  .delete((req, res) => {
    Property.findByIdAndRemove(req.params.id)
      .then(property => property.save())
      .then(
        Property.find()
        .then(properties => res.send(properties))
      )
      .catch(err => res.status(400).send(err))
  })

router.put('/:propertyId/removeTenant/:tenantId', (req, res) => {
  let { propertyId, tenantId } = req.params
  Property.findById(propertyId)
    .then(property => {
      property.tenants.forEach((tenant, i) => {
        if(tenant == tenantId) {
          property.tenants.splice(i, 1)
        } 
      })
      return property.save()
    })
    .then(savedProperty => savedProperty.save())
    .then(
      Property.find()
        .populate('tenants')
        .then(properties => res.send(properties))
    )
    .catch(err => {
      res.status(400).send(err)
    })
})

router.put('/:propertyId/addTenant/:tenantId', (req, res) => {
  let { propertyId, tenantId } = req.params;
  Property.findById(propertyId)
    .then( property => {
      property.tenants.push(tenantId)
      return property.save()
    })
    .then(savedProperty => {
      res.send(savedProperty)
    })
    .catch(err => res.status(400).send(err))
})

module.exports = router

// router.route('/:id')
//   .get((req, res) => {
//     Group.findById(req.params.id)
//       .then(group => res.send(group))
//       .catch(err => res.status(400).send(err))
//   })