var express = require('express');
var router = express.Router();

const login           = require('./login');
const register        = require('./register');
const stationsListing = require('./stationsListing');
const tripHistory     = require('./tripHistory');
const flowReport      = require('./flowReport');
const manageCards     = require('./manageCards');
const suspendedCards  = require('./suspendedCards');
const stationDetail   = require('./stationDetail');
const passenger       = require('./passengerBC');

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.render('index', { title: 'MARTA Passenger Traffic' });
    res.sendFile(path.join(__dirname + '/index.html'));
});

/* User login */
router.post('/login', login.login);

/* Passenger register */
router.post('/register', register.register);

router.get('/stationsListing', stationsListing.stationsListing);
router.get('/tripHistory', tripHistory.tripHistory);
router.get('/flowReport', flowReport.flowReport);
router.get('/getBreezecards', manageCards.getBreezecards);
router.post('/removeBreezecard', manageCards.removeBreezecard);
router.post('/addBreezecard', manageCards.addBreezecard);
router.post('/addValueBreezecard', manageCards.addValueBreezecard);
router.get('/getSuspendedCards', suspendedCards.getSuspendedCards);
router.post('/assignToNewOwner', suspendedCards.assignToNewOwner);
router.post('/assignToOldOwner', suspendedCards.assignToOldOwner);

router.post('/getStation/:id', stationDetail.getStationById);
router.post('/getStation/:id/updateFare', stationDetail.updateFare);
router.post('/getStation/:id/updateStatus', stationDetail.updateStatus);
router.post('/createStation', stationDetail.createStation);

router.post('/getBreezeCardNums', passenger.getBreezeCardNums);
router.post('/getStation', passenger.getStation);
router.post('/startTrip', passenger.startTrip);
router.post('/endTrip', passenger.endTrip);
router.post('/checkForNull', passenger.checkForNull);
router.post('/subtractBalance', passenger.subtractBalance);
router.post('/getNewStations', passenger.getNewStations);


module.exports = router;
