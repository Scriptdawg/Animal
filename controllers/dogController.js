const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Dog = require("../models/dog.js");
const Breed = require("../models/breed.js");
const browser = {
  title: "Sdg",
  subTitle: "Animal",
  description: "Welcome",
};

// ANIMALS Index|Home|Splash
exports.index = asyncHandler(async (req, res) => {
  browser.description = "Welcome";
  res.render("animal", {
    browser,
    pageTitle: "Animals",
  });
});
// ABOUT
exports.about = asyncHandler(async (req, res) => {
  browser.description = "About this application";
  res.render("about", {
    browser,
    pageTitle: "About",
  });
});

// CREATE Dog - GET create form
exports.dog_create_get = asyncHandler(async (req, res) => {
  const allBreeds = (await Breed.find()).sort(function (a, b) {
    let textA = a.name.toUpperCase();
    let textB = b.name.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  browser.description = "Creating a dog";
  res.render("dogs/dog_create", {
    browser,
    pageTitle: "Create Dog",
    breeds: allBreeds,
    dog: {},
    errors: "",
  });
});
// CREATE Dog - POST create form
exports.dog_create_post = [
  // Validate and sanitize the body fields.
  body("name", "Name must contain at least 3 characters and less then 50.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("breed", "Please pick a breed.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("favoriteFood", "Favorite Food must contain less then 50 characters.")
    .trim()
    .isLength({ max: 50 })
    .escape(),
  body("description", "Description must contain at least 3 characters.").trim(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a dog object with escaped and trimmed data.
    const dog = new Dog({
      name: req.body.name,
      breed: req.body.breed,
      favoriteFood: req.body.favoriteFood,
      description: req.body.description,
    });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      const allBreeds = (await Breed.find()).sort(function (a, b) {
        let textA = a.name.toUpperCase();
        let textB = b.name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      browser.description = "Error creating a dog";
      res.render("dogs/dog_create", {
        browser,
        pageTitle: "Create Dog",
        breeds: allBreeds,
        dog,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Check if dog with same name already exists.
      const dogExists = await Dog.findOne({ name: req.body.name }).exec();
      if (dogExists) {
        // Dog exists. Render the form again with sanitized values/error messages..
        const allBreeds = (await Breed.find()).sort(function (a, b) {
          let textA = a.name.toUpperCase();
          let textB = b.name.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
        browser.description = "Error creating a dog";
        res.render("dogs/dog_create", {
          browser,
          pageTitle: "Create Dog",
          breeds: allBreeds,
          dog,
          errors: [{ msg: "Name already exists!" }],
        });
      } else {
        await dog.save();
        // New dog saved. Redirect to dog detail page.
        res.redirect("/animal/dog/" + dog.url);
      }
    }
  }),
];

// READ Dog - detail
exports.dog_detail_get = asyncHandler(async (req, res) => {
  const dog = await Dog.findById(req.params.id).populate("breed");
  browser.description = dog.name;
  res.render("dogs/dog_detail", {
    browser,
    pageTitle: dog.name,
    dog,
  });
});
// READ Dog - list
exports.dog_list_get = asyncHandler(async (req, res) => {
  const dogs = (await Dog.find()).sort(function (a, b) {
    let textA = a.name.toUpperCase();
    let textB = b.name.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  browser.description = "List of dogs available";
  res.render("dogs/dog_list", {
    browser,
    pageTitle: "Dogs",
    dogs,
  });
});

// UPDATE Dog - GET update form
exports.dog_update_get = asyncHandler(async (req, res) => {
  const dog = await Dog.findById(req.params.id).populate("breed");
  const allBreeds = (await Breed.find()).sort(function (a, b) {
    let textA = a.name.toUpperCase();
    let textB = b.name.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  browser.description = "Updating a dog";
  res.render("dogs/dog_create", {
    browser,
    pageTitle: "Update Dog",
    breeds: allBreeds,
    dog,
    errors: "",
  });
});
// UPDATE Dog - POST update form
exports.dog_update_post = [
  // Validate and sanitize the name field.
  body("name", "Name must contain at least 3 characters and less then 50.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("breed", "Please pick a breed.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("favoriteFood", "Favorite Food must contain less then 50 characters.")
    .trim()
    .isLength({ max: 50 })
    .escape(),
  body("description", "Description must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 }),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a dog object with escaped and trimmed data.
    const dog = new Dog({
      name: req.body.name,
      breed: req.body.breed,
      favoriteFood: req.body.favoriteFood,
      description: req.body.description,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      const allBreeds = await Breed.find();
      browser.description = "Error updating a dog";
      res.render("dogs/dog_create", {
        browser,
        pageTitle: "Update Dog",
        breeds: allBreeds,
        dog,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      await Dog.findByIdAndUpdate(req.params.id, dog, {});
      // New dog updated. Redirect to dog detail page.
      res.redirect("/animal/dog/" + dog.url);
    }
  }),
];

// DELETE Dog - GET delete form
exports.dog_delete_get = asyncHandler(async (req, res) => {
  const dog = await Dog.findById(req.params.id);
  browser.description = "Deleting a dog";
  res.render("dogs/dog_delete", {
    browser,
    pageTitle: "Delete Dog",
    dog,
  });
});
// DELETE Dog - POST delete form
exports.dog_delete_post = asyncHandler(async (req, res) => {
  await Dog.findByIdAndRemove(req.body.dogid);
  res.redirect("/animal/dogs");
});
