const express = require("express");
const router = express.Router();
const dog_controller = require("../controllers/dogController");
const breed_controller = require("../controllers/breedController");

// ANIMALS Index|Home|Splash
router.get("/", dog_controller.index);
// ABOUT
router.get("/about", dog_controller.about);

// ** DOG ROUTES ** //
// CREATE Dog - This must come before routes that display Dog (uses id)
router.get("/dog/create", dog_controller.dog_create_get);
router.post("/dog/create", dog_controller.dog_create_post);
router.post("/dog/create/post", dog_controller.dog_create_post);
// READ Dog - detail & list
router.get("/dog/:id", dog_controller.dog_detail_get);
router.get("/dogs", dog_controller.dog_list_get);
// UPDATE Dog
router.get("/dog/update/:id", dog_controller.dog_update_get);
router.post("/dog/update/:id", dog_controller.dog_update_post);
// DELETE Dog
router.get("/dog/delete/:id", dog_controller.dog_delete_get);
router.post("/dog/delete/:id", dog_controller.dog_delete_post);

// ** BREED ROUTES ** //
// CREATE Breed - This must come before routes that display Breed (uses id)
router.get("/breed/create", breed_controller.breed_create_get);
router.post("/breed/create", breed_controller.breed_create_post);
// READ Breed - detail & list
router.get("/breed/:id", breed_controller.breed_detail_get);
router.get("/breeds", breed_controller.breed_list_get);
// UPDATE Breed
router.get("/breed/update/:id", breed_controller.breed_update_get);
router.post("/breed/update/:id", breed_controller.breed_update_post);
// DELETE Breed
router.get("/breed/delete/:id", breed_controller.breed_delete_get);
router.post("/breed/delete/:id", breed_controller.breed_delete_post);

module.exports = router;
