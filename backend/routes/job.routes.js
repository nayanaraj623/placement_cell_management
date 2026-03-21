const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { verifyToken, isAdminOrCompany } = require('../middleware/auth.middleware');

router.use(verifyToken);

router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.post('/', isAdminOrCompany, jobController.createJob);
router.put('/:id', isAdminOrCompany, jobController.updateJob);
router.delete('/:id', isAdminOrCompany, jobController.deleteJob);

module.exports = router;
