const express = require("express");
const router = express.Router();
const Appointment = require("../../../models/appointment");

router.get("/getAppointment", async (req, res) => {
  Appointment.findById({ _id: req.query.appointmentId }).then(function(
    appointment
  ) {
    res.send(appointment);
  });
});

router.get("/getAppointments", async (req, res) => {
  Appointment.find({}).then(function(appointments) {
    res.send(appointments);
  });
});

router.get("/getTherapistsAppointments", async (req, res) => {
  let today = new Date();
  if (req.query.firstAppointments == "false") {
    Appointment.find({
      therapistId: req.query.therapistId,
      date: { $gte: today },
      status: { $ne: "denied" }
    }).then(function(appointments) {
      appointments.sort(compareDates);
      res.send(appointments);
    });
  } else {
    Appointment.find({
      therapistId: req.query.therapistId,
      available: true,
      date: { $gte: today }
    }).then(function(appointments) {
      let sortedAppointments = appointments.sort(compareDates);
      if (sortedAppointments.length >= 3) {
        let sendAppointments = [];
        sendAppointments.push(sortedAppointments[0]);
        sendAppointments.push(sortedAppointments[1]);
        sendAppointments.push(sortedAppointments[2]);
        res.send(sendAppointments);
      } else {
        res.send(sortedAppointments);
      }
    });
  }
});

router.get("/getAllTherapistAppointments", async (req, res) => {
  let therapsitAppointments;
  let today = new Date();
  if (req.query.activeAppointments == "true") {
    await Appointment.find()
      .and([
        {
          therapistId: req.query.therapistId,
          date: { $gte: today },
          status: { $ne: "denied" }
        },
        {
          therapistId: req.query.therapistId,
          date: { $gte: today },
          status: { $ne: "available" }
        },
        {
          therapistId: req.query.therapistId,
          date: { $gte: today },
          status: { $ne: "done" }
        }
      ])
      .then(function(appointments) {
        therapsitAppointments = appointments;
      });
  } else {
    await Appointment.find({
      therapistId: req.query.therapistId,
      status: "done"
    }).then(function(appointments) {
      therapsitAppointments = appointments;
    });
  }
  therapsitAppointments.sort(compareDates);
  res.send(therapsitAppointments);
});

router.get("/getSessionAppointments", async (req, res) => {
  Appointment.find()
    .and([
      {
        therapistId: req.query.therapistId,
        clientId: req.query.clientId,
        status: { $ne: "denied" }
      },
      {
        therapistId: req.query.therapistId,
        clientId: req.query.clientId,
        status: { $ne: "booked" }
      }
    ])
    .sort({ date: 1 })
    .then(function(appointments) {
      res.send(appointments);
    });
});

router.get("/getAvailableAppointments", async (req, res) => {
  Appointment.find({ available: true }).then(function(appointments) {
    res.send(appointments);
  });
});

router.get("/searchAppointments", async (req, res) => {
  const { therapistId, therapy, beginDate, endDate } = req.query;
  let query = {};
  if (therapistId != "") {
    if (therapy != "" && therapy != undefined) {
      let containsTherapist = false;
      therapy.forEach(id => {
        if (id == therapistId) {
          containsTherapist = true;
        }
      });
      if (containsTherapist) {
        query.therapistId = therapistId;
      } else {
        query.therapistId = null;
      }
    } else {
      if (therapy != undefined) {
        query.therapistId = therapistId;
      } else {
        query.therapistId = null;
      }
    }
  } else {
    if (therapy != "" && therapy != undefined) {
      query.therapistId = { $in: therapy };
    } else if (therapy == undefined) {
      query.therapistId = null;
    }
  }
  query.date = { $gte: beginDate, $lte: endDate };
  query.available = true;

  const appointments = await Appointment.find(query);
  appointments.sort(compareDates);
  res.send(appointments);
});

router.post("/createAvailableAppointment", async (req, res) => {
  console.log(req.body.date);
  const appointment = new Appointment({
    time: req.body.time,
    formattedDate: req.body.formattedDate,
    therapistId: req.body.therapistId,
    therapistName: req.body.name,
    date: req.body.date,
    hourId: req.body.hourId
  });
  try {
    appointment.save();
  } catch (err) {
    res.json({ message: err });
  }
});

router.patch("/bookAppointment", async (req, res) => {
  try {
    const updatedAppointment = await Appointment.updateOne(
      { _id: req.body.id },
      {
        $set: {
          clientId: req.body.clientId,
          therapy: req.body.therapy,
          clientName: req.body.clientName,
          available: false,
          status: "booked",
          sessionId: req.body.sessionId
        }
      }
    );
    res.json(updatedAppointment);
  } catch (err) {
    res.json({ message: err });
  }
});

router.patch("/cancelAppointment", async (req, res) => {
  try {
    const cancelledAppointment = await Appointment.updateOne(
      { _id: req.body.appointmentId },
      {
        $set: {
          clientId: null,
          clientName: null,
          therapy: null,
          available: true,
          status: "available",
          sessionId: null
        }
      }
    );
    res.json(cancelledAppointment);
  } catch (err) {
    res.json({ message: err });
  }
});

router.delete("/deleteAppointment", async req => {
  Appointment.findOneAndDelete({
    time: req.body.time,
    formattedDate: req.body.formattedDate,
    therapistId: req.body.therapistId
  }).then(function(appointments) {
    console.log(appointments);
  });
});

router.patch("/denyAppointment", async (req, res) => {
  try {
    const updatedAppointment = await Appointment.updateOne(
      { _id: req.body.appointmentId },
      {
        $set: {
          status: "denied"
        }
      }
    );
    res.json(updatedAppointment);
  } catch (err) {
    res.json({ message: err });
  }
});

router.patch("/confirmAppointment", async (req, res) => {
  try {
    const updatedAppointment = await Appointment.updateOne(
      { _id: req.body.appointmentId },
      {
        $set: {
          status: "confirmed"
        }
      }
    );
    res.json(updatedAppointment);
  } catch (err) {
    res.json({ message: err });
  }
});

router.patch("/activateAppointment", async (req, res) => {
  try {
    const updatedAppointment = await Appointment.updateOne(
      { _id: req.body.appointmentId },
      {
        $set: {
          status: "activated"
        }
      }
    );
    res.json(updatedAppointment);
  } catch (err) {
    res.json({ message: err });
  }
});

router.patch("/endAppointment", async (req, res) => {
  try {
    const updatedAppointment = await Appointment.updateOne(
      { _id: req.body.appointmentId },
      {
        $set: {
          status: "done"
        }
      }
    );
    res.json(updatedAppointment);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/getClientAppointments", async (req, res) => {
  let clientAppointments;
  let today = new Date();
  if (req.query.activeAppointments == "true") {
    await Appointment.find({
      clientId: req.query.clientId,
      date: { $gte: today },
      status: { $ne: "done" }
    })
      .sort({ date: 1 })
      .then(function(appointments) {
        clientAppointments = appointments;
      });
  } else {
    await Appointment.find({
      clientId: req.query.clientId,
      status: "done"
    })
      .sort({ date: 1 })
      .then(function(appointments) {
        clientAppointments = appointments;
      });
  }
  res.send(clientAppointments);
});
router.get("/getSelectedTherapistAppointments", async (req, res) => {
  let today = new Date();
  Appointment.find()
    .or([
      {
        therapistId: req.query.therapistId,
        available: true,
        date: { $gte: today }
      },
      {
        therapistId: req.query.therapistId,
        clientId: req.query.clientId,
        available: false,
        status: { $ne: "denied" },
        date: { $gte: today }
      }
    ])
    .then(function(appointments) {
      res.send(appointments);
    });
});

function compareDates(firstElement, secondElement) {
  const firstDate = firstElement.date;
  const secondDate = secondElement.date;
  let sequence = 0;
  if (firstDate > secondDate) {
    sequence = 1;
  } else if (firstDate < secondDate) {
    sequence = -1;
  }
  return sequence;
}
module.exports = router;
