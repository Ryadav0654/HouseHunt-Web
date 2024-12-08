const {Router} = require("express");
const { showAllListings } = require("../controller/listings");

const router = Router();

router.get("/", showAllListings);

module.exports = router;