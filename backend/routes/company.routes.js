const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { verifyToken, isAdmin, isAdminOrCompany } = require('../middleware/auth.middleware');

router.use(verifyToken);

router.get('/', companyController.getAllCompanies);
router.get('/:id', companyController.getCompanyById);
router.put('/:id', isAdminOrCompany, companyController.updateCompany);
router.delete('/:id', isAdmin, companyController.deleteCompany);

module.exports = router;
