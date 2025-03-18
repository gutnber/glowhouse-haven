
// Generate email templates based on content and language
export function getAdminEmailTemplate(record: any) {
  return {
    from: 'INMA Real Estate <info@inma.mx>',
    to: [record.adminEmail],
    subject: `New Contact Form Submission - ${record.name}`,
    html: `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${record.name}</p>
      <p><strong>Email:</strong> ${record.email}</p>
      <p><strong>Phone:</strong> ${record.phone || 'Not provided'}</p>
      <p><strong>Message:</strong></p>
      <pre style="white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${record.message}</pre>
      <p><strong>Submitted at:</strong> ${new Date(record.created_at).toLocaleString()}</p>
    `,
  };
}

export function getUserTranscriptTemplate(record: any, isSpanish: boolean) {
  return {
    from: 'INMA Real Estate <info@inma.mx>',
    to: [record.email],
    subject: isSpanish ? 'Tu Transcripción de Conversación con INMA' : 'Your Chat Transcript from INMA',
    html: isSpanish
      ? `
        <h1>Tu Transcripción de Conversación</h1>
        <p>Estimado/a ${record.name},</p>
        <p>Gracias por conversar con nuestro asistente. Aquí tienes una copia de tu conversación:</p>
        <pre style="white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${record.message}</pre>
        <p>Si tienes alguna pregunta adicional, no dudes en contactarnos.</p>
        <p>Saludos cordiales,</p>
        <p>El Equipo de INMA</p>
      `
      : `
        <h1>Your Chat Transcript</h1>
        <p>Dear ${record.name},</p>
        <p>Thank you for chatting with our assistant. Here is a copy of your conversation:</p>
        <pre style="white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${record.message}</pre>
        <p>If you have any further questions, please don't hesitate to contact us.</p>
        <p>Best regards,</p>
        <p>The INMA Team</p>
      `,
  };
}
