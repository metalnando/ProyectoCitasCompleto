import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Twilio } from 'twilio';

@Injectable()
export class NotificationsService {
  private emailTransporter: nodemailer.Transporter;
  private twilioClient: Twilio;
  private emailEnabled: boolean;
  private smsEnabled: boolean;

  constructor() {
    // Configuración de Nodemailer
    this.emailEnabled = !!(
      process.env.EMAIL_HOST &&
      process.env.EMAIL_PORT &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASSWORD
    );

    if (this.emailEnabled) {
      this.emailTransporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para otros puertos
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      // Verificar la conexión
      this.emailTransporter.verify((error, success) => {
        if (error) {
          console.error('❌ Error al conectar con el servidor de correo:', error);
          this.emailEnabled = false;
        } else {
          console.log('✅ Servidor de correo listo para enviar mensajes');
        }
      });
    } else {
      console.warn('⚠️  Servicio de correo deshabilitado. Configure las variables de entorno.');
    }

    // Configuración de Twilio
    this.smsEnabled = !!(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
    );

    if (this.smsEnabled) {
      this.twilioClient = new Twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );
      console.log('✅ Servicio de SMS (Twilio) configurado');
    } else {
      console.warn('⚠️  Servicio de SMS deshabilitado. Configure las variables de entorno de Twilio.');
    }
  }

  /**
   * Enviar correo electrónico
   */
  async enviarEmail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }): Promise<boolean> {
    if (!this.emailEnabled) {
      console.log('📧 [SIMULADO] Email a:', options.to, '- Asunto:', options.subject);
      return true; // Retornar true en modo simulación
    }

    try {
      const info = await this.emailTransporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Bela Sunrise'}" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log('✅ Email enviado:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Error al enviar email:', error);
      return false;
    }
  }

  /**
   * Enviar SMS
   */
  async enviarSMS(telefono: string, mensaje: string): Promise<boolean> {
    if (!this.smsEnabled) {
      console.log('📱 [SIMULADO] SMS a:', telefono, '- Mensaje:', mensaje);
      return true; // Retornar true en modo simulación
    }

    try {
      // Limpiar el número: eliminar espacios, guiones, paréntesis
      let numeroLimpio = telefono.replace(/[\s\-\(\)]/g, '');

      // Eliminar el + si existe para procesarlo
      numeroLimpio = numeroLimpio.replace(/^\+/, '');

      // Extraer solo dígitos
      numeroLimpio = numeroLimpio.replace(/\D/g, '');

      let numeroFormateado = '';

      // Validar y formatear según el caso
      if (numeroLimpio.startsWith('57')) {
        // Ya tiene código de país 57
        numeroFormateado = '+' + numeroLimpio;
      } else if (numeroLimpio.length === 10) {
        // Número colombiano de 10 dígitos sin código de país
        numeroFormateado = '+57' + numeroLimpio;
      } else if (numeroLimpio.length === 12 && numeroLimpio.startsWith('57')) {
        // Tiene 57 + 10 dígitos
        numeroFormateado = '+' + numeroLimpio;
      } else {
        // Formato desconocido, intentar agregar +57
        numeroFormateado = '+57' + numeroLimpio;
      }

      // Validar que el número final tenga el formato correcto para Colombia
      // Debe ser +57 seguido de exactamente 10 dígitos
      const regexColombia = /^\+57\d{10}$/;

      if (!regexColombia.test(numeroFormateado)) {
        console.error(`❌ Número de teléfono inválido: ${telefono} (formateado: ${numeroFormateado})`);
        console.error('   El formato debe ser: +57XXXXXXXXXX (10 dígitos después del +57)');
        return false;
      }

      const message = await this.twilioClient.messages.create({
        body: mensaje,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: numeroFormateado,
      });

      console.log('✅ SMS enviado:', message.sid, '- Destino:', numeroFormateado);
      return true;
    } catch (error) {
      console.error('❌ Error al enviar SMS:', error);
      return false;
    }
  }

  /**
   * Notificación de registro de usuario
   */
  async notificarRegistroUsuario(
    nombre: string,
    email: string,
    telefono: string,
  ): Promise<void> {
    const nombreCompleto = nombre;

    // Enviar email de bienvenida
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #48C9B0 0%, #27ae60 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">¡Bienvenido a Bela Sunrise!</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Hola ${nombreCompleto},</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            ¡Gracias por registrarte en nuestro consultorio dental! Estamos encantados de tenerte como parte de nuestra familia.
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Ya puedes comenzar a agendar tus citas y acceder a todos nuestros servicios dentales de calidad.
          </p>
          <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #48C9B0; margin-top: 0;">¿Qué puedes hacer ahora?</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Agendar tu primera cita</li>
              <li>Ver nuestros tratamientos disponibles</li>
              <li>Acceder a tu historial clínico</li>
              <li>Gestionar tus citas programadas</li>
            </ul>
          </div>
          <p style="color: #666; font-size: 14px;">
            Si tienes alguna pregunta, no dudes en contactarnos.
          </p>
          <p style="color: #666; font-size: 14px;">
            <strong>Equipo Bela Sunrise</strong><br>
            Tu sonrisa es nuestra prioridad 😊
          </p>
        </div>
        <div style="background-color: #333; padding: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            © 2025 Bela Sunrise - Consultorio Dental
          </p>
        </div>
      </div>
    `;

    await this.enviarEmail({
      to: email,
      subject: '¡Bienvenido a Bela Sunrise! 🦷',
      html: emailHtml,
    });

    // Enviar SMS de bienvenida
    const smsMensaje = `¡Hola ${nombreCompleto}! Bienvenido a Bela Sunrise. Tu cuenta ha sido creada exitosamente. Ya puedes agendar tus citas dentales. ¡Esperamos verte pronto!`;
    await this.enviarSMS(telefono, smsMensaje);
  }

  /**
   * Notificación de cita agendada
   */
  async notificarCitaAgendada(
    nombrePaciente: string,
    email: string,
    telefono: string,
    fecha: string,
    hora: string,
    motivo: string,
    nombreMedico?: string,
  ): Promise<void> {
    // Formatear la fecha
    const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Enviar email de confirmación
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #48C9B0 0%, #27ae60 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">📅 Cita Confirmada</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Hola ${nombrePaciente},</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Tu cita en Bela Sunrise ha sido agendada exitosamente.
          </p>
          <div style="background-color: white; padding: 25px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #48C9B0;">
            <h3 style="color: #48C9B0; margin-top: 0;">Detalles de tu Cita:</h3>
            <table style="width: 100%; color: #666;">
              <tr>
                <td style="padding: 8px 0;"><strong>📅 Fecha:</strong></td>
                <td style="padding: 8px 0;">${fechaFormateada}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>🕐 Hora:</strong></td>
                <td style="padding: 8px 0;">${hora}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>🦷 Motivo:</strong></td>
                <td style="padding: 8px 0;">${motivo}</td>
              </tr>
              ${nombreMedico ? `
              <tr>
                <td style="padding: 8px 0;"><strong>👨‍⚕️ Médico:</strong></td>
                <td style="padding: 8px 0;">Dr. ${nombreMedico}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>⚠️ Importante:</strong> Por favor, llega 10 minutos antes de tu cita. Si necesitas reprogramar o cancelar, hazlo con al menos 24 horas de anticipación.
            </p>
          </div>
          <p style="color: #666; font-size: 14px;">
            Te esperamos en nuestro consultorio. Si tienes alguna pregunta, no dudes en contactarnos.
          </p>
          <p style="color: #666; font-size: 14px;">
            <strong>Equipo Bela Sunrise</strong><br>
            Tu sonrisa es nuestra prioridad 😊
          </p>
        </div>
        <div style="background-color: #333; padding: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            © 2025 Bela Sunrise - Consultorio Dental
          </p>
        </div>
      </div>
    `;

    await this.enviarEmail({
      to: email,
      subject: `Confirmación de Cita - ${fechaFormateada}`,
      html: emailHtml,
    });

    // Enviar SMS de confirmación
    const smsMensaje = `Hola ${nombrePaciente}! Tu cita en Bela Sunrise ha sido confirmada para el ${fechaFormateada} a las ${hora}. Motivo: ${motivo}. Te esperamos!`;
    await this.enviarSMS(telefono, smsMensaje);
  }

  /**
   * Recordatorio de cita (puede ser programado)
   */
  async enviarRecordatorioCita(
    nombrePaciente: string,
    email: string,
    telefono: string,
    fecha: string,
    hora: string,
  ): Promise<void> {
    const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

    // Email de recordatorio
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">🔔 Recordatorio de Cita</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Hola ${nombrePaciente},</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Te recordamos que tienes una cita programada próximamente:
          </p>
          <div style="background-color: white; padding: 25px; border-radius: 10px; margin: 20px 0; text-align: center;">
            <p style="font-size: 18px; color: #48C9B0; margin: 0;">
              <strong>${fechaFormateada}</strong>
            </p>
            <p style="font-size: 24px; color: #333; margin: 10px 0;">
              <strong>${hora}</strong>
            </p>
          </div>
          <p style="color: #666; font-size: 14px;">
            Por favor, confirma tu asistencia o reprograma con anticipación si no puedes asistir.
          </p>
          <p style="color: #666; font-size: 14px;">
            <strong>Equipo Bela Sunrise</strong>
          </p>
        </div>
      </div>
    `;

    await this.enviarEmail({
      to: email,
      subject: `Recordatorio: Cita el ${fechaFormateada}`,
      html: emailHtml,
    });

    // SMS de recordatorio
    const smsMensaje = `Recordatorio: Tienes una cita en Bela Sunrise el ${fechaFormateada} a las ${hora}. Te esperamos!`;
    await this.enviarSMS(telefono, smsMensaje);
  }
}
