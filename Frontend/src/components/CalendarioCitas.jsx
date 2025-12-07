import { useState } from "react";
import { Card, Row, Col, Button, Badge, Spinner } from "react-bootstrap";
import "./CalendarioCitas.css";

const CalendarioCitas = ({ onSelectDateTime, selectedDate, selectedHour, horasOcupadas = [], loadingHoras = false }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Horas disponibles para citas (de 8am a 6pm)
  const horasDisponibles = [
    "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00"
  ];

  // Filtrar horas ocupadas
  const horasLibres = horasDisponibles.filter(hora => !horasOcupadas.includes(hora));

  // Obtener días del mes
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected >= today) {
      const dateString = `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      onSelectDateTime(dateString, selectedHour);
    }
  };

  const handleHourClick = (hour) => {
    if (selectedDate) {
      onSelectDateTime(selectedDate, hour);
    }
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isPastDate = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isSelectedDate = (day) => {
    if (!selectedDate) return false;
    // Parsear la fecha manualmente para evitar problemas de zona horaria
    const [year, month, dayOfMonth] = selectedDate.split('-').map(Number);
    return (
      day === dayOfMonth &&
      currentMonth.getMonth() === month - 1 &&
      currentMonth.getFullYear() === year
    );
  };

  // Crear array de días para renderizar (incluyendo espacios vacíos)
  const renderDays = () => {
    const days = [];

    // Espacios vacíos antes del primer día
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const past = isPastDate(day);
      const today = isToday(day);
      const selected = isSelectedDate(day);

      days.push(
        <div
          key={day}
          className={`calendar-day ${past ? 'past' : ''} ${today ? 'today' : ''} ${selected ? 'selected' : ''}`}
          onClick={() => !past && handleDateClick(day)}
        >
          {day}
          {today && <div className="today-indicator"></div>}
        </div>
      );
    }

    return days;
  };

  return (
    <Card className="shadow-lg mb-4">
      <Card.Header className="card-header-primary">
        <h5 className="mb-0">
          <i className="bi bi-calendar3 me-2"></i>
          Selecciona Fecha y Hora
        </h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={7}>
            {/* Calendario */}
            <div className="calendar-container">
              <div className="calendar-header">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handlePrevMonth}
                  className="border-0"
                >
                  <i className="bi bi-chevron-left"></i>
                </Button>
                <h5 className="mb-0">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h5>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleNextMonth}
                  className="border-0"
                >
                  <i className="bi bi-chevron-right"></i>
                </Button>
              </div>

              <div className="calendar-days-header">
                {dayNames.map(day => (
                  <div key={day} className="calendar-day-name">{day}</div>
                ))}
              </div>

              <div className="calendar-grid">
                {renderDays()}
              </div>

              <div className="mt-3">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Selecciona una fecha disponible para continuar
                </small>
              </div>
            </div>
          </Col>

          <Col md={5}>
            {/* Horas Disponibles */}
            <div className="hours-container">
              <h6 className="mb-3">
                <i className="bi bi-clock me-2"></i>
                Horas Disponibles
              </h6>

              {!selectedDate ? (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-calendar-x" style={{ fontSize: "2rem" }}></i>
                  <p className="mt-2">Primero selecciona una fecha</p>
                </div>
              ) : loadingHoras ? (
                <div className="text-center text-muted py-4">
                  <Spinner animation="border" className="text-primary" />
                  <p className="mt-2">Cargando disponibilidad...</p>
                </div>
              ) : horasLibres.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-x-circle" style={{ fontSize: "2rem", color: "#e74c3c" }}></i>
                  <p className="mt-2">No hay horas disponibles para esta fecha</p>
                </div>
              ) : (
                <div className="hours-grid">
                  {horasLibres.map((hora) => (
                    <Button
                      key={hora}
                      variant={selectedHour === hora ? "primary" : "outline-primary"}
                      size="sm"
                      onClick={() => handleHourClick(hora)}
                      className="hour-button"
                    >
                      {hora}
                    </Button>
                  ))}
                </div>
              )}

              {selectedDate && selectedHour && (
                <div className="mt-3 p-3 bg-info-light" style={{ borderRadius: "8px" }}>
                  <h6 className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Cita Seleccionada:
                  </h6>
                  <p className="mb-1">
                    <strong>Fecha:</strong> {(() => {
                      const [year, month, day] = selectedDate.split('-').map(Number);
                      const date = new Date(year, month - 1, day);
                      return date.toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });
                    })()}
                  </p>
                  <p className="mb-0">
                    <strong>Hora:</strong> {selectedHour}
                  </p>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default CalendarioCitas;
