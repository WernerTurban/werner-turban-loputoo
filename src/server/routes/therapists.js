const express = require("express");
const Therapist = require("../../models/therapist");

const router = express.Router();

router.get("/getTherapists", (req, res) => {
  Therapist.find({}).then(function(therapists) {
    res.send(therapists);
  });
});
router.get("/getTherapistsByTherapy", (req, res) => {
  Therapist.find({ therapy: { $in: [req.query.therapy] } }).then(function(
    therapies
  ) {
    let therapistIds = [];
    therapies.forEach(therapy => therapistIds.push(therapy._id));
    res.send(therapistIds);
  });
});

router.get("/getTherapistTherapies", (req, res) => {
  Therapist.findById({ _id: req.query.id }).then(function(therapist) {
    let therapy = therapist.therapy;
    res.send(therapy);
  });
});

router.get("/getTherapist", (req, res) => {
  Therapist.findOne({ userId: req.query.userId }).then(function(therapist) {
    res.send(therapist);
  });
});

router.get("/getTherapistById", (req, res) => {
  Therapist.findById({ _id: req.query.id }).then(function(therapist) {
    res.send(therapist);
  });
});

router.patch("/updateTherapist", async (req, res) => {
  try {
    const cancelledAppointment = await Therapist.updateOne(
      { _id: req.body._id },
      {
        $set: {
          jobTitle: req.body.jobTitle,
          therapy: req.body.therapy,
          description: req.body.description,
          gender: req.body.gender
        }
      }
    );
    res.json(cancelledAppointment);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/createTherapist", async (req, res) => {
  const therapist = new Therapist({
    name: req.body.userName,
    userId: req.body.userId
  });
  try {
    const savedTherapist = await therapist.save();
    res.json(savedTherapist);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
