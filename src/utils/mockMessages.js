// Conversaciones de ejemplo (mismo contenido que el diseño). Reemplazar por src/services.
// Las fechas son relativas al momento de carga para que "Hoy", "Ayer" y los días de la semana se vean bien.
const now = new Date();
const at = (daysAgo, h, m) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo, h, m).toISOString();
const msg = (id, from, text, when) => ({ id, from, text, at: when });

export const initialConversations = [
  {
    id: 'cleanpro', name: 'CleanPro SpA', initials: 'CP', role: 'Emprendedor', unread: true,
    messages: [
      msg('cp1', 'them', 'Hola Juan, recibimos tu solicitud por el servicio de limpieza profunda para el departamento.', at(0, 10, 30)),
      msg('cp2', 'me', 'Hola, gracias. ¿Tienen disponibilidad este viernes por la mañana?', at(0, 10, 33)),
      msg('cp3', 'them', 'Sí, podemos ir a las 9:00. El valor total es de $48.000 e incluye materiales.', at(0, 10, 36)),
      msg('cp4', 'me', 'Perfecto. ¿Puedo pagar directamente por TodoMart?', at(0, 10, 39)),
      msg('cp5', 'them', 'Sí, al confirmar la compra podrás pagar en la plataforma. Dejamos reservado el horario.', at(0, 10, 42)),
    ],
  },
  {
    id: 'transporteya', name: 'TransporteYa Ltda.', initials: 'TY', role: 'Empresa', unread: true,
    messages: [
      msg('ty1', 'me', 'Buenos días, necesito cotizar una mudanza de un departamento de 2 dormitorios.', at(0, 8, 50)),
      msg('ty2', 'them', 'El presupuesto para la mudanza es de $85.000 e incluye camión y dos ayudantes.', at(0, 9, 15)),
    ],
  },
  {
    id: 'electrofix', name: 'ElectroFix Chile', initials: 'EF', role: 'Empresa', unread: false,
    messages: [
      msg('ef1', 'me', 'Hola, ¿cómo va la reparación del refrigerador?', at(1, 12, 5)),
      msg('ef2', 'them', 'La reparación fue completada exitosamente. Puedes pasar a retirar tu equipo cuando quieras.', at(1, 16, 20)),
    ],
  },
  {
    id: 'colorhouse', name: 'ColorHouse SpA', initials: 'CH', role: 'Emprendedor', unread: true,
    messages: [
      msg('ch1', 'them', 'Adjunto las fotos del avance de la pintura. Quedamos atentos a tus comentarios.', at(1, 11, 10)),
    ],
  },
  {
    id: 'verdevivo', name: 'VerdeVivo SpA', initials: 'VV', role: 'Emprendedor', unread: false,
    messages: [
      msg('vv1', 'them', 'Gracias por su preferencia, esperamos volver a atenderle pronto.', at(3, 15, 0)),
    ],
  },
  {
    id: 'soporte', name: 'Soporte TodoMart', initials: 'SM', role: 'Soporte', unread: true,
    messages: [
      msg('sm1', 'them', '¡Bienvenido a TodoMart! Si tienes cualquier duda, estamos aquí para ayudarte.',
        new Date(now.getFullYear() - (now < new Date(now.getFullYear(), 8, 15) ? 1 : 0), 8, 15, 9, 0).toISOString()),
    ],
  },
];
