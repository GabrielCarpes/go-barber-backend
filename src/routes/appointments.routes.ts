import { parseISO } from 'date-fns';
import { Router } from 'express';

import CreateAppointmentServer from '../services/CreateAppointmentServer';
import AppointmentRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();

const appointmentRepository = new AppointmentRepository();

appointmentsRouter.get('/', (request, response) => {
  const appointments = appointmentRepository.list();

  response.json({ appointments });
});

appointmentsRouter.post('/', (request, response) => {
  try {
    const { provider, date } = request.body;

    const parseDate = parseISO(date);

    const createAppointmentServer = new CreateAppointmentServer(
      appointmentRepository,
    );

    const appointment = createAppointmentServer.execute({
      provider,
      date: parseDate,
    });

    return response.json({ appointment });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

export default appointmentsRouter;
