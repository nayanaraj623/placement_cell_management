const express = require('express');
const router = express.Router();
const placementController = require('../controllers/placement.controller');
const { verifyToken, isAdmin, isStudent, isAdminOrCompany } = require('../middleware/auth.middleware');

router.use(verifyToken);

router.post('/apply', isStudent, placementController.applyForJob);
router.get('/job/:jobId', isAdminOrCompany, placementController.getApplicantsForJob);
router.get('/student/:studentId', isStudent, placementController.getStudentApplications); // We can make it accessible to admin too if we modify the controller check slightly
router.put('/:id', isAdminOrCompany, placementController.updatePlacementStatus);
router.get('/', isAdmin, placementController.getAllPlacements);

module.exports = router;
