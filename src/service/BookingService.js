import axios from "axios";

const THERAPISTS_API_URL = "http://localhost:5000/therapists/";
const USERS_API_URL = "http://localhost:5000/clients/";
const AUTH_API_URL = "http://localhost:5000/auth/";
const CHAT_API_URL = "http://localhost:5000/chat/";
const APPOINTMENTS_API_URL = "http://localhost:5000/appointment/";
const SESSION_API_URL = "http://localhost:5000/session/";
const MESSAGE_API_URL = "http://localhost:5000/message/";
const MESSAGE_SESSION_API_URL = "http://localhost:5000/messageSession/";

class BookingService {
  getAvailableTherapists() {
    return axios.get(`${THERAPISTS_API_URL}`);
  }
  getTherapistsByTherapy(therapy) {
    return axios.get(`${THERAPISTS_API_URL}getTherapistsByTherapy`, {
      params: {
        therapy: therapy
      }
    });
  }
  getTherapistTherapies(id) {
    return axios.get(`${THERAPISTS_API_URL}getTherapistTherapies`, {
      params: {
        id: id
      }
    });
  }
  createTherapist(userId, userName) {
    return axios.post(`${THERAPISTS_API_URL}createTherapist`, {
      userId: userId,
      userName: userName
    });
  }
  getTherapist(userId) {
    return axios.get(`${THERAPISTS_API_URL}getTherapist`, {
      params: {
        userId
      }
    });
  }
  getTherapistById(id) {
    return axios.get(`${THERAPISTS_API_URL}getTherapistById`, {
      params: {
        id
      }
    });
  }
  updateTherapist(_id, therapy, jobTitle, description, gender) {
    return axios.patch(`${THERAPISTS_API_URL}updateTherapist`, {
      _id: _id,
      therapy: therapy,
      jobTitle: jobTitle,
      description: description,
      gender: gender
    });
  }
  createUser() {
    return axios.post(`${USERS_API_URL}`, {
      name: "Peeter Paan",
      email: "test@gmail.com",
      gender: "male"
    });
  }
  register(email, password, name, userType) {
    return axios.post(`${AUTH_API_URL}register`, {
      email: email,
      password: password,
      name: name,
      userType: userType
    });
  }
  login(email, password) {
    return axios.post(`${AUTH_API_URL}login`, {
      email: email,
      password: password
    });
  }
  getUser(email) {
    return axios.get(`${AUTH_API_URL}getUser`, {
      params: {
        email: email
      }
    });
  }
  getMessages(id) {
    return axios.get(`${CHAT_API_URL}getMessages`, {
      params: {
        id: id
      }
    });
  }
  createAvailableAppointment(
    time,
    formattedDate,
    therapistId,
    name,
    date,
    hourId
  ) {
    return axios.post(`${APPOINTMENTS_API_URL}createAvailableAppointment`, {
      time: time,
      formattedDate: formattedDate,
      therapistId: therapistId,
      name: name,
      date: date,
      hourId: hourId
    });
  }
  deleteAppointment(time, formattedDate, therapistId) {
    return axios.delete(`${APPOINTMENTS_API_URL}deleteAppointment`, {
      data: {
        time: time,
        formattedDate: formattedDate,
        therapistId: therapistId
      }
    });
  }
  denyAppointment(appointmentId) {
    return axios.patch(`${APPOINTMENTS_API_URL}denyAppointment`, {
      appointmentId: appointmentId
    });
  }
  confirmAppointment(appointmentId) {
    return axios.patch(`${APPOINTMENTS_API_URL}confirmAppointment`, {
      appointmentId: appointmentId
    });
  }
  activateAppointment(appointmentId) {
    return axios.patch(`${APPOINTMENTS_API_URL}activateAppointment`, {
      appointmentId: appointmentId
    });
  }
  endAppointment(appointmentId) {
    return axios.patch(`${APPOINTMENTS_API_URL}endAppointment`, {
      appointmentId: appointmentId
    });
  }
  getAppointment(appointmentId) {
    return axios.get(`${APPOINTMENTS_API_URL}getAppointment`, {
      params: {
        appointmentId: appointmentId
      }
    });
  }
  getAppointments() {
    return axios.get(`${APPOINTMENTS_API_URL}getAppointments`);
  }
  getAllTherapistAppointments(therapistId, activeAppointments) {
    return axios.get(`${APPOINTMENTS_API_URL}getAllTherapistAppointments`, {
      params: {
        therapistId: therapistId,
        activeAppointments: activeAppointments
      }
    });
  }
  getTherapistsAppointments(therapistId, firstAppointments) {
    return axios.get(`${APPOINTMENTS_API_URL}getTherapistsAppointments`, {
      params: {
        therapistId: therapistId,
        firstAppointments: firstAppointments
      }
    });
  }
  getClientAppointments(clientId, activeAppointments) {
    return axios.get(`${APPOINTMENTS_API_URL}getClientAppointments`, {
      params: {
        clientId: clientId,
        activeAppointments: activeAppointments
      }
    });
  }
  getSelectedTherapistAppointments(therapistId, clientId) {
    return axios.get(
      `${APPOINTMENTS_API_URL}getSelectedTherapistAppointments`,
      {
        params: {
          therapistId: therapistId,
          clientId: clientId
        }
      }
    );
  }
  getSessionAppointments(therapistId, clientId) {
    return axios.get(`${APPOINTMENTS_API_URL}getSessionAppointments`, {
      params: {
        therapistId: therapistId,
        clientId: clientId
      }
    });
  }
  cancelAppointment(appointmentId) {
    return axios.patch(`${APPOINTMENTS_API_URL}cancelAppointment`, {
      appointmentId: appointmentId
    });
  }
  getTherapists() {
    return axios.get(`${THERAPISTS_API_URL}getTherapists`);
  }
  searchAppointments(therapistId, therapy, beginDate, endDate) {
    return axios.get(`${APPOINTMENTS_API_URL}searchAppointments`, {
      params: {
        therapistId: therapistId,
        therapy: therapy,
        beginDate: beginDate,
        endDate: endDate
      }
    });
  }
  bookAppointment(id, clientId, therapy, clientName, sessionId) {
    return axios.patch(`${APPOINTMENTS_API_URL}bookAppointment`, {
      id: id,
      clientId: clientId,
      therapy: therapy,
      clientName: clientName,
      sessionId: sessionId
    });
  }
  findSession(therapistId, clientId) {
    return axios.get(`${SESSION_API_URL}findSession`, {
      params: {
        therapistId: therapistId,
        clientId: clientId
      }
    });
  }
  getSession(id) {
    return axios.get(`${SESSION_API_URL}getSession`, {
      params: {
        id: id
      }
    });
  }
  createSession(therapistId, therapistName, clientId, clientName) {
    return axios.post(`${SESSION_API_URL}createSession`, {
      therapistId: therapistId,
      therapistName: therapistName,
      clientId: clientId,
      clientName: clientName
    });
  }
  sendMessage(
    senderId,
    receiverId,
    sessionId,
    senderName,
    receiverName,
    header,
    content
  ) {
    return axios.post(`${MESSAGE_API_URL}sendMessage`, {
      senderId: senderId,
      receiverId: receiverId,
      sessionId: sessionId,
      senderName: senderName,
      receiverName: receiverName,
      header: header,
      content: content
    });
  }
  getMyMessages(id) {
    return axios.get(`${MESSAGE_API_URL}getMyMessages`, {
      params: {
        id: id
      }
    });
  }
  getMessage(id) {
    return axios.get(`${MESSAGE_API_URL}getMessage`, {
      params: {
        id: id
      }
    });
  }
  createMessageSession(therapistId, clientId, header) {
    return axios.post(`${MESSAGE_SESSION_API_URL}createMessageSession`, {
      therapistId: therapistId,
      clientId: clientId,
      header: header
    });
  }
  findMessageSession(id, client) {
    return axios.get(`${MESSAGE_SESSION_API_URL}findMessageSession`, {
      params: {
        id: id,
        client: client
      }
    });
  }
  findLastMessage(sessionId, id, sender) {
    return axios.get(`${MESSAGE_API_URL}findLastMessage`, {
      params: {
        sessionId: sessionId,
        id: id,
        sender: sender
      }
    });
  }
  getMessagesBySessionId(sessionId) {
    return axios.get(`${MESSAGE_API_URL}getMessagesBySessionId`, {
      params: {
        sessionId: sessionId
      }
    });
  }
  messageIsSeen(messageId) {
    return axios.patch(`${MESSAGE_API_URL}messageIsSeen`, {
      messageId: messageId
    });
  }
}
export default new BookingService();
