'use strict';
const mongoose = require('mongoose');
const Institution = mongoose.model('Institution');

module.exports = {
    getInstitution: function(emailDomain) {
		return Institution.findOne({ email_domain: emailDomain }).exec()
    },
    getInstitutions: function(req, res, next) {
        Institution.find().exec()
            .then(results => {
                res.status(200).json({
                    count: results.length,
                    schools: results
                });
                next();
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: err });
                next();
            })
    },
    addInstitution: function(req, res, next) {
        new Institution({
            name: req.body.name,
            url: req.body.url,
            email_domain: req.body.email_domain,
        }).save()
            .then(result => {
                res.status(200).json({ message: 'New institution has been added', book: result });
                next();
            })
            .catch(err => {
                res.status(500).json({ error: err });
                next();
            });
    },
    changeInstitution: function(req, res, next) {
        Institution.findOneAndUpdate({ _id: req.params.institutionId }, req.body )
            .then(result => {
                res.status(200).json({ message: 'Institution has been updated', school: result })
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: err });
            })
    },
    removeInstitution: function(req, res, next) {
        Institution.findByIdAndRemove({_id: req.params.institutionId }).exec()
            .then(result => {
                res.status(200).json({ message: 'Institution has been deleted' })
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: err });
            })
    },
    getOneInstitution: function(req, res, next) {
        Institution.findById({ _id: req.params.institutionId }).exec()
            .then(institution => {
                if (institution) return res.status(200).json({ message: 'Here are the institution details', school: institution });
                res.status(409).json({ message: 'Institution not available' });
                next();
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: err });
            })
    }
}