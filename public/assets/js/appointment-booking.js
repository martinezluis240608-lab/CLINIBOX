(function () {
  'use strict';

  const STORAGE_KEY = 'clinibox_appointments';
  const DRAFT_KEY = 'clinibox_appointment_draft';
  const weekdays = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const specialists = {
    carlos: { name: 'Dr. Carlos Mendoza', specialty: 'Medicina General', days: [1, 2, 3, 4, 5], start: '08:30', end: '17:30' },
    sofia: { name: 'Dra. Sofía Ramírez', specialty: 'Cardiología', days: [1, 3, 5], start: '09:00', end: '16:00' },
    daniel: { name: 'Dr. Daniel Torres', specialty: 'Pediatría', days: [1, 2, 3, 4, 5, 6], start: '09:00', end: '17:00' },
    elena: { name: 'Dra. Elena Ortiz', specialty: 'Dermatología', days: [2, 3, 4, 5, 6], start: '09:00', end: '16:30' },
    andrea: { name: 'Lic. Andrea Castro', specialty: 'Nutrición Clínica', days: [1, 2, 4, 6], start: '09:00', end: '18:00' }
  };

  function localDateString(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function formatTime(time) {
    const [hour, minute] = time.split(':').map(Number);
    return `${String(hour % 12 || 12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
  }

  function formatDate(date) {
    return new Date(`${date}T12:00:00`).toLocaleDateString('es-MX', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function readAppointments() {
    try {
      const appointments = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(appointments) ? appointments : [];
    } catch (error) {
      return [];
    }
  }

  function renderBookedAppointments(list) {
    const appointments = readAppointments()
      .filter(appointment => appointment && typeof appointment.date === 'string' && typeof appointment.time === 'string')
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    list.textContent = '';
    if (!appointments.length) {
      list.appendChild(createElement('p', '', 'Todavía no hay citas guardadas en este navegador.'));
      return;
    }
    appointments.forEach(appointment => {
      const entry = createElement('div', 'appointment-entry');
      const dateColumn = createElement('div', 'ae-date-col');
      dateColumn.append(createElement('small', '', formatDate(appointment.date)), createElement('strong', '', formatTime(appointment.time)));
      const infoColumn = createElement('div', 'ae-info-col');
      infoColumn.append(
        createElement('strong', '', appointment.specialist),
        createElement('p', '', `${appointment.specialty} • ${appointment.modality}`)
      );
      entry.append(dateColumn, infoColumn, createElement('span', 'status-tag confirmed', 'Agendada'));
      list.appendChild(entry);
    });
  }

  function generateTimes(start, end) {
    const times = [];
    let [hour, minute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    while (hour < endHour || (hour === endHour && minute < endMinute)) {
      times.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
      minute += 30;
      if (minute >= 60) {
        hour += 1;
        minute -= 60;
      }
    }
    return times;
  }

  function initializeForm(form) {
    const specialistSelect = form.querySelector('[data-appointment-specialist]');
    const calendarSection = form.querySelector('[data-appointment-calendar-section]');
    const calendar = form.querySelector('[data-appointment-calendar]');
    const dateInput = form.querySelector('[data-appointment-date]');
    const scheduleHint = form.querySelector('[data-appointment-schedule]');
    const slotContainer = form.querySelector('[data-appointment-slots]');
    const availabilityMessage = form.querySelector('[data-appointment-availability]');
    const selectedTimeInput = form.querySelector('[data-appointment-time]');
    const modalitySelect = form.querySelector('[data-appointment-modality]');
    const submitButton = form.querySelector('[data-appointment-submit]');
    const feedback = form.querySelector('[data-appointment-feedback]');
    const authDialog = document.querySelector('[data-appointment-auth]');
    let visibleMonth = new Date();
    visibleMonth.setDate(1);
    let feedbackTimeout;
    let checkingSession = false;

    function updateSubmitState() {
      submitButton.disabled = checkingSession || !(
        specialistSelect.value &&
        dateInput.value &&
        selectedTimeInput.value &&
        modalitySelect.value
      );
    }

    function clearSlots(message) {
      slotContainer.textContent = '';
      selectedTimeInput.value = '';
      availabilityMessage.textContent = message;
      updateSubmitState();
    }

    function renderCalendar() {
      if (!calendar || !specialistSelect.value) return;
      const specialist = specialists[specialistSelect.value];
      calendar.textContent = '';

      const header = createElement('div', 'appointment-calendar-header');
      const previous = createElement('button', 'appointment-calendar-nav', '‹');
      previous.type = 'button';
      previous.setAttribute('aria-label', 'Mes anterior');
      const now = new Date();
      previous.disabled = visibleMonth.getFullYear() === now.getFullYear() && visibleMonth.getMonth() === now.getMonth();
      const next = createElement('button', 'appointment-calendar-nav', '›');
      next.type = 'button';
      next.setAttribute('aria-label', 'Mes siguiente');
      const title = createElement('strong', '', `${monthNames[visibleMonth.getMonth()]} ${visibleMonth.getFullYear()}`);
      title.setAttribute('aria-live', 'polite');
      header.append(previous, title, next);
      calendar.appendChild(header);

      previous.addEventListener('click', () => {
        visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
        renderCalendar();
        const newPrevious = calendar.querySelector('.appointment-calendar-nav');
        (newPrevious.disabled ? calendar.querySelector('.appointment-calendar-nav:last-child') : newPrevious).focus();
      });
      next.addEventListener('click', () => {
        visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
        renderCalendar();
        calendar.querySelector('.appointment-calendar-nav:last-child').focus();
      });

      const weekdaysGrid = createElement('div', 'appointment-calendar-weekdays');
      ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].forEach(day => {
        weekdaysGrid.appendChild(createElement('span', '', day));
      });
      calendar.appendChild(weekdaysGrid);

      const grid = createElement('div', 'appointment-calendar-grid');
      const firstDay = (visibleMonth.getDay() + 6) % 7;
      const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
      const today = localDateString(new Date());

      for (let index = 0; index < firstDay; index += 1) {
        grid.appendChild(createElement('span', 'appointment-calendar-day empty'));
      }

      for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day, 12);
        const dateString = localDateString(date);
        const isPast = dateString < today;
        const isAvailableDay = specialist.days.includes(date.getDay());
        const button = createElement('button', 'appointment-calendar-day', String(day));
        button.type = 'button';
        button.disabled = isPast || !isAvailableDay;

        button.setAttribute('aria-label', `${weekdays[date.getDay()]}, ${formatDate(dateString)}`);
        button.setAttribute('aria-pressed', String(dateString === dateInput.value));
        button.classList.toggle('selected', dateString === dateInput.value);
        if (dateString === today) button.setAttribute('aria-current', 'date');
        button.addEventListener('click', () => {
          dateInput.value = dateString;
          grid.querySelectorAll('button').forEach(dayButton => {
            dayButton.classList.remove('selected');
            dayButton.setAttribute('aria-pressed', 'false');
          });
          button.classList.add('selected');
          button.setAttribute('aria-pressed', 'true');
          feedback.hidden = true;
          renderSlots();
        });
        grid.appendChild(button);
      }
      calendar.appendChild(grid);
    }

    function renderClock(availableTimes) {
      const periods = createElement('div', 'appointment-clock-options');
      const face = createElement('div', 'appointment-clock-face');
      const minutes = createElement('div', 'appointment-clock-options');
      const display = createElement('span', 'appointment-clock-display');
      face.appendChild(display);
      slotContainer.append(periods, face, minutes);

      const available = new Set(availableTimes);
      const initialTime = selectedTimeInput.value;
      let afternoon = Number((initialTime || availableTimes[0]).slice(0, 2)) >= 12;
      let selectedHour = initialTime ? Number(initialTime.slice(0, 2)) % 12 || 12 : null;
      const hourButtons = [];
      const minuteButtons = [];
      const periodButtons = [];

      function timeAt(hour, minute) {
        const hour24 = (hour % 12) + (afternoon ? 12 : 0);
        return `${String(hour24).padStart(2, '0')}:${minute}`;
      }

      function refreshClock() {
        periodButtons.forEach((button, index) => {
          button.setAttribute('aria-pressed', String(afternoon === Boolean(index)));
        });
        hourButtons.forEach((button, index) => {
          const hour = index + 1;
          button.disabled = !available.has(timeAt(hour, '00')) && !available.has(timeAt(hour, '30'));
          button.setAttribute('aria-pressed', String(selectedHour === hour));
        });
        minuteButtons.forEach((button, index) => {
          const time = selectedHour && timeAt(selectedHour, index === 0 ? '00' : '30');
          button.disabled = !available.has(time);
          button.setAttribute('aria-pressed', String(Boolean(time) && time === selectedTimeInput.value));
        });
        const time = selectedTimeInput.value;
        display.textContent = time ? formatTime(time) : selectedHour ? `${selectedHour}:––` : '––:––';
        availabilityMessage.textContent = time
          ? `Hora seleccionada: ${formatTime(time)}.`
          : `${formatDate(dateInput.value)} · ${selectedHour ? 'Elige los minutos.' : 'Elige una hora en el reloj.'}`;
        updateSubmitState();
      }

      ['AM', 'PM'].forEach((period, index) => {
        const button = createElement('button', 'appointment-clock-option', period);
        button.type = 'button';
        button.disabled = !availableTimes.some(time => (Number(time.slice(0, 2)) >= 12) === Boolean(index));
        button.addEventListener('click', () => {
          if (afternoon === Boolean(index)) return;
          afternoon = Boolean(index);
          selectedHour = null;
          selectedTimeInput.value = '';
          refreshClock();
        });
        periodButtons.push(button);
        periods.appendChild(button);
      });

      for (let hour = 1; hour <= 12; hour += 1) {
        const button = createElement('button', 'appointment-clock-hour', String(hour));
        button.type = 'button';
        const angle = hour * Math.PI / 6;
        button.style.left = `${50 + Math.sin(angle) * 40}%`;
        button.style.top = `${50 - Math.cos(angle) * 40}%`;
        button.addEventListener('click', () => {
          if (selectedHour === hour) return;
          selectedHour = hour;
          selectedTimeInput.value = '';
          refreshClock();
        });
        hourButtons.push(button);
        face.appendChild(button);
      }

      ['00', '30'].forEach(minute => {
        const button = createElement('button', 'appointment-clock-option', `:${minute}`);
        button.type = 'button';
        button.setAttribute('aria-label', `${minute} minutos`);
        button.addEventListener('click', () => {
          selectedTimeInput.value = timeAt(selectedHour, minute);
          refreshClock();
        });
        minuteButtons.push(button);
        minutes.appendChild(button);
      });
      refreshClock();
    }

    function availableTimesForDate(date, appointments = readAppointments()) {
      const specialist = specialists[specialistSelect.value];
      const now = new Date();
      const today = localDateString(now);
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (!specialist || date < today || !specialist.days.includes(new Date(`${date}T12:00:00`).getDay())) return [];

      return generateTimes(specialist.start, specialist.end).filter(time =>
        (date !== today || time > currentTime) &&
        !appointments.some(appointment =>
          appointment.specialistId === specialistSelect.value &&
          appointment.date === date &&
          appointment.time === time
        )
      );
    }

    function renderSlots(preferredTime = '') {
      const specialist = specialists[specialistSelect.value];
      const date = dateInput.value;
      slotContainer.textContent = '';
      selectedTimeInput.value = '';

      if (!specialist || !date) {
        availabilityMessage.textContent = 'Selecciona un día para consultar los horarios.';
        updateSubmitState();
        return;
      }

      const dayNumber = new Date(`${date}T12:00:00`).getDay();
      if (!specialist.days.includes(dayNumber)) {
        availabilityMessage.textContent = `No hay consulta este día. Atiende: ${specialist.days.map(day => weekdays[day]).join(', ')}.`;
        updateSubmitState();
        return;
      }

      const availableTimes = availableTimesForDate(date);

      if (availableTimes.length === 0) {
        availabilityMessage.textContent = 'No quedan horarios disponibles para esta fecha. Elige otro día.';
        updateSubmitState();
        return;
      }

      if (availableTimes.includes(preferredTime)) selectedTimeInput.value = preferredTime;
      renderClock(availableTimes);
    }

    specialistSelect.addEventListener('change', () => {
      const specialist = specialists[specialistSelect.value];
      dateInput.value = '';
      selectedTimeInput.value = '';
      calendarSection.hidden = !specialist;
      scheduleHint.textContent = specialist
        ? `${specialist.name} atiende ${specialist.days.map(day => weekdays[day]).join(', ')}.`
        : '';
      if (specialist) {
        visibleMonth = new Date();
        visibleMonth.setDate(1);
        renderCalendar();
        clearSlots('Selecciona un día del calendario.');
      }
      feedback.hidden = true;
      updateSubmitState();
    });

    modalitySelect.addEventListener('change', updateSubmitState);

    form.addEventListener('submit', async event => {
      event.preventDefault();
      const specialistId = specialistSelect.value;
      const specialist = specialists[specialistId];
      const date = dateInput.value;
      const time = selectedTimeInput.value;
      const modality = modalitySelect.value;
      if (checkingSession || !specialist || !date || !time || !form.reportValidity()) return;

      checkingSession = true;
      updateSubmitState();
      let session;
      try {
        const response = await fetch('/CLINIBOX/public/citas/sesion', { cache: 'no-store' });
        if (!response.ok) throw new Error('No se pudo verificar la sesión');
        session = await response.json();
      } catch (error) {
        feedback.textContent = 'No pudimos verificar tu sesión. Intenta de nuevo.';
        feedback.hidden = false;
        return;
      } finally {
        checkingSession = false;
        updateSubmitState();
      }
      if (specialistId !== specialistSelect.value || date !== dateInput.value
        || time !== selectedTimeInput.value || modality !== modalitySelect.value) return;

      if (!session.paciente) {
        try {
          sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ specialistId, date, time, modality }));
        } catch (error) {
          authDialog.querySelector('p').textContent = 'Inicia sesión o regístrate. Tendrás que volver a elegir el horario.';
        }
        if (!authDialog.open) authDialog.showModal();
        return;
      }

      const appointments = readAppointments();
      if (!availableTimesForDate(date, appointments).includes(time)) {
        renderSlots();
        availabilityMessage.textContent = 'La hora seleccionada ya no está disponible. Elige otro horario o fecha.';
        return;
      }

      const appointment = {
        specialistId,
        specialist: specialist.name,
        specialty: specialist.specialty,
        date,
        time,
        modality: modalitySelect.selectedOptions[0].textContent
      };
      appointments.push(appointment);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
      } catch (error) {
        feedback.textContent = 'No pudimos guardar la cita en este navegador.';
        feedback.hidden = false;
        return;
      }
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch (error) {}

      feedback.textContent = `Cita agendada con ${specialist.name} el ${formatDate(date)} a las ${formatTime(time)}.`;
      feedback.hidden = false;
      clearTimeout(feedbackTimeout);
      feedbackTimeout = setTimeout(() => {
        feedback.hidden = true;
      }, 5000);
      renderCalendar();
      renderSlots();
    });

    window.addEventListener('storage', event => {
      if (event.key === STORAGE_KEY) {
        renderCalendar();
        renderSlots();
      }
    });

    calendarSection.hidden = true;
    clearSlots('Selecciona un especialista para comenzar.');
    let draft;
    try {
      draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null');
    } catch (error) {}
    if (draft && Object.hasOwn(specialists, draft.specialistId) && /^\d{4}-\d{2}-\d{2}$/.test(draft.date)
      && draft.date >= localDateString(new Date())) {
      specialistSelect.value = draft.specialistId;
      specialistSelect.dispatchEvent(new Event('change'));
      dateInput.value = draft.date;
      modalitySelect.value = draft.modality;
      visibleMonth = new Date(`${draft.date.slice(0, 7)}-01T12:00:00`);
      renderCalendar();
      renderSlots(draft.time);
    }
  }

  document.querySelectorAll('[data-appointment-form]').forEach(initializeForm);
  const bookedList = document.querySelector('[data-booked-appointments]');
  if (bookedList) {
    const refreshList = () => renderBookedAppointments(bookedList);
    refreshList();
    window.addEventListener('pageshow', refreshList);
    window.addEventListener('storage', event => {
      if (event.key === STORAGE_KEY || event.key === null) refreshList();
    });
  }
})();
