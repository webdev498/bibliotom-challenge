const router = require('express').Router();

const controller = require('../controllers/institution.controller');

module.exports = router;

router.get('/', controller.getInstitutions);
router.post('/', controller.addInstitution);
router.put('/:institutionId', controller.changeInstitution);
router.delete('/:institutionId', controller.removeInstitution);
router.get('/:institutionId', controller.getOneInstitution);
