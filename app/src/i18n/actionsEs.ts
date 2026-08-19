// Traductions ES des actions terrain — cycle de 90 jours
// Quand lang === 'es', ces textes remplacent les versions FR

export interface ActionEs {
  title: string;
  description: string;
  script: string;
  objectif: string;
}

export const actionsEs: Record<number, ActionEs> = {
  1: {
    title: 'Tu reto del día — ¡Sal al terreno y haz que hablen de ti!',
    description: `**Si eres principiante:** Empiezas y tu archivo aún es pequeño — perfecto, es normal. Hoy: terreno clásico.

Selecciona 2 bienes en venta en tu herramienta interna en esta calle o muy cerca, toca en el bien + 10 vecinos.

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y termina diciendo que efectivamente parece encajar con la búsqueda de tus compradores. Coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores, lo comprendéis — para tomar el conjunto de los detalles técnicos y hablarles a los compradores, para rápidamente traerles a la visita. ¿Mejor por la mañana o por la tarde, qué os va mejor?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio. Siempre sirve, incluso sin proyecto inmediato: para seguros, una sucesión, un proyecto futuro.

**Si eres confirmado:** Tu fuerza es tu archivo. Hoy reactivas tus antiguos clientes: vendedores y compradores.

"Hola, soy [Tu nombre], pasaba por aquí para tener noticias tuyas. ¿Tu instalación va bien? ¿Estás bien instalado?" Escucha, demuestra que te preocupas por ellos.

Luego pregunta naturalmente: "A propósito, he cambiado de agencia / de red — ¿conoces a alguien alrededor de ti que esté pensando en vender o buscar un bien o que simplemente quiera conocer el valor de su patrimonio?"

Cada antiguo cliente satisfecho = 2 a 3 recomendaciones naturales. Es la base de tu negocio.`,
    script: 'Consejo método — Seas principiante o confirmado, lo esencial es MOVERSE hoy. Sin excusas. Selecciona tus bienes en venta en tu herramienta interna, prepara tu ángulo, y sal. Tus scripts y memorandos de formación están a tu disposición.',
    objectif: '🎯 Principiante: 2 bienes en venta seleccionados, 10 puertas tocadas, 1 R1 mínimo // Confirmado: 10 antiguos clientes reactivados, 2 recomendaciones obtenidas',
  },
  2: {
    title: 'Colaboradores — Selecciona y coloca tus carteles "Estimación ofrecida"',
    description: `Hoy: selecciona 2 a 3 colaboradores de negocios BIEN situados en tu sector, con paso, y a quienes vas a proponer colocar un cartel "Estimación ofrecida".

El cartel se pone en su ventana, visible desde la calle.

El trato es simple:
→ Lo registras como colaborador de negocios oficial en su cuenta
→ Cuando llegue una llamada, preguntas sistemáticamente: "¿En qué cartel ha visto mi número?"
→ Registras esta recomendación a tu colaborador para que sea remunerado en cuanto se haga la venta

Cada cartel colocado = un colaborador que trabaja para ti 24h/24.`,
    script: 'Consejo método — Tus scripts y memorandos de formación están a tu disposición para abordar a tus colaboradores. Elige emplazamientos estratégicos: calle con paso, esquina, cerca de parada de autobús. La visibilidad = la eficacia.',
    objectif: '🎯 2-3 colaboradores seleccionados y abordados, 2 carteles "Estimación ofrecida" colocados mínimo, 2 colaboradores registrados en tu CRM',
  },
  3: {
    title: 'Comerciantes — Flyers VENDIDO + EN VENTA con QR code',
    description: `Prepara TU flyer: un solo flyer con 2 productos — un bien VENDIDO (sector únicamente, sin dirección precisa) y un bien EN VENTA actual. Añade un QR code "Ver el conjunto de los bienes actualizados" para que la gente pueda ir a tu sitio a ver todos tus bienes, incluso si el flyer solo muestra 2.

Ve a ver a tus 5 comerciantes colaboradores. Deja los flyers en el mostrador, habla de las novedades del barrio.

**Consejo crucial:** ¡No te quedes solo con el comerciante! Cuando haya clientes esperando en el comercio, bromea con ellos, inclúyelos en la conversación. Habla del mercado inmobiliario del sector, pregúntales si conocen el valor de su bien. A menudo es así como nacen nuevos contactos — a la gente le gusta dar su opinión y sentirse incluida.

Cada flyer en un mostrador = ojos que ven tu actividad.`,
    script: 'Consejo método — El QR code es esencial: transforma un flyer estático en puerta de entrada hacia todos tus bienes. La gente escanea por curiosidad, y quizás cae en EL bien que les interesa. ¡No olvides incluir a los clientes que esperan en el comercio — son tu objetivo!',
    objectif: '🎯 5 comerciantes revisitados con flyers nuevos, 10 flyers depositados, 2 nuevos contactos cualificados (1 del comercio)',
  },
  4: {
    title: 'Estimación patrimonial ofrecida — Palanca "Bien vendido en el sector"',
    description: `¿Has vendido un bien en una calle? Perfecto.

Imprime un flyer:
→ "VENDIDO — [Sector] — Estimación ofrecida para los vecinos"

Toca en las 10 puertas de la calle.

Preséntate:
"Acabo de vender en este sector, tengo compradores en espera.
Propongo a los propietarios de la calle una estimación patrimonial totalmente ofrecida. Y es que esa es la base misma de mi profesión: aportar una información fiable a los habitantes de mi sector."

Dale el flyer a cada puerta.
Incluso sin proyecto inmediato: "Guardad mi tarjeta, puede servir dentro de 6 meses".

Cada estimación ofrecida = un futuro mandato.`,
    script: 'Consejo método — El flyer "VENDIDO" es tu palanca: crea credibilidad. Toca con confianza, eres el asesor del sector que ha vendido, no un vendedor puerta a puerta. Objetivo: dar el máximo de estimaciones patrimoniales ofrecidas. Un solo flyer con el sector basta.',
    objectif: '🎯 10 puertas tocadas con flyer "VENDIDO", 5 estimaciones patrimoniales ofrecidas, 5 flyers distribuidos',
  },
  5: {
    title: 'Contacto terreno — Conquista de una calle entera',
    description: `Elige una calle que no conozcas bien. Selecciona 2 bienes en venta en tu herramienta interna en esta calle o muy cerca. Toca en el bien + a los 8 vecinos.

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — para tomar el conjunto de los detalles técnicos y hablarles a los compradores. ¿Mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida.

El objetivo no es vender hoy — es obtener una cita de estimación patrimonial ofrecida.

Cada R1 obtenido = un mandato potencial en 30-90 días o una recomendación para su entorno, ya que conocen tu seriedad, tus métodos y te han visto en acción.`,
    script: 'Consejo método — Conquista una calle entera: toca en el bien + 8 vecinos. Cada puerta tocada = un contacto registrado en el CRM. Propón sistemáticamente una estimación patrimonial — es tu misión primera. Idealmente, preséntate con un solo flyer.',
    objectif: '🎯 2 bienes en venta seleccionados en tu herramienta, 10 puertas vecinas, 1 R1 estimación mínimo',
  },
  6: {
    title: 'Colaboradores — Agradecer a los activos, reforzar los lazos',
    description: `Hoy ves a tus colaboradores que han entregado. Trae un pequeño regalo: bombones, una botella, un ramo. Agradéceles de viva voz. El éxito debe verse.

Si un colaborador ha colocado un cartel y no has tenido nada a cambio desde hace 2 meses, vuelve a ver: quizás el cartel está escondido, quizás ha olvidado. Sin reproche — solo presencia y ayuda mutua.

**Novedad:** Busca 1 colaborador ORIGINAL esta semana. Piensa en tienda de cocinass, anticuarios/brocantes, farmacéuticos, peluqueros de perros... Tus scripts para estos colaboradores subexplotados están en tus memorandos de formación.`,
    script: 'Consejo método — El éxito debe verse: trae un pequeño regalo, agradece de viva voz. Si un cartel está escondido, repositiona. Prueba un nuevo colaborador esta semana — un tienda de cocinas o un anticuario puede sorprenderte por la calidad de sus puestas en relación.',
    objectif: '🎯 3 colaboradores agradecidos en persona con regalo, 2 carteles verificados, 1 nuevo colaborador original contactado',
  },
  7: {
    title: 'Comerciantes — Nuevos contactos en periferia + clientes',
    description: `Busca nuevos comerciantes colaboradores en zonas donde aún no has pasado.

Preséntate con tu flyer (1 vendido + 1 en venta + QR code).

**Consejo:** ¡Cuando haya clientes esperando en el comercio, inclúyelos! Di: "¿Conocéis el valor de su bien en este sector? Es una locura cómo ha movido el mercado..." A la gente le gusta hablar de inmobiliaria, y creas un contacto natural sin presión.

Objetivo: 2 nuevos comerciantes colaboradores hoy.`,
    script: 'Consejo método — Incluye a los clientes que esperan — ¡son tu objetivo! Están relajados, en confianza gracias al comerciante, y curiosos. Un intercambio de 2 minutos puede desembocar en una cita de estimación. Tus scripts están en tus memorandos.',
    objectif: '🎯 3 nuevos contactos cualificados, 1 cartel "Estimación ofrecida" colocado en nuevo comercio, 2 colaboradores registrados',
  },
  8: {
    title: `Estimación patrimonial ofrecida — Palanca "Bien EN VENTA actualmente"`,
    description: `Tienes un bien EN VENTA en una calle? Úsalo como palanca.

Imprime tu flyer con el bien EN VENTA (foto, precio, sector) y "Estimación ofrecida para los vecinos — conozco a los compradores de este sector".

Toca en las 10 puertas.

"He oído decir que hay un bien en venta en este sector, ¿habéis oído hablar de él? Organizo las visitas este fin de semana y conozco a los compradores del sector. Propongo a los propietarios de la calle una estimación patrimonial totalmente ofrecida. Y es que esa es la base misma de mi profesión: aportar una información fiable a los habitantes de mi sector."

Dale el flyer a cada puerta. Incluso sin proyecto inmediato: "Guardad mi tarjeta, puede servir dentro de 6 meses".

Cada estimación ofrecida = un futuro mandato.`,
    script: `Consejo método — El flyer es tu palanca: crea credibilidad. Toca con confianza, eres el asesor del sector. Objetivo: dar el máximo de estimaciones patrimoniales ofrecidas.`,
    objectif: `🎯 10 puertas tocadas, 3 estimaciones ofrecidas, 2 contactos cualificados`,
  },

  9: {
    title: `Contacto terreno post-R1 — Capitalizar en cada cita`,
    description: `Elige una calle que no conozcas bien.

Selecciona 2 bienes en venta en tu herramienta interna en esta calle o muy cerca.

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — ¿mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio.

**Pregunta mágica**: "¿Quién conocéis en su entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`,
    script: `Consejo método — Cada puerta tocada = un contacto registrado en el CRM. Propón sistemáticamente una estimación patrimonial — es tu misión primera.`,
    objectif: `🎯 2 bienes en venta seleccionados, 10 puertas tocadas, 1 R1 estimación mínimo`,
  },

  10: {
    title: `Colaboradores — Challenge y nuevos colaboradores originales`,
    description: `Lanza un challenge entre tus colaboradores: "El que me haga más puestas en relación cualificadas este mes, le invito a cenar al mejor restaurante del barrio".

Hoy, encuentra 1 NUEVO colaborador ORIGINAL que nunca hayas abordado. Aquí tienes ideas:
• **Cocinero** — El cliente duda en firmar un presupuesto de 15 000€ si no sabe si va a recuperar el dinero en la venta
• **Chatarrero/brocante** — Cuando se vacía una casa de arriba abajo, es porque va a ser vendida (sucesión, residencia)
• **Farmacéutico** — El confidente del barrio, sabe quién se va a residencia o quién se separa
• **Peluquero de perros** — Los dueños hablan de su vida mientras Médor se arregla

Tus scripts detallados para cada colaborador están en tus memorandos de formación.`,
    script: `Consejo método — Tus scripts y memorandos de formación están a tu disposición. Lanza un challenge para motivar a tus colaboradores activos.`,
    objectif: `🎯 2 colaboradores contactados, 1 partenariado concluido mínimo`,
  },

  11: {
    title: `Comerciantes — Actualización flyers + novedades del mes`,
    description: `Pasa a ver a tus 5 comerciantes partners.

Flyers frescos (VENDIDO + EN VENTA + QR code), noticias del barrio, inclusión de los clientes que esperan.

**Consejo**: Incluye sistemáticamente a los clientes que esperan. Habla del mercado, pregunta si conocen el valor de su bien. Es tu método de prospección más natural.

Encuentra también 1 nuevo comerciante esta semana. Piensa en:
• Florista (bodas, sucesiones = mudanzas)
• Panadero (todo el mundo va, las comadres del pueblo)
• Peluquero (las confidencias cara a cara)

Retira los flyers viejos (+3 semanas / 1 mes).`,
    script: `Consejo método — La rutina semanal con los comerciantes crea constancia. Los comerciantes se convierten en tus relés. ¡No olvides nunca el QR code en tus flyers!`,
    objectif: `🎯 5 comerciantes revisitados, 10 flyers depositados, 1 nuevo contacto`,
  },

  12: {
    title: `Contacto terreno — Anuncio de transacción reciente`,
    description: `Acabas de hacer un R1 o una estimación? Perfecto. Antes de irte, toca en las 5 puertas de alrededor.

Aprovecha que ya estás en la calle.

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — ¿mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio.

**Pregunta mágica**: "¿Quién conocéis en su entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`,
    script: `Consejo método — La pregunta mágica a cada puerta = recomendaciones que nunca tendrías de otra forma. Un solo flyer basta.`,
    objectif: `🎯 3 bienes en venta seleccionados, 13 puertas tocadas, 3 contactos cualificados`,
  },

  13: {
    title: `PIGE Legal — Envío de mensajes SMS a propietarios`,
    description: `Tu sesión PIGE Legal del día — 30 minutos para enviar mensajes ciblados y personalizados sobre los anuncios.

**El principio:** Envías mensajes a propietarios de bienes que has identificado en las plataformas (Idealista, Fotocasa, Milanuncios...). Los propietarios te devuelven la llamada en el día — y tú, coges el R1.

**Tu método (30 min crono):**
1. **Muy temprano por la mañana** (7h-8h30): escanea los anuncios de tu sector en Idealista, Fotocasa, Milanuncios...
2. Selecciona 5-8 bienes que correspondan a tus búsquedas de compradores
3. Redacta un mensaje corto, personalizado, con el nombre del propietario:
   "Hola [Nombre], soy [Tu nombre], asesor inmobiliario en [sector]. Trabajo con compradores muy motivados que buscan exactamente este tipo de bien. ¿Estarías abierto a un intercambio rápido?"
4. Envía tus mensajes ANTES de las 9h — así, los vendedores te devuelven la llamada en el día
5. Cuando un propietario te llame: **si no estás delante de tu ordenador**, calma un momento para devolverle la llamada estando tranquilo. **Nunca hagas la llamada PIGE sin estar delante del anuncio correcto.** Vuelve a pedir la información básica del bien y el precio, para tenerlos a la vista durante tu llamada de vuelta a la hora convenida.

Cada respuesta = un R1 potencial en el día.`,
    script: `Consejo método — La PIGE Legal es ultra-potente porque el propietario TE llama a ti. Envía muy temprano por la mañana para que los vendedores llamen en el día. Nunca hagas la llamada sin estar delante del anuncio correcto.`,
    objectif: `🎯 5-8 mensajes enviados en 30 min, 2-3 respuestas en el día, 1 R1 fijado`,
  },

  14: {
    title: `Informe local inmobiliario — Tu arma de prospección masiva`,
    description: `Genera tu informe local inmobiliario ultra detallado con nuestra herramienta interna (máx 3 min para editarlo) y ve al contacto de los propietarios de tu sector para proponérselo o para su entorno (a cambio de dirección email para enviárselo).

1. Genera tu informe local con la herramienta interna (3 min máx)
2. envíalo a tus contactos de este sector
3. Selecciona 10 propietarios ciblados en tu sector (vecinos de bienes vendidos, contactos existentes, calle a conquistar)
4. ""Soy [Tu nombre], asesor inmobiliario en el sector. Acabo de publicar un informe muy completo sobre la evolución de los precios en su barrio. Puede interesaros para conocer el valor de su patrimonio, o para su entorno. Si me dejáis su email, os lo envío inmediatamente.""
5. Aprovecha para discutir con ellos y proponer una estimación patrimonial o registrarles como colaboradores.

Cada informe enviado = un contacto caliente + una prueba de tu expertise.

💡 **Este informe te servirá 1 a 2 meses.** Guárdalo preciosamente. La próxima vez que la acción "informe local" vuelva, no necesitas regenerarlo — irás al terreno cerca de bienes en venta (búsqueda compradores) Y propondrás este mismo informe ya detallado. Una piedra dos pájaros.`,
    script: `Consejo método — El informe local es una máquina de R1. Prueba tu expertise, aporta un valor concreto al propietario, y te da una razón natural de recontactar.`,
    objectif: `🎯 1 informe local generado, 10 propietarios contactados, 5 direcciones emails recogidas, 1 R1 estimación mínimo`,
  },

  15: {
    title: `Estimación patrimonial ofrecida — Palanca "Bien vendido en el sector" (rotación)`,
    description: `Tienes un bien VENDIDO en una calle? Perfecto.

Imprime un flyer:
→ "VENDIDO — [Sector] — Estimación ofrecida para los vecinos"

Toca en las 10 puertas.

"Acabo de vender en este sector, tengo compradores en espera. Vuestros vecinos han vendido, el mercado se mueve en esta calle. Propongo a los propietarios de la calle una estimación patrimonial totalmente ofrecida. Y es que esa es la base misma de mi profesión: aportar una información fiable a los habitantes de mi sector."

Dale el flyer a cada puerta. Incluso sin proyecto inmediato: "Guardad mi tarjeta, puede servir dentro de 6 meses".

Cada estimación ofrecida = un futuro mandato.`,
    script: `Consejo método — Rotación de las 3 palancas: Bien vendido / En venta / Búsqueda comprador. Cada palanca funciona diferente según el sector y el momento. Prueba, observa, ajusta.`,
    objectif: `🎯 10 puertas tocadas, 4 estimaciones ofrecidas, 2 contactos cualificados`,
  },

  16: {
    title: `Colaboradores — Ciber a tienda de cocinass del sector`,
    description: `El tienda de cocinas es el primero en enterarse del proyecto de vida. Un propietario que quiere vender se dice: "Si redo la cocina, venderé más caro". Va a ver al tienda de cocinas ANTES que al agente inmobiliario.

**Tu script**:
"Te propongo un partenariado para transformar tus presupuestos dormidos en ventas. Cuando un cliente duda en firmar porque tiene un proyecto de venta, habla de mí. Hago la estimación, aconsejo sobre la rentabilidad de las obras, y si el vendedor no hace las obras, presento tus planos 3D a todos mis compradores. Tocas el 6% de mi comisión vía Propertips."

Encuentra 2 tienda de cocinass en tu sector. ¡Adelante!

El tienda de cocinas está bloqueado: el cliente duda en firmar un presupuesto de 15 000€. Te conviertes en su salvador aportando claridad sobre la plusvalía.`,
    script: `Consejo método — Los colaboradores subexplotados (tienda de cocinass, anticuarios...) a menudo tienen contactos de mejor calidad que los colaboradores clásicos.`,
    objectif: `🎯 3 colaboradores agradecidos en persona con regalo, 2 carteles verificados`,
  },

  17: {
    title: `Comerciantes — Rutina semanal`,
    description: `Pasa a ver a tus 5 comerciantes partners.

Flyers frescos (VENDIDO + EN VENTA + QR code), noticias del barrio, inclusión de los clientes que esperan.

**Consejo**: Incluye sistemáticamente a los clientes que esperan. Habla del mercado, pregunta si conocen el valor de su bien. Es tu método de prospección más natural.

**Novedad**: presenta también tus nuevos bienes en exclusiva a tus comerciantes. Están orgullosos de decir: "Mi asesor inmobiliario tiene un bien EXCLUSIVO en este momento, ¡es magnífico!"

Retira los flyers viejos (+3 semanas / 1 mes).`,
    script: `Consejo método — Cada nuevo comerciante = un nuevo relé. El panadero ve a todo el mundo, el peluquero lo oye todo. Tu red de comerciantes es un activo que crece cada semana.`,
    objectif: `🎯 5 comerciantes revisitados, 1 nuevo comerciante, 2 contactos cualificados`,
  },

  18: {
    title: `Contacto terreno — Conquista de una zona inexplorada`,
    description: `Un bien ha pasado a "Bajo oferta" o "Vendido" en una calle? Es la ocasión ideal.

Los vecinos se preguntan todos: "¿Cuánto se ha vendido? ¿Mi bien vale lo mismo?"

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — ¿mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio.

**Pregunta mágica**: "¿Quién conocéis en su entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`,
    script: `Consejo método — El post-R1 sistemático es la CLAVE. 5 puertas después de cada R1 = 15-25 puertas por semana sin esfuerzo adicional.`,
    objectif: `🎯 3 bienes en venta seleccionados, 13 puertas tocadas, 3 contactos cualificados, 1 colaborador registrado`,
  },

  19: {
    title: `PIGE Legal — Segunda oleada de prospección SMS`,
    description: `Tu sesión PIGE Legal del día — 30 minutos para enviar mensajes ciblados y personalizados sobre los anuncios.

**El principio:** Envías mensajes a propietarios de bienes que has identificado en las plataformas (Idealista, Fotocasa, Milanuncios...). Los propietarios te devuelven la llamada en el día — y tú, coges el R1.

**Tu método (30 min crono):**
1. **Muy temprano por la mañana** (7h-8h30): escanea los anuncios de tu sector en Idealista, Fotocasa, Milanuncios...
2. Selecciona 5-8 bienes que correspondan a tus búsquedas de compradores
3. Redacta un mensaje corto, personalizado, con el nombre del propietario:
   "Hola [Nombre], soy [Tu nombre], asesor inmobiliario en [sector]. Trabajo con compradores muy motivados que buscan exactamente este tipo de bien. ¿Estarías abierto a un intercambio rápido?"
4. Envía tus mensajes ANTES de las 9h — así, los vendedores te devuelven la llamada en el día
5. Cuando un propietario te llame: **si no estás delante de tu ordenador**, calma un momento para devolverle la llamada estando tranquilo. **Nunca hagas la llamada PIGE sin estar delante del anuncio correcto.** Vuelve a pedir la información básica del bien y el precio, para tenerlos a la vista durante tu llamada de vuelta a la hora convenida.

Cada respuesta = un R1 potencial en el día.`,
    script: `Consejo método — Varía tus mensajes a cada oleada. Los vecinos de bienes vendidos = cible ultra-receptiva al FOMO. En cuanto un propietario responda, llama en el minuto para fijar el R1.`,
    objectif: `🎯 15 SMS segmentados enviados, 4 respuestas positivas, 2 R1 fijados`,
  },

  20: {
    title: `Inter-agencias — Desbloquear tus bienes invendidos`,
    description: `Hoy: solicita las inter-agencias para ir a buscar visitas sobre los bienes en los que no logras bajar el precio.

1. Haz tu búsqueda en los sitios de anuncios con los mismos criterios objetivos que tu bien
2. Busca bienes similares en los sitios de anuncios en un radio de 5km
3. Encuentra los bienes por debajo del precio del tuyo
4. Envía un mensaje a los colegas: "Hola, tengo un bien similar al su en [sector]. Tengo compradores serios que han visitado su bien o uno similar. El propietario está abierto a ofertas razonables aunque no quiera bajar el precio público. ¿Estaríais abiertos a un inter-agencia? 50/50 si venta."
5. Espera que los colegas te devuelvan la llamada
6. Programa las visitas

Proponles venir con los compradores serios que estaban interesados por su bien similar, explicando que el propietario quiere bajar pero que no quiere bajar el precio público. La idea es venir en visita y hacer una oferta razonable.

50/50 si venta. Ventaja: te ayuda a trabajar el precio o incluso a hacer tu venta.`,
    script: `Consejo método — El inter-agencia es tu solución para los bienes invendidos. Un colega con un comprador caliente = una venta potencial. Sé transparente sobre la estrategia de precios con tu colega.`,
    objectif: `🎯 5 colegas contactados, 2 respuestas positivas, 1 visita inter-agencia programada`,
  },

  21: {
    title: `Colaboradores — Ciber a anticuarios/vaciado de casas`,
    description: `Cuando se vacía una casa de arriba abajo, nunca es para redecorar: es porque la casa va a ser vendida. Generalmente tras un fallecimiento (sucesión) o una marcha a residencia.

**Tu script**:
"Veo a menudo tus camiones en el sector. Acompaño a muchas familias en sucesión y a menudo me preguntan quién puede vaciar la casa limpiamente. Me gustaría recomendarte sistemáticamente. Y cuando vacíes una casa que vaya a ser puesta en venta, propónles conocerme. Yo me ocupo de todo: estimación, notaría, visitas. Tocas el 6% vía Propertips."

Encuentra 2 empresas de vaciado o anticuarios en tu sector.

El anticuario es a menudo el PRIMER prestador llamado, a veces incluso antes que el notario. Si te recomienda en ese momento, tienes un 90% de probabilidades de tomar el mandato sin competencia.`,
    script: `Consejo método — El feedback sistemático después de cada puesta en relación = un colaborador motivado al 200%. El "café estratégico" mensual es obligatorio.`,
    objectif: `🎯 2 nuevos colaboradores originales contactados, 1 partenariado concluido mínimo`,
  },

  22: {
    title: `Contacto terreno — Calles con carteles de la competencia`,
    description: `Elige una calle donde aún no hayas pasado este trimestre.

Selecciona 3 bienes en venta en tu herramienta interna en esta zona o muy cerca.

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — ¿mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio.

**Pregunta mágica**: "¿Quién conocéis en su entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`,
    script: `Consejo método — Cada puerta tocada = un contacto registrado en el CRM. Propón sistemáticamente una estimación patrimonial — es tu misión primera.`,
    objectif: `🎯 5 puertas post-R1 por cada R1, 1 estimación espontánea mínimo`,
  },

  23: {
    title: `Informe local inmobiliario — Actualización y nuevos contactos`,
    description: `Tu informe local sigue estando al día (te sirve 1 a 2 meses). Hoy, combínalo con terreno cerca de bienes en venta.

1. Genera tu informe local con la herramienta interna (3 min máx)
2. envíalo a los contactos de este sector
3. Selecciona 2-3 bienes en venta en tu herramienta interna en una calle o muy cerca
4. ""Aquí está mi informe actualizado del sector. Los precios han evolucionado bastante desde mi paso...""
5. Aprovecha para discutir con ellos y proponer una estimación patrimonial o registrarles como colaboradores.

Cada informe enviado = un contacto caliente + una prueba de tu expertise.

💡 **Este informe te servirá 1 a 2 meses.** Guárdalo preciosamente. La próxima vez que la acción "informe local" vuelva, no necesitas regenerarlo — irás al terreno cerca de bienes en venta (búsqueda compradores) Y propondrás este mismo informe ya detallado. Una piedra dos pájaros.`,
    script: `Consejo método — La actualización mensual del informe local crea una cita regular con tus contactos. Esperan tu informe como se espera el periódico de la tarde.`,
    objectif: `🎯 1 informe actualizado, 5 antiguos contactos recontactados, 5 nuevos propietarios, 1 R1 mínimo`,
  },

  24: {
    title: `Estimación patrimonial ofrecida — Palanca "Búsqueda comprador activa"`,
    description: `Estás buscando activamente un comprador para un bien en este sector? Perfecto, es tu palanca.

Imprime tu flyer: "Búsqueda comprador activa en este sector — Estimación ofrecida para los vecinos".

Toca en las 10 puertas.

"He oído decir que hay un bien en venta en este sector, ¿habéis oído hablar de él? Estoy en búsqueda muy activa de un comprador para mis clientes. Propongo a los propietarios de la calle una estimación patrimonial totalmente ofrecida. Y es que esa es la base misma de mi profesión: aportar una información fiable a los habitantes de mi sector."

Dale el flyer a cada puerta. Incluso sin proyecto inmediato: "Guardad mi tarjeta, puede servir dentro de 6 meses".

Cada estimación ofrecida = un futuro mandato.`,
    script: `Consejo método — La constancia es la clave. Cada día de terreno acumula contactos, credibilidad y mandatos futuros. Tus scripts y memorandos están a tu disposición.`,
    objectif: `🎯 10 puertas tocadas, 4 estimaciones ofrecidas, 3 contactos cualificados`,
  },

  25: {
    title: `Colaboradores — Ciber a farmacéuticos del barrio`,
    description: `El farmacéutico es uno de los últimos comercios de proximidad donde se confía. Es el primero en saber de los "accidentes de vida" que desencadenan una venta: gran edad, separación, nacimiento.

**Tu script** (fuera de horas punta, 14h-15h):
"Soy [Tu nombre], asesor inmobiliario aquí en el barrio. En mi profesión, acompaño a menudo a personas que deben vender su bien tras un cambio de vida. Si uno de tus pacientes te confía que está preocupado por la gestión de su casa, dale simplemente mi tarjeta. Me ocupo de todo con total suavidad. Tocas el 6% vía Propertips."

**Importante**: No cibles solo al titular. Los preparadores pasan el mayor tiempo charlando con los clientes.

El farmacéutico tiene una relación de confianza absoluta. Si dice "Id a ver [Tu nombre]", ya habéis ganado el 80% de la confianza.`,
    script: `Consejo método — Tus scripts y memorandos de formación están a tu disposición. Lanza un challenge para motivar a tus colaboradores activos.`,
    objectif: `🎯 5 colaboradores reforzados con regalo, 1 nuevo colaborador original contactado`,
  },

  26: {
    title: `Contacto terreno — Ronda de la calle tras cada venta`,
    description: `Cible las calles donde tus competidores tienen carteles "En venta".

Selecciona 2 bienes en venta en tu herramienta interna en esta calle o muy cerca.

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — ¿mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio.

**Pregunta mágica**: "¿Quién conocéis en su entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`,
    script: `Consejo método — La pregunta mágica a cada puerta = recomendaciones que nunca tendrías de otra forma. Un solo flyer basta.`,
    objectif: `🎯 2 bienes en venta seleccionados, 10 puertas tocadas, 1 R1 estimación mínimo`,
  },

  27: {
    title: `Comerciantes — Rutina + nuevos contactos`,
    description: `Pasa a ver a tus 5 comerciantes partners.

Flyers frescos (VENDIDO + EN VENTA + QR code), noticias del barrio, inclusión de los clientes que esperan.

**Consejo**: Incluye sistemáticamente a los clientes que esperan. Habla del mercado, pregunta si conocen el valor de su bien. Es tu método de prospección más natural.

Lanza un challenge entre tus comerciantes partners: "El que me haga más contactos cualificados este mes gana una cena para dos en el [mejor restaurante del barrio]".

Retira los flyers viejos (+3 semanas / 1 mes).`,
    script: `Consejo método — Los agradecimientos mensuales crean expectación. Los comerciantes se preguntan "¿seré de los agradecidos este mes?" = motivación para hablar de ti activamente.`,
    objectif: `🎯 5 comerciantes revisitados, balance mensual hecho, 3 contactos cualificados`,
  },

  28: {
    title: `Contacto terreno — Conquista completa de una calle`,
    description: `Acabas de vender un bien? ¡Felicidades! Ahora, toca en las 10 puertas de la calle con un flyer "VENDIDO en el sector".

Aprovecha tu reciente éxito.

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — ¿mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio.

**Pregunta mágica**: "¿Quién conocéis en su entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`,
    script: `Consejo método — El post-R1 sistemático es la CLAVE. 5 puertas después de cada R1 = 15-25 puertas por semana sin esfuerzo adicional.`,
    objectif: `🎯 3 bienes en venta seleccionados, 13 puertas tocadas, 3 contactos cualificados`,
  },

  29: {
    title: `Estimación patrimonial ofrecida — Palanca "Bien vendido" (M2)`,
    description: `Tienes un bien EN VENTA en una calle? Úsalo como palanca.

Imprime tu flyer con el bien EN VENTA (foto, precio, sector) y "Estimación ofrecida para los vecinos — conozco a los compradores de este sector".

Toca en las 10 puertas.

"He oído decir que hay un bien en venta en este sector, ¿habéis oído hablar de él? Organizo las visitas este fin de semana y conozco a los compradores del sector. Propongo a los propietarios de la calle una estimación patrimonial totalmente ofrecida. Y es que esa es la base misma de mi profesión: aportar una información fiable a los habitantes de mi sector."

Dale el flyer a cada puerta. Incluso sin proyecto inmediato: "Guardad mi tarjeta, puede servir dentro de 6 meses".

Cada estimación ofrecida = un futuro mandato.`,
    script: `Consejo método — El flyer es tu palanca: crea credibilidad. Toca con confianza, eres el asesor del sector. Objetivo: dar el máximo de estimaciones patrimoniales ofrecidas.`,
    objectif: `🎯 10 puertas tocadas, 3 estimaciones ofrecidas, 2 contactos cualificados`,
  },

  30: {
    title: `Colaboradores — Ciber a peluqueros de perros`,
    description: `El propietario de un perro trata a su animal como a un miembro de la familia. Mientras Médor se arregla, el dueño habla de su vida: la mudanza, la separación, el agrandamiento.

**Tu script** (desenfadado, sin traje):
"¡Hola! Soy [Tu nombre], asesor inmobiliario por aquí. Entras en casa de la gente todo el día, creas un vínculo súper fuerte. Cuando un cliente te diga que se muda o que busca más grande, deslícele mi nombre. Por cada venta que se haga gracias a ti, tocas el 6% de mis honorarios. Y dirijo a todos mis nuevos compradores con perros hacia ti!"

¡Lleva a tu perro si tienes uno!

El peluquero tiene infos "frescas" y ultra-locales. La postura es amistosa, comunitaria. Si te gustan los animales, ya tienes un punto común enorme.`,
    script: `Consejo método — Los colaboradores subexplotados (tienda de cocinass, anticuarios...) a menudo tienen contactos de mejor calidad que los colaboradores clásicos.`,
    objectif: `🎯 2 colaboradores contactados, 1 partenariado concluido mínimo`,
  },

  31: {
    title: `Inter-agencias — Sesión semanal`,
    description: `Sesión inter-agencias semanal.

1. Identifica tus bienes invendidos (sin visita desde 15 días o precio bloqueado)
2. Busca bienes similares en los sitios de anuncios en un radio de 5km
3. Encuentra los bienes por debajo del precio del tuyo
4. Envía un mensaje a los colegas: "Hola, tengo un bien similar al su en [sector]. Tengo compradores serios que han visitado su bien o uno similar. El propietario está abierto a ofertas razonables aunque no quiera bajar el precio público. ¿Estaríais abiertos a un inter-agencia? 50/50 si venta."
5. Espera que los colegas te devuelvan la llamada
6. Programa las visitas

Programa las visitas.

El inter-agencia desbloquea las situaciones bloqueadas y te ayuda a trabajar el precio.`,
    script: `Consejo método — El inter-agencia semanal debe convertirse en un hábito. Un bien invendido = un mandato que pierde credibilidad cada día. El inter-agencia = nuevos compradores sin esfuerzo de prospección.`,
    objectif: `🎯 4 bienes analizados, 6 colegas contactados, 2 visitas programadas`,
  },

  32: {
    title: `Informe local inmobiliario — Expansión a nuevo sector`,
    description: `Genera un informe local para un NUEVO sector adyacente. La ocasión de extender tu territorio.

1. Genera tu informe local con la herramienta interna (3 min máx)
2. envíalo a los contactos de este nuevo sector
3. Selecciona 2-3 bienes en venta en tu herramienta en esta zona
4. ""Aquí está mi informe sobre [sector adyacente]. El mercado es muy dinámico en este momento...""
5. Aprovecha para discutir con ellos y proponer una estimación patrimonial o registrarles como colaboradores.

Cada informe enviado = un contacto caliente + una prueba de tu expertise.

💡 **Este informe te servirá 1 a 2 meses.** Guárdalo preciosamente. La próxima vez que la acción "informe local" vuelva, no necesitas regenerarlo — irás al terreno cerca de bienes en venta (búsqueda compradores) Y propondrás este mismo informe ya detallado. Una piedra dos pájaros.`,
    script: `Consejo método — El informe local es una máquina de R1. Prueba tu expertise, aporta un valor concreto al propietario, y te da una razón natural de recontactar.`,
    objectif: `🎯 1 informe trimestral generado, 15 antiguos contactos recontactados, 10 nuevos, 2 R1 mínimo`,
  },

  33: {
    title: `Contacto terreno — Post-R1 sistemático`,
    description: `Conquista de una calle completa CON post-R1 sistemático.

Selecciona 3 bienes en venta en tu herramienta. Toca en el bien + 10 vecinos.

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — ¿mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio.

**Pregunta mágica**: "¿Quién conocéis en su entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`,
    script: `Consejo método — Cada puerta tocada = un contacto registrado en el CRM. Propón sistemáticamente una estimación patrimonial — es tu misión primera.`,
    objectif: `🎯 3 bienes en venta seleccionados, 13 puertas tocadas, 3 contactos cualificados, 1 colaborador registrado`,
  },

  34: {
    title: `PIGE Legal — Ciber preciso por criterios`,
    description: `Tu sesión PIGE Legal del día — 30 minutos para enviar mensajes ciblados y personalizados sobre los anuncios.

**El principio:** Envías mensajes a propietarios de bienes que has identificado en las plataformas (Idealista, Fotocasa, Milanuncios...). Los propietarios te devuelven la llamada en el día — y tú, coges el R1.

**Tu método (30 min crono):**
1. **Muy temprano por la mañana** (7h-8h30): escanea los anuncios de tu sector en Idealista, Fotocasa, Milanuncios...
2. Selecciona 5-8 bienes que correspondan a tus búsquedas de compradores
3. Redacta un mensaje corto, personalizado, con el nombre del propietario:
   "Hola [Nombre], soy [Tu nombre], asesor inmobiliario en [sector]. Trabajo con compradores muy motivados que buscan exactamente este tipo de bien. ¿Estarías abierto a un intercambio rápido?"
4. Envía tus mensajes ANTES de las 9h — así, los vendedores te devuelven la llamada en el día
5. Cuando un propietario te llame: **si no estás delante de tu ordenador**, calma un momento para devolverle la llamada estando tranquilo. **Nunca hagas la llamada PIGE sin estar delante del anuncio correcto.** Vuelve a pedir la información básica del bien y el precio, para tenerlos a la vista durante tu llamada de vuelta a la hora convenida.

Cada respuesta = un R1 potencial en el día.`,
    script: `Consejo método — El ciber preciso lo cambia todo. Un propietario desde hace 5 años quiere saber "¿cuánto he ganado?". Segmenta, personaliza, convierte.`,
    objectif: `🎯 15 reintentos enviados, 3 respuestas positivas, 1 R1 fijado`,
  },

  35: {
    title: `Comerciantes — Gamificación con tus partners`,
    description: `Pasa a ver a tus 5 comerciantes partners.

Flyers frescos (VENDIDO + EN VENTA + QR code), noticias del barrio, inclusión de los clientes que esperan.

**Consejo**: Incluye sistemáticamente a los clientes que esperan. Habla del mercado, pregunta si conocen el valor de su bien. Es tu método de prospección más natural.

**Y sobre todo**: agradece a tus 2 mejores comerciantes colaboradores de este mes. Un pequeño regalo, una palabra sincera delante de sus colegas. El éxito debe verse.

Retira los flyers viejos (+3 semanas / 1 mes).`,
    script: `Consejo método — La rutina semanal con los comerciantes crea constancia. Los comerciantes se convierten en tus relés. ¡No olvides nunca el QR code en tus flyers!`,
    objectif: `🎯 5 comerciantes revisitados, 2 agradecidos, 3 contactos cualificados`,
  },

  36: {
    title: `Estimación patrimonial ofrecida — Palanca "En venta" (M2)`,
    description: `Tienes un bien VENDIDO en una calle? Perfecto.

Imprime un flyer:
→ "VENDIDO — [Sector] — Estimación ofrecida para los vecinos"

Toca en las 10 puertas.

"Acabo de vender en este sector, tengo compradores en espera. Vuestros vecinos han vendido, el mercado se mueve en esta calle. Propongo a los propietarios de la calle una estimación patrimonial totalmente ofrecida. Y es que esa es la base misma de mi profesión: aportar una información fiable a los habitantes de mi sector."

Dale el flyer a cada puerta. Incluso sin proyecto inmediato: "Guardad mi tarjeta, puede servir dentro de 6 meses".

Cada estimación ofrecida = un futuro mandato.`,
    script: `Consejo método — Rotación de las 3 palancas: Bien vendido / En venta / Búsqueda comprador. Cada palanca funciona diferente según el sector y el momento. Prueba, observa, ajusta.`,
    objectif: `🎯 10 puertas tocadas, 4 estimaciones ofrecidas, 2 contactos cualificados`,
  },

  37: {
    title: `Colaboradores — Diversificar con colaboradores originales`,
    description: `Hoy: refuerza los lazos con tus colaboradores existentes.

Pasa por tus 5 mejores colaboradores con un pequeño regalo y las novedades del mercado.

"Pasaba por aquí, quería saber cómo te va el mes, ¿la gente tiene proyectos de renovación en este momento? ¿Cómo está el mercado? ¡He hablado de ti esta semana!"

El feedback es obligatorio: en cuanto se haga una puesta en relación, mantenlo al corriente de CADA etapa.

"Café estratégico" mensual con cada colaborador. No vengas a preguntar "¿tienes un mandato?" — ven a hablar del mercado. El feedback sistemático después de cada puesta en relación = un colaborador motivado al 200%.`,
    script: `Consejo método — El feedback sistemático después de cada puesta en relación = un colaborador motivado al 200%. El "café estratégico" mensual es obligatorio.`,
    objectif: `🎯 3 colaboradores agradecidos en persona con regalo, 2 carteles verificados`,
  },

  38: {
    title: `Inter-agencias — Sesión optimizada`,
    description: `Sesión inter-agencias semanal optimizada.

1. Analiza tus resultados de las semanas anteriores: ¿qué colegas han respondido mejor? Priorízalos.
2. Busca bienes similares en los sitios de anuncios en un radio de 5km
3. Encuentra los bienes por debajo del precio del tuyo
4. Envía un mensaje a los colegas: "Hola, tengo un bien similar al su en [sector]. Tengo compradores serios que han visitado su bien o uno similar. El propietario está abierto a ofertas razonables aunque no quiera bajar el precio público. ¿Estaríais abiertos a un inter-agencia? 50/50 si venta."
5. Espera que los colegas te devuelvan la llamada
6. Programa las visitas

Programa las visitas.

El inter-agencia debe convertirse en un canal regular de venta, no solo una solución de último recurso.`,
    script: `Consejo método — Analiza tus resultados de inter-agencia. Dobla los esfuerzos en lo que funciona, ajusta lo que se atasque. El inter-agencia puede representar el 20-30% de tus ventas si lo sistematizas.`,
    objectif: `🎯 5 bienes analizados, 8 colegas contactados, 3 visitas programadas`,
  },

  39: {
    title: `Contacto terreno — Calle con transacción reciente`,
    description: `Nuevo trimestre, nuevas calles que conquistar.

Selecciona 3 bienes en venta en tu herramienta interna en esta calle o muy cerca.

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — ¿mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio.

**Pregunta mágica**: "¿Quién conocéis en su entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`,
    script: `Consejo método — La pregunta mágica a cada puerta = recomendaciones que nunca tendrías de otra forma. Un solo flyer basta.`,
    objectif: `🎯 5 puertas post-R1 por cada R1, 1 estimación espontánea mínimo`,
  },

  40: {
    title: `Contacto terreno — Calle entera + post-R1 sistemático`,
    description: `Tú dominas tu sector principal. Es hora de extender tu territorio.

Selecciona 3 bienes en venta en tu herramienta en esta zona adyacente.

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — ¿mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio.

**Pregunta mágica**: "¿Quién conocéis en su entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`,
    script: `Consejo método — El post-R1 sistemático es la CLAVE. 5 puertas después de cada R1 = 15-25 puertas por semana sin esfuerzo adicional.`,
    objectif: `🎯 2 bienes en venta seleccionados, 10 puertas tocadas, 1 R1 estimación mínimo`,
  },

  41: {
    title: `PIGE Legal — Reintento de los no respondedores`,
    description: `Tu sesión PIGE Legal del día — 30 minutos para enviar mensajes ciblados y personalizados sobre los anuncios.

**El principio:** Envías mensajes a propietarios de bienes que has identificado en las plataformas (Idealista, Fotocasa, Milanuncios...). Los propietarios te devuelven la llamada en el día — y tú, coges el R1.

**Tu método (30 min crono):**
1. **Muy temprano por la mañana** (7h-8h30): escanea los anuncios de tu sector en Idealista, Fotocasa, Milanuncios...
2. Selecciona 5-8 bienes que correspondan a tus búsquedas de compradores
3. Redacta un mensaje corto, personalizado, con el nombre del propietario:
   "Hola [Nombre], soy [Tu nombre], asesor inmobiliario en [sector]. Trabajo con compradores muy motivados que buscan exactamente este tipo de bien. ¿Estarías abierto a un intercambio rápido?"
4. Envía tus mensajes ANTES de las 9h — así, los vendedores te devuelven la llamada en el día
5. Cuando un propietario te llame: **si no estás delante de tu ordenador**, calma un momento para devolverle la llamada estando tranquilo. **Nunca hagas la llamada PIGE sin estar delante del anuncio correcto.** Vuelve a pedir la información básica del bien y el precio, para tenerlos a la vista durante tu llamada de vuelta a la hora convenida.

Cada respuesta = un R1 potencial en el día.`,
    script: `Consejo método — La PIGE Legal es ultra-potente porque el propietario TE llama a ti. Envía muy temprano por la mañana para que los vendedores llamen en el día. Nunca hagas la llamada sin estar delante del anuncio correcto.`,
    objectif: `🎯 5-8 mensajes enviados en 30 min, 2-3 respuestas en el día, 1 R1 fijado`,
  },

  42: {
    title: `Comerciantes — Rutina + agradecer a tus mejores colaboradores`,
    description: `Pasa a ver a tus 5 comerciantes partners.

Flyers frescos (VENDIDO + EN VENTA + QR code), noticias del barrio, inclusión de los clientes que esperan.

**Consejo**: Incluye sistemáticamente a los clientes que esperan. Habla del mercado, pregunta si conocen el valor de su bien. Es tu método de prospección más natural.

**Balance mensual**: ¿quién ha entregado este mes? Agradece a los activos, reintenta a los inactivos con entusiasmo.

Retira los flyers viejos (+3 semanas / 1 mes).`,
    script: `Consejo método — Cada nuevo comerciante = un nuevo relé. El panadero ve a todo el mundo, el peluquero lo oye todo. Tu red de comerciantes es un activo que crece cada semana.`,
    objectif: `🎯 5 comerciantes revisitados, 10 flyers depositados, 1 nuevo contacto`,
  },

  43: {
    title: `Estimación patrimonial ofrecida — Palanca "Búsqueda comprador" (M2)`,
    description: `Estás buscando activamente un comprador para un bien en este sector? Perfecto, es tu palanca.

Imprime tu flyer: "Búsqueda comprador activa en este sector — Estimación ofrecida para los vecinos".

Toca en las 10 puertas.

"He oído decir que hay un bien en venta en este sector, ¿habéis oído hablar de él? Estoy en búsqueda muy activa de un comprador para mis clientes. Propongo a los propietarios de la calle una estimación patrimonial totalmente ofrecida. Y es que esa es la base misma de mi profesión: aportar una información fiable a los habitantes de mi sector."

Dale el flyer a cada puerta. Incluso sin proyecto inmediato: "Guardad mi tarjeta, puede servir dentro de 6 meses".

Cada estimación ofrecida = un futuro mandato.`,
    script: `Consejo método — La constancia es la clave. Cada día de terreno acumula contactos, credibilidad y mandatos futuros. Tus scripts y memorandos están a tu disposición.`,
    objectif: `🎯 10 puertas tocadas, 4 estimaciones ofrecidas, 3 contactos cualificados`,
  },

  44: {
    title: `Colaboradores — Ciber a conserjes/pequeños sindicatos`,
    description: `Lanza un challenge entre tus colaboradores: "El que me haga más puestas en relación cualificadas este mes, le invito a cenar al mejor restaurante del barrio".

Hoy, encuentra 1 NUEVO colaborador ORIGINAL que nunca hayas abordado. Aquí tienes ideas:
• **Cocinero** — El cliente duda en firmar un presupuesto de 15 000€ si no sabe si va a recuperar el dinero en la venta
• **Chatarrero/brocante** — Cuando se vacía una casa de arriba abajo, es porque va a ser vendida (sucesión, residencia)
• **Farmacéutico** — El confidente del barrio, sabe quién se va a residencia o quién se separa
• **Peluquero de perros** — Los dueños hablan de su vida mientras Médor se arregla

Tus scripts detallados para cada colaborador están en tus memorandos de formación.`,
    script: `Consejo método — Tus scripts y memorandos de formación están a tu disposición. Lanza un challenge para motivar a tus colaboradores activos.`,
    objectif: `🎯 2 nuevos colaboradores originales contactados, 1 partenariado concluido mínimo`,
  },

  45: {
    title: `Contacto terreno — Expansión en zona adyacente`,
    description: `Elige una calle que no conozcas bien.

Selecciona 2 bienes en venta en tu herramienta interna en esta calle o muy cerca.

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — ¿mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio.

**Pregunta mágica**: "¿Quién conocéis en su entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`,
    script: `Consejo método — Cada puerta tocada = un contacto registrado en el CRM. Propón sistemáticamente una estimación patrimonial — es tu misión primera.`,
    objectif: `🎯 3 bienes en venta seleccionados, 13 puertas tocadas, 3 contactos cualificados`,
  },

  46: {
    title: `Informe local inmobiliario — Informe trimestral completo`,
    description: `Genera tu informe local trimestral COMPLETO. Este informe cubre los 3 últimos meses de evolución de precios, transacciones, tendencias.

1. Genera tu informe local con la herramienta interna (3 min máx)
2. envíalo a TODOS los contactos que ya han recibido un informe (actualización)
3. Cible 10 nuevos propietarios
4. ""Aquí está mi informe trimestral sobre la evolución del mercado en su barrio. Las cifras son muy elocuentes...""
5. Aprovecha para discutir con ellos y proponer una estimación patrimonial o registrarles como colaboradores.

Cada informe enviado = un contacto caliente + una prueba de tu expertise.

💡 **Este informe te servirá 1 a 2 meses.** Guárdalo preciosamente. La próxima vez que la acción "informe local" vuelva, no necesitas regenerarlo — irás al terreno cerca de bienes en venta (búsqueda compradores) Y propondrás este mismo informe ya detallado. Una piedra dos pájaros.`,
    script: `Consejo método — La actualización mensual del informe local crea una cita regular con tus contactos. Esperan tu informe como se espera el periódico de la tarde.`,
    objectif: `🎯 1 informe generado, 20 contactos recontactados, 5 nuevos, 2 R1 mínimo`,
  },

  47: {
    title: `Contacto terreno — Calle inexplorada (T2)`,
    description: `Acabas de hacer un R1 o una estimación? Perfecto. Antes de irte, toca en las 5 puertas de alrededor.

Aprovecha que ya estás en la calle.

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — ¿mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio.

**Pregunta mágica**: "¿Quién conocéis en su entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`,
    script: `Consejo método — La pregunta mágica a cada puerta = recomendaciones que nunca tendrías de otra forma. Un solo flyer basta.`,
    objectif: `🎯 3 bienes en venta seleccionados, 13 puertas tocadas, 3 contactos cualificados, 1 colaborador registrado`,
  },

  48: {
    title: `Inter-agencias — Sesión de seguimiento`,
    description: `Sesión inter-agencias: seguimiento de las visitas de la semana anterior + nuevas propuestas.

1. Llama a los colegas que hicieron visitas la semana pasada → feedback, ¿ofertas?
2. Busca bienes similares en los sitios de anuncios en un radio de 5km
3. Encuentra los bienes por debajo del precio del tuyo
4. Envía un mensaje a los colegas: "Hola, tengo un bien similar al su en [sector]. Tengo compradores serios que han visitado su bien o uno similar. El propietario está abierto a ofertas razonables aunque no quiera bajar el precio público. ¿Estaríais abiertos a un inter-agencia? 50/50 si venta."
5. Espera que los colegas te devuelvan la llamada
6. Programa las visitas

Programa las visitas de la semana entrante.

El inter-agencia merece su lugar en tu agenda semanal, como un R1 o un R2.`,
    script: `Consejo método — El inter-agencia es tu solución para los bienes invendidos. Un colega con un comprador caliente = una venta potencial. Sé transparente sobre la estrategia de precios con tu colega.`,
    objectif: `🎯 Balance mensual hecho, 6 colegas contactados, 4 visitas programadas para el mes próximo`,
  },

  49: {
    title: `Comerciantes — Cierre del trimestre`,
    description: `Pasa a ver a tus 5 comerciantes partners.

Flyers frescos (VENDIDO + EN VENTA + QR code), noticias del barrio, inclusión de los clientes que esperan.

**Consejo**: Incluye sistemáticamente a los clientes que esperan. Habla del mercado, pregunta si conocen el valor de su bien. Es tu método de prospección más natural.

Presenta tus objetivos del T2 a tus comerciantes. Deben sentir que progresas.

Retira los flyers viejos (+3 semanas / 1 mes).`,
    script: `Consejo método — Los agradecimientos mensuales crean expectación. Los comerciantes se preguntan "¿seré de los agradecidos este mes?" = motivación para hablar de ti activamente.`,
    objectif: `🎯 5 comerciantes revisitados, 1 nuevo comerciante, 2 contactos cualificados`,
  },

  50: {
    title: `Estimación patrimonial ofrecida — Palanca "Bien vendido" (M3)`,
    description: `Tienes un bien EN VENTA en una calle? Úsalo como palanca.

Imprime tu flyer con el bien EN VENTA (foto, precio, sector) y "Estimación ofrecida para los vecinos — conozco a los compradores de este sector".

Toca en las 10 puertas.

"He oído decir que hay un bien en venta en este sector, ¿habéis oído hablar de él? Organizo las visitas este fin de semana y conozco a los compradores del sector. Propongo a los propietarios de la calle una estimación patrimonial totalmente ofrecida. Y es que esa es la base misma de mi profesión: aportar una información fiable a los habitantes de mi sector."

Dale el flyer a cada puerta. Incluso sin proyecto inmediato: "Guardad mi tarjeta, puede servir dentro de 6 meses".

Cada estimación ofrecida = un futuro mandato.`,
    script: `Consejo método — El flyer es tu palanca: crea credibilidad. Toca con confianza, eres el asesor del sector. Objetivo: dar el máximo de estimaciones patrimoniales ofrecidas.`,
    objectif: `🎯 10 puertas tocadas, 3 estimaciones ofrecidas, 2 contactos cualificados`,
  },

  51: {
    title: `Colaboradores — Ciber a diagnosticadores DPE`,
    description: `El tienda de cocinas es el primero en enterarse del proyecto de vida. Un propietario que quiere vender se dice: "Si redo la cocina, venderé más caro". Va a ver al tienda de cocinas ANTES que al agente inmobiliario.

**Tu script**:
"Te propongo un partenariado para transformar tus presupuestos dormidos en ventas. Cuando un cliente duda en firmar porque tiene un proyecto de venta, habla de mí. Hago la estimación, aconsejo sobre la rentabilidad de las obras, y si el vendedor no hace las obras, presento tus planos 3D a todos mis compradores. Tocas el 6% de mi comisión vía Propertips."

Encuentra 2 tienda de cocinass en tu sector. ¡Adelante!

El tienda de cocinas está bloqueado: el cliente duda en firmar un presupuesto de 15 000€. Te conviertes en su salvador aportando claridad sobre la plusvalía.`,
    script: `Consejo método — Los colaboradores subexplotados (tienda de cocinass, anticuarios...) a menudo tienen contactos de mejor calidad que los colaboradores clásicos.`,
    objectif: `🎯 5 colaboradores reforzados con regalo, 1 nuevo colaborador original contactado`,
  },

  52: {
    title: `Contacto terreno — Post-R1 sistemático (T2)`,
    description: `Un bien ha pasado a "Bajo oferta" o "Vendido" en una calle? Es la ocasión ideal.

Los vecinos se preguntan todos: "¿Cuánto se ha vendido? ¿Mi bien vale lo mismo?"

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — ¿mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio.

**Pregunta mágica**: "¿Quién conocéis en su entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`,
    script: `Consejo método — El post-R1 sistemático es la CLAVE. 5 puertas después de cada R1 = 15-25 puertas por semana sin esfuerzo adicional.`,
    objectif: `🎯 5 puertas post-R1 por cada R1, 1 estimación espontánea mínimo`,
  },

  53: {
    title: `Informe local inmobiliario — Especial inversores`,
    description: `Genera un informe local especial "mercado de inversores".

1. Genera tu informe local con la herramienta interna (3 min máx)
2. envíalo a tus contactos inversores
3. Cible a propietarios multi-bienes y potenciales inversores
4. ""Aquí está mi informe especial inversores del sector. Los rendimientos han evolucionado, tengo algunas oportunidades interesantes que presentaros...""
5. Aprovecha para discutir con ellos y proponer una estimación patrimonial o registrarles como colaboradores.

Cada informe enviado = un contacto caliente + una prueba de tu expertise.

💡 **Este informe te servirá 1 a 2 meses.** Guárdalo preciosamente. La próxima vez que la acción "informe local" vuelva, no necesitas regenerarlo — irás al terreno cerca de bienes en venta (búsqueda compradores) Y propondrás este mismo informe ya detallado. Una piedra dos pájaros.`,
    script: `Consejo método — El informe local es una máquina de R1. Prueba tu expertise, aporta un valor concreto al propietario, y te da una razón natural de recontactar.`,
    objectif: `🎯 1 informe local generado, 10 propietarios contactados, 5 direcciones emails recogidas, 1 R1 estimación mínimo`,
  },

  54: {
    title: `Contacto terreno — Calle entera (T2-S5)`,
    description: `Elige una calle donde aún no hayas pasado este trimestre.

Selecciona 3 bienes en venta en tu herramienta interna en esta zona o muy cerca.

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — ¿mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio.

**Pregunta mágica**: "¿Quién conocéis en su entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`,
    script: `Consejo método — Cada puerta tocada = un contacto registrado en el CRM. Propón sistemáticamente una estimación patrimonial — es tu misión primera.`,
    objectif: `🎯 2 bienes en venta seleccionados, 10 puertas tocadas, 1 R1 estimación mínimo`,
  },

  55: {
    title: `Inter-agencias — Balance y planificación`,
    description: `Última sesión inter-agencias del mes. Balance + planificación.

1. Balance del mes: ¿cuántas ventas en inter-agencia? ¿Qué colegas son los más activos?
2. Busca bienes similares en los sitios de anuncios en un radio de 5km
3. Encuentra los bienes por debajo del precio del tuyo
4. Envía un mensaje a los colegas: "Hola, tengo un bien similar al su en [sector]. Tengo compradores serios que han visitado su bien o uno similar. El propietario está abierto a ofertas razonables aunque no quiera bajar el precio público. ¿Estaríais abiertos a un inter-agencia? 50/50 si venta."
5. Espera que los colegas te devuelvan la llamada
6. Programa las visitas

Planifica las inter-agencias del mes próximo.

El inter-agencia es ahora un canal de venta regular.`,
    script: `Consejo método — El inter-agencia semanal debe convertirse en un hábito. Un bien invendido = un mandato que pierde credibilidad cada día. El inter-agencia = nuevos compradores sin esfuerzo de prospección.`,
    objectif: `🎯 5 colegas contactados, 2 respuestas positivas, 1 visita inter-agencia programada`,
  },

  56: {
    title: `Comerciantes — Rutina T2-S1`,
    description: `Pasa a ver a tus 5 comerciantes partners.

Flyers frescos (VENDIDO + EN VENTA + QR code), noticias del barrio, inclusión de los clientes que esperan.

**Consejo**: Incluye sistemáticamente a los clientes que esperan. Habla del mercado, pregunta si conocen el valor de su bien. Es tu método de prospección más natural.

Encuentra también 1 nuevo comerciante esta semana. Piensa en:
• Florista (bodas, sucesiones = mudanzas)
• Panadero (todo el mundo va, las comadres del pueblo)
• Peluquero (las confidencias cara a cara)

Retira los flyers viejos (+3 semanas / 1 mes).`,
    script: `Consejo método — La rutina semanal con los comerciantes crea constancia. Los comerciantes se convierten en tus relés. ¡No olvides nunca el QR code en tus flyers!`,
    objectif: `🎯 5 comerciantes revisitados, balance mensual hecho, 3 contactos cualificados`,
  },

  57: {
    title: `Estimación patrimonial ofrecida — Palanca "En venta" (M3)`,
    description: `Tienes un bien VENDIDO en una calle? Perfecto.

Imprime un flyer:
→ "VENDIDO — [Sector] — Estimación ofrecida para los vecinos"

Toca en las 10 puertas.

"Acabo de vender en este sector, tengo compradores en espera. Vuestros vecinos han vendido, el mercado se mueve en esta calle. Propongo a los propietarios de la calle una estimación patrimonial totalmente ofrecida. Y es que esa es la base misma de mi profesión: aportar una información fiable a los habitantes de mi sector."

Dale el flyer a cada puerta. Incluso sin proyecto inmediato: "Guardad mi tarjeta, puede servir dentro de 6 meses".

Cada estimación ofrecida = un futuro mandato.`,
    script: `Consejo método — Rotación de las 3 palancas: Bien vendido / En venta / Búsqueda comprador. Cada palanca funciona diferente según el sector y el momento. Prueba, observa, ajusta.`,
    objectif: `🎯 10 puertas tocadas, 4 estimaciones ofrecidas, 2 contactos cualificados`,
  },

  58: {
    title: `Colaboradores — Conciergerie Airbnb y gestores`,
    description: `Cuando se vacía una casa de arriba abajo, nunca es para redecorar: es porque la casa va a ser vendida. Generalmente tras un fallecimiento (sucesión) o una marcha a residencia.

**Tu script**:
"Veo a menudo tus camiones en el sector. Acompaño a muchas familias en sucesión y a menudo me preguntan quién puede vaciar la casa limpiamente. Me gustaría recomendarte sistemáticamente. Y cuando vacíes una casa que vaya a ser puesta en venta, propónles conocerme. Yo me ocupo de todo: estimación, notaría, visitas. Tocas el 6% vía Propertips."

Encuentra 2 empresas de vaciado o anticuarios en tu sector.

El anticuario es a menudo el PRIMER prestador llamado, a veces incluso antes que el notario. Si te recomienda en ese momento, tienes un 90% de probabilidades de tomar el mandato sin competencia.`,
    script: `Consejo método — El feedback sistemático después de cada puesta en relación = un colaborador motivado al 200%. El "café estratégico" mensual es obligatorio.`,
    objectif: `🎯 2 colaboradores contactados, 1 partenariado concluido mínimo`,
  },

  59: {
    title: `Contacto terreno post-R1 — Capitalizar en cada cita`,
    description: `Cible las calles donde tus competidores tienen carteles "En venta".

Selecciona 2 bienes en venta en tu herramienta interna en esta calle o muy cerca.

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — ¿mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio.

**Pregunta mágica**: "¿Quién conocéis en su entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`,
    script: `Consejo método — La pregunta mágica a cada puerta = recomendaciones que nunca tendrías de otra forma. Un solo flyer basta.`,
    objectif: `🎯 3 bienes en venta seleccionados, 13 puertas tocadas, 3 contactos cualificados`,
  },

  60: {
    title: `Informe local inmobiliario — Último informe del trimestre`,
    description: `Último informe local del trimestre. Genéralo, envíalo a todos tus contactos, y cible a los últimos propietarios no contactados.

1. Genera tu informe local con la herramienta interna (3 min máx)
2. envíalo a todos tus contactos (email + WhatsApp)
3. Cible a los 10 últimos propietarios de tu sector
4. ""Aquí está mi último informe del trimestre. Las cifras son muy elocuentes. Si ustedes o su entorno deseáis conocer el valor de su patrimonio...""
5. Aprovecha para discutir con ellos y proponer una estimación patrimonial o registrarles como colaboradores.

Cada informe enviado = un contacto caliente + una prueba de tu expertise.

💡 **Este informe te servirá 1 a 2 meses.** Guárdalo preciosamente. La próxima vez que la acción "informe local" vuelva, no necesitas regenerarlo — irás al terreno cerca de bienes en venta (búsqueda compradores) Y propondrás este mismo informe ya detallado. Una piedra dos pájaros.`,
    script: `Consejo método — La actualización mensual del informe local crea una cita regular con tus contactos. Esperan tu informe como se espera el periódico de la tarde.`,
    objectif: `🎯 1 informe actualizado, 5 antiguos contactos recontactados, 5 nuevos propietarios, 1 R1 mínimo`,
  },

  61: {
    title: `Contacto terreno — Anuncio de transacción reciente`,
    description: `Acabas de vender un bien? ¡Felicidades! Ahora, toca en las 10 puertas de la calle con un flyer "VENDIDO en el sector".

Aprovecha tu reciente éxito.

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — ¿mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio.

**Pregunta mágica**: "¿Quién conocéis en su entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`,
    script: `Consejo método — El post-R1 sistemático es la CLAVE. 5 puertas después de cada R1 = 15-25 puertas por semana sin esfuerzo adicional.`,
    objectif: `🎯 3 bienes en venta seleccionados, 13 puertas tocadas, 3 contactos cualificados, 1 colaborador registrado`,
  },

  62: {
    title: `Inter-agencias — Sesión T2-S1`,
    description: `Primera sesión inter-agencias del trimestre 2.

1. Nuevos bienes invendidos del T1 que reintentar, nuevos colegas que contactar
2. Busca bienes similares en los sitios de anuncios en un radio de 5km
3. Encuentra los bienes por debajo del precio del tuyo
4. Envía un mensaje a los colegas: "Hola, tengo un bien similar al su en [sector]. Tengo compradores serios que han visitado su bien o uno similar. El propietario está abierto a ofertas razonables aunque no quiera bajar el precio público. ¿Estaríais abiertos a un inter-agencia? 50/50 si venta."
5. Espera que los colegas te devuelvan la llamada
6. Programa las visitas

Programa las visitas.

El inter-agencia forma parte de tu rutina. Cada semana, 1h dedicada a los colegas = un 20-30% más de ventas.`,
    script: `Consejo método — Analiza tus resultados de inter-agencia. Dobla los esfuerzos en lo que funciona, ajusta lo que se atasque. El inter-agencia puede representar el 20-30% de tus ventas si lo sistematizas.`,
    objectif: `🎯 4 bienes analizados, 6 colegas contactados, 2 visitas programadas`,
  },

  63: {
    title: `Comerciantes — Rutina T2-S2`,
    description: `Pasa a ver a tus 5 comerciantes partners.

Flyers frescos (VENDIDO + EN VENTA + QR code), noticias del barrio, inclusión de los clientes que esperan.

**Consejo**: Incluye sistemáticamente a los clientes que esperan. Habla del mercado, pregunta si conocen el valor de su bien. Es tu método de prospección más natural.

**Novedad**: presenta también tus nuevos bienes en exclusiva a tus comerciantes. Están orgullosos de decir: "Mi asesor inmobiliario tiene un bien EXCLUSIVO en este momento, ¡es magnífico!"

Retira los flyers viejos (+3 semanas / 1 mes).`,
    script: `Consejo método — Cada nuevo comerciante = un nuevo relé. El panadero ve a todo el mundo, el peluquero lo oye todo. Tu red de comerciantes es un activo que crece cada semana.`,
    objectif: `🎯 5 comerciantes revisitados, 2 agradecidos, 3 contactos cualificados`,
  },

  64: {
    title: `Contacto terreno — Conquista de una zona inexplorada`,
    description: `Conquista de una calle completa CON post-R1 sistemático.

Selecciona 3 bienes en venta en tu herramienta. Toca en el bien + 10 vecinos.

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — ¿mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio.

**Pregunta mágica**: "¿Quién conocéis en su entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`,
    script: `Consejo método — Cada puerta tocada = un contacto registrado en el CRM. Propón sistemáticamente una estimación patrimonial — es tu misión primera.`,
    objectif: `🎯 5 puertas post-R1 por cada R1, 1 estimación espontánea mínimo`,
  },

  65: {
    title: `Estimación patrimonial ofrecida — Palanca "Búsqueda comprador" (M3)`,
    description: `Estás buscando activamente un comprador para un bien en este sector? Perfecto, es tu palanca.

Imprime tu flyer: "Búsqueda comprador activa en este sector — Estimación ofrecida para los vecinos".

Toca en las 10 puertas.

"He oído decir que hay un bien en venta en este sector, ¿habéis oído hablar de él? Estoy en búsqueda muy activa de un comprador para mis clientes. Propongo a los propietarios de la calle una estimación patrimonial totalmente ofrecida. Y es que esa es la base misma de mi profesión: aportar una información fiable a los habitantes de mi sector."

Dale el flyer a cada puerta. Incluso sin proyecto inmediato: "Guardad mi tarjeta, puede servir dentro de 6 meses".

Cada estimación ofrecida = un futuro mandato.`,
    script: `Consejo método — La constancia es la clave. Cada día de terreno acumula contactos, credibilidad y mandatos futuros. Tus scripts y memorandos están a tu disposición.`,
    objectif: `🎯 10 puertas tocadas, 4 estimaciones ofrecidas, 3 contactos cualificados`,
  },

  66: {
    title: `Colaboradores — Refuerzo de la red existente`,
    description: `El farmacéutico es uno de los últimos comercios de proximidad donde se confía. Es el primero en saber de los "accidentes de vida" que desencadenan una venta: gran edad, separación, nacimiento.

**Tu script** (fuera de horas punta, 14h-15h):
"Soy [Tu nombre], asesor inmobiliario aquí en el barrio. En mi profesión, acompaño a menudo a personas que deben vender su bien tras un cambio de vida. Si uno de tus pacientes te confía que está preocupado por la gestión de su casa, dale simplemente mi tarjeta. Me ocupo de todo con total suavidad. Tocas el 6% vía Propertips."

**Importante**: No cibles solo al titular. Los preparadores pasan el mayor tiempo charlando con los clientes.

El farmacéutico tiene una relación de confianza absoluta. Si dice "Id a ver [Tu nombre]", ya habéis ganado el 80% de la confianza.`,
    script: `Consejo método — Tus scripts y memorandos de formación están a tu disposición. Lanza un challenge para motivar a tus colaboradores activos.`,
    objectif: `🎯 3 colaboradores agradecidos en persona con regalo, 2 carteles verificados`,
  },

  67: {
    title: `PIGE Legal — Ciber avanzado`,
    description: `Tu sesión PIGE Legal del día — 30 minutos para enviar mensajes ciblados y personalizados sobre los anuncios.

**El principio:** Envías mensajes a propietarios de bienes que has identificado en las plataformas (Idealista, Fotocasa, Milanuncios...). Los propietarios te devuelven la llamada en el día — y tú, coges el R1.

**Tu método (30 min crono):**
1. **Muy temprano por la mañana** (7h-8h30): escanea los anuncios de tu sector en Idealista, Fotocasa, Milanuncios...
2. Selecciona 5-8 bienes que correspondan a tus búsquedas de compradores
3. Redacta un mensaje corto, personalizado, con el nombre del propietario:
   "Hola [Nombre], soy [Tu nombre], asesor inmobiliario en [sector]. Trabajo con compradores muy motivados que buscan exactamente este tipo de bien. ¿Estarías abierto a un intercambio rápido?"
4. Envía tus mensajes ANTES de las 9h — así, los vendedores te devuelven la llamada en el día
5. Cuando un propietario te llame: **si no estás delante de tu ordenador**, calma un momento para devolverle la llamada estando tranquilo. **Nunca hagas la llamada PIGE sin estar delante del anuncio correcto.** Vuelve a pedir la información básica del bien y el precio, para tenerlos a la vista durante tu llamada de vuelta a la hora convenida.

Cada respuesta = un R1 potencial en el día.`,
    script: `Consejo método — Varía tus mensajes a cada oleada. Los vecinos de bienes vendidos = cible ultra-receptiva al FOMO. En cuanto un propietario responda, llama en el minuto para fijar el R1.`,
    objectif: `🎯 15 SMS segmentados enviados, 4 respuestas positivas, 2 R1 fijados`,
  },

  68: {
    title: `Informe local inmobiliario — Inicio del T2`,
    description: `Primer informe del trimestre 2. Las cifras han evolucionado desde el T1.

1. Genera tu informe local con la herramienta interna (3 min máx)
2. envíalo a todos tus contactos con una nota: "¡Nuevo trimestre, nuevas cifras!"
3. Cible 10 nuevos propietarios
4. ""Aquí está mi primer informe del trimestre 2. El mercado ha evolucionado, aquí están las cifras actualizadas...""
5. Aprovecha para discutir con ellos y proponer una estimación patrimonial o registrarles como colaboradores.

Cada informe enviado = un contacto caliente + una prueba de tu expertise.

💡 **Este informe te servirá 1 a 2 meses.** Guárdalo preciosamente. La próxima vez que la acción "informe local" vuelva, no necesitas regenerarlo — irás al terreno cerca de bienes en venta (búsqueda compradores) Y propondrás este mismo informe ya detallado. Una piedra dos pájaros.`,
    script: `Consejo método — El informe local es una máquina de R1. Prueba tu expertise, aporta un valor concreto al propietario, y te da una razón natural de recontactar.`,
    objectif: `🎯 1 informe trimestral generado, 15 antiguos contactos recontactados, 10 nuevos, 2 R1 mínimo`,
  },

  69: {
    title: `Inter-agencias — Sesión T2-S2`,
    description: `Sesión inter-agencias semanal.

1. Sigue las visitas de la semana anterior, identifica nuevos bienes invendidos
2. Busca bienes similares en los sitios de anuncios en un radio de 5km
3. Encuentra los bienes por debajo del precio del tuyo
4. Envía un mensaje a los colegas: "Hola, tengo un bien similar al su en [sector]. Tengo compradores serios que han visitado su bien o uno similar. El propietario está abierto a ofertas razonables aunque no quiera bajar el precio público. ¿Estaríais abiertos a un inter-agencia? 50/50 si venta."
5. Espera que los colegas te devuelvan la llamada
6. Programa las visitas

Programa las visitas.

El inter-agencia es ahora tan natural como el terreno.`,
    script: `Consejo método — El inter-agencia es tu solución para los bienes invendidos. Un colega con un comprador caliente = una venta potencial. Sé transparente sobre la estrategia de precios con tu colega.`,
    objectif: `🎯 5 bienes analizados, 8 colegas contactados, 3 visitas programadas`,
  },

  70: {
    title: `Comerciantes — Rutina + agradecimientos (T2)`,
    description: `Pasa a ver a tus 5 comerciantes partners.

Flyers frescos (VENDIDO + EN VENTA + QR code), noticias del barrio, inclusión de los clientes que esperan.

**Consejo**: Incluye sistemáticamente a los clientes que esperan. Habla del mercado, pregunta si conocen el valor de su bien. Es tu método de prospección más natural.

Lanza un challenge entre tus comerciantes partners: "El que me haga más contactos cualificados este mes gana una cena para dos en el [mejor restaurante del barrio]".

Retira los flyers viejos (+3 semanas / 1 mes).`,
    script: `Consejo método — Los agradecimientos mensuales crean expectación. Los comerciantes se preguntan "¿seré de los agradecidos este mes?" = motivación para hablar de ti activamente.`,
    objectif: `🎯 5 comerciantes revisitados, 10 flyers depositados, 1 nuevo contacto`,
  },

  71: {
    title: `Contacto terreno — Calles con carteles de la competencia`,
    description: `Nuevo trimestre, nuevas calles que conquistar.

Selecciona 3 bienes en venta en tu herramienta interna en esta calle o muy cerca.

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — ¿mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio.

**Pregunta mágica**: "¿Quién conocéis en su entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`,
    script: `Consejo método — La pregunta mágica a cada puerta = recomendaciones que nunca tendrías de otra forma. Un solo flyer basta.`,
    objectif: `🎯 2 bienes en venta seleccionados, 10 puertas tocadas, 1 R1 estimación mínimo`,
  },

  72: {
    title: `Colaboradores — Cocinero (rotación T2)`,
    description: `El propietario de un perro trata a su animal como a un miembro de la familia. Mientras Médor se arregla, el dueño habla de su vida: la mudanza, la separación, el agrandamiento.

**Tu script** (desenfadado, sin traje):
"¡Hola! Soy [Tu nombre], asesor inmobiliario por aquí. Entras en casa de la gente todo el día, creas un vínculo súper fuerte. Cuando un cliente te diga que se muda o que busca más grande, deslícele mi nombre. Por cada venta que se haga gracias a ti, tocas el 6% de mis honorarios. Y dirijo a todos mis nuevos compradores con perros hacia ti!"

¡Lleva a tu perro si tienes uno!

El peluquero tiene infos "frescas" y ultra-locales. La postura es amistosa, comunitaria. Si te gustan los animales, ya tienes un punto común enorme.`,
    script: `Consejo método — Los colaboradores subexplotados (tienda de cocinass, anticuarios...) a menudo tienen contactos de mejor calidad que los colaboradores clásicos.`,
    objectif: `🎯 2 nuevos colaboradores originales contactados, 1 partenariado concluido mínimo`,
  },

  73: {
    title: `Informe local inmobiliario — Sector adyacente (T2)`,
    description: `Genera tu informe local para un sector adyacente que hayas empezado a explorar.

1. Genera tu informe local con la herramienta interna (3 min máx)
2. envíalo a los contactos de este sector
3. Cible 10 nuevos propietarios en esta zona
4. ""Aquí está mi informe sobre [sector adyacente]. El mercado es muy dinámico en este momento...""
5. Aprovecha para discutir con ellos y proponer una estimación patrimonial o registrarles como colaboradores.

Cada informe enviado = un contacto caliente + una prueba de tu expertise.

💡 **Este informe te servirá 1 a 2 meses.** Guárdalo preciosamente. La próxima vez que la acción "informe local" vuelva, no necesitas regenerarlo — irás al terreno cerca de bienes en venta (búsqueda compradores) Y propondrás este mismo informe ya detallado. Una piedra dos pájaros.`,
    script: `Consejo método — La actualización mensual del informe local crea una cita regular con tus contactos. Esperan tu informe como se espera el periódico de la tarde.`,
    objectif: `🎯 1 informe generado, 20 contactos recontactados, 5 nuevos, 2 R1 mínimo`,
  },

  74: {
    title: `PIGE Legal — Rotación de segmentos (T2)`,
    description: `Tu sesión PIGE Legal del día — 30 minutos para enviar mensajes ciblados y personalizados sobre los anuncios.

**El principio:** Envías mensajes a propietarios de bienes que has identificado en las plataformas (Idealista, Fotocasa, Milanuncios...). Los propietarios te devuelven la llamada en el día — y tú, coges el R1.

**Tu método (30 min crono):**
1. **Muy temprano por la mañana** (7h-8h30): escanea los anuncios de tu sector en Idealista, Fotocasa, Milanuncios...
2. Selecciona 5-8 bienes que correspondan a tus búsquedas de compradores
3. Redacta un mensaje corto, personalizado, con el nombre del propietario:
   "Hola [Nombre], soy [Tu nombre], asesor inmobiliario en [sector]. Trabajo con compradores muy motivados que buscan exactamente este tipo de bien. ¿Estarías abierto a un intercambio rápido?"
4. Envía tus mensajes ANTES de las 9h — así, los vendedores te devuelven la llamada en el día
5. Cuando un propietario te llame: **si no estás delante de tu ordenador**, calma un momento para devolverle la llamada estando tranquilo. **Nunca hagas la llamada PIGE sin estar delante del anuncio correcto.** Vuelve a pedir la información básica del bien y el precio, para tenerlos a la vista durante tu llamada de vuelta a la hora convenida.

Cada respuesta = un R1 potencial en el día.`,
    script: `Consejo método — El ciber preciso lo cambia todo. Un propietario desde hace 5 años quiere saber "¿cuánto he ganado?". Segmenta, personaliza, convierte.`,
    objectif: `🎯 15 reintentos enviados, 3 respuestas positivas, 1 R1 fijado`,
  },

  75: {
    title: `Inter-agencias — Sesión semanal (T2)`,
    description: `Sesión inter-agencias semanal (T2).

1. Sigue las visitas, identifica nuevos bienes invendidos, programa las visitas de la semana entrante
2. Busca bienes similares en los sitios de anuncios en un radio de 5km
3. Encuentra los bienes por debajo del precio del tuyo
4. Envía un mensaje a los colegas: "Hola, tengo un bien similar al su en [sector]. Tengo compradores serios que han visitado su bien o uno similar. El propietario está abierto a ofertas razonables aunque no quiera bajar el precio público. ¿Estaríais abiertos a un inter-agencia? 50/50 si venta."
5. Espera que los colegas te devuelvan la llamada
6. Programa las visitas

Programa las visitas.

Semana tras semana, el inter-agencia se convierte en un reflejo.`,
    script: `Consejo método — El inter-agencia semanal debe convertirse en un hábito. Un bien invendido = un mandato que pierde credibilidad cada día. El inter-agencia = nuevos compradores sin esfuerzo de prospección.`,
    objectif: `🎯 Balance mensual hecho, 6 colegas contactados, 4 visitas programadas para el mes próximo`,
  },

  76: {
    title: `Comerciantes — Cierre del mes y balance trimestral`,
    description: `Pasa a ver a tus 5 comerciantes partners.

Flyers frescos (VENDIDO + EN VENTA + QR code), noticias del barrio, inclusión de los clientes que esperan.

**Consejo**: Incluye sistemáticamente a los clientes que esperan. Habla del mercado, pregunta si conocen el valor de su bien. Es tu método de prospección más natural.

**Y sobre todo**: agradece a tus 2 mejores comerciantes colaboradores de este mes. Un pequeño regalo, una palabra sincera delante de sus colegas. El éxito debe verse.

Retira los flyers viejos (+3 semanas / 1 mes).`,
    script: `Consejo método — La rutina semanal con los comerciantes crea constancia. Los comerciantes se convierten en tus relés. ¡No olvides nunca el QR code en tus flyers!`,
    objectif: `🎯 5 comerciantes revisitados, 1 nuevo comerciante, 2 contactos cualificados`,
  },

  77: {
    title: `Estimación patrimonial ofrecida — Palanca "Bien vendido" (T2)`,
    description: `Tienes un bien EN VENTA en una calle? Úsalo como palanca.

Imprime tu flyer con el bien EN VENTA (foto, precio, sector) y "Estimación ofrecida para los vecinos — conozco a los compradores de este sector".

Toca en las 10 puertas.

"He oído decir que hay un bien en venta en este sector, ¿habéis oído hablar de él? Organizo las visitas este fin de semana y conozco a los compradores del sector. Propongo a los propietarios de la calle una estimación patrimonial totalmente ofrecida. Y es que esa es la base misma de mi profesión: aportar una información fiable a los habitantes de mi sector."

Dale el flyer a cada puerta. Incluso sin proyecto inmediato: "Guardad mi tarjeta, puede servir dentro de 6 meses".

Cada estimación ofrecida = un futuro mandato.`,
    script: `Consejo método — El flyer es tu palanca: crea credibilidad. Toca con confianza, eres el asesor del sector. Objetivo: dar el máximo de estimaciones patrimoniales ofrecidas.`,
    objectif: `🎯 10 puertas tocadas, 3 estimaciones ofrecidas, 2 contactos cualificados`,
  },

  78: {
    title: `Contacto terreno — Ronda de la calle tras cada venta`,
    description: `Tú dominas tu sector principal. Es hora de extender tu territorio.

Selecciona 3 bienes en venta en tu herramienta en esta zona adyacente.

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — ¿mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio.

**Pregunta mágica**: "¿Quién conocéis en su entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`,
    script: `Consejo método — El post-R1 sistemático es la CLAVE. 5 puertas después de cada R1 = 15-25 puertas por semana sin esfuerzo adicional.`,
    objectif: `🎯 3 bienes en venta seleccionados, 13 puertas tocadas, 3 contactos cualificados`,
  },

  79: {
    title: `Colaboradores — Chatarrero/vaciado (rotación T2)`,
    description: `Hoy: refuerza los lazos con tus colaboradores existentes.

Pasa por tus 5 mejores colaboradores con un pequeño regalo y las novedades del mercado.

"Pasaba por aquí, quería saber cómo te va el mes, ¿la gente tiene proyectos de renovación en este momento? ¿Cómo está el mercado? ¡He hablado de ti esta semana!"

El feedback es obligatorio: en cuanto se haga una puesta en relación, mantenlo al corriente de CADA etapa.

"Café estratégico" mensual con cada colaborador. No vengas a preguntar "¿tienes un mandato?" — ven a hablar del mercado. El feedback sistemático después de cada puesta en relación = un colaborador motivado al 200%.`,
    script: `Consejo método — El feedback sistemático después de cada puesta en relación = un colaborador motivado al 200%. El "café estratégico" mensual es obligatorio.`,
    objectif: `🎯 5 colaboradores reforzados con regalo, 1 nuevo colaborador original contactado`,
  },

  80: {
    title: `Informe local inmobiliario — Actualización mensual`,
    description: `Genera tu informe local actualizado para el mes en curso.

1. Genera tu informe local con la herramienta interna (3 min máx)
2. envíalo a todos tus contactos
3. Cible 10 nuevos propietarios
4. ""Aquí está mi informe actualizado del mes. Las cifras han evolucionado...""
5. Aprovecha para discutir con ellos y proponer una estimación patrimonial o registrarles como colaboradores.

Cada informe enviado = un contacto caliente + una prueba de tu expertise.

💡 **Este informe te servirá 1 a 2 meses.** Guárdalo preciosamente. La próxima vez que la acción "informe local" vuelva, no necesitas regenerarlo — irás al terreno cerca de bienes en venta (búsqueda compradores) Y propondrás este mismo informe ya detallado. Una piedra dos pájaros.`,
    script: `Consejo método — El informe local es una máquina de R1. Prueba tu expertise, aporta un valor concreto al propietario, y te da una razón natural de recontactar.`,
    objectif: `🎯 1 informe local generado, 10 propietarios contactados, 5 direcciones emails recogidas, 1 R1 estimación mínimo`,
  },

  81: {
    title: `PIGE Legal — Rotación segmento (T2)`,
    description: `Tu sesión PIGE Legal del día — 30 minutos para enviar mensajes ciblados y personalizados sobre los anuncios.

**El principio:** Envías mensajes a propietarios de bienes que has identificado en las plataformas (Idealista, Fotocasa, Milanuncios...). Los propietarios te devuelven la llamada en el día — y tú, coges el R1.

**Tu método (30 min crono):**
1. **Muy temprano por la mañana** (7h-8h30): escanea los anuncios de tu sector en Idealista, Fotocasa, Milanuncios...
2. Selecciona 5-8 bienes que correspondan a tus búsquedas de compradores
3. Redacta un mensaje corto, personalizado, con el nombre del propietario:
   "Hola [Nombre], soy [Tu nombre], asesor inmobiliario en [sector]. Trabajo con compradores muy motivados que buscan exactamente este tipo de bien. ¿Estarías abierto a un intercambio rápido?"
4. Envía tus mensajes ANTES de las 9h — así, los vendedores te devuelven la llamada en el día
5. Cuando un propietario te llame: **si no estás delante de tu ordenador**, calma un momento para devolverle la llamada estando tranquilo. **Nunca hagas la llamada PIGE sin estar delante del anuncio correcto.** Vuelve a pedir la información básica del bien y el precio, para tenerlos a la vista durante tu llamada de vuelta a la hora convenida.

Cada respuesta = un R1 potencial en el día.`,
    script: `Consejo método — La PIGE Legal es ultra-potente porque el propietario TE llama a ti. Envía muy temprano por la mañana para que los vendedores llamen en el día. Nunca hagas la llamada sin estar delante del anuncio correcto.`,
    objectif: `🎯 5-8 mensajes enviados en 30 min, 2-3 respuestas en el día, 1 R1 fijado`,
  },

  82: {
    title: `Inter-agencias — Balance mensual`,
    description: `Última inter-agencia del mes. Balance + planificación.

1. Balance: ¿cuántas ventas este mes? ¿Qué colegas han entregado?
2. Busca bienes similares en los sitios de anuncios en un radio de 5km
3. Encuentra los bienes por debajo del precio del tuyo
4. Envía un mensaje a los colegas: "Hola, tengo un bien similar al su en [sector]. Tengo compradores serios que han visitado su bien o uno similar. El propietario está abierto a ofertas razonables aunque no quiera bajar el precio público. ¿Estaríais abiertos a un inter-agencia? 50/50 si venta."
5. Espera que los colegas te devuelvan la llamada
6. Programa las visitas

Planifica el mes próximo con ambición.

El inter-agencia = un 20-30% de tus ventas. Mantén este canal precioso.`,
    script: `Consejo método — Analiza tus resultados de inter-agencia. Dobla los esfuerzos en lo que funciona, ajusta lo que se atasque. El inter-agencia puede representar el 20-30% de tus ventas si lo sistematizas.`,
    objectif: `🎯 5 colegas contactados, 2 respuestas positivas, 1 visita inter-agencia programada`,
  },

  83: {
    title: `Comerciantes — Actualización flyers + novedades del mes`,
    description: `Pasa a ver a tus 5 comerciantes partners.

Flyers frescos (VENDIDO + EN VENTA + QR code), noticias del barrio, inclusión de los clientes que esperan.

**Consejo**: Incluye sistemáticamente a los clientes que esperan. Habla del mercado, pregunta si conocen el valor de su bien. Es tu método de prospección más natural.

**Balance mensual**: ¿quién ha entregado este mes? Agradece a los activos, reintenta a los inactivos con entusiasmo.

Retira los flyers viejos (+3 semanas / 1 mes).`,
    script: `Consejo método — Cada nuevo comerciante = un nuevo relé. El panadero ve a todo el mundo, el peluquero lo oye todo. Tu red de comerciantes es un activo que crece cada semana.`,
    objectif: `🎯 5 comerciantes revisitados, balance mensual hecho, 3 contactos cualificados`,
  },

  84: {
    title: `Estimación patrimonial ofrecida — Palanca "En venta" (T2)`,
    description: `Tienes un bien VENDIDO en una calle? Perfecto.

Imprime un flyer:
→ "VENDIDO — [Sector] — Estimación ofrecida para los vecinos"

Toca en las 10 puertas.

"Acabo de vender en este sector, tengo compradores en espera. Vuestros vecinos han vendido, el mercado se mueve en esta calle. Propongo a los propietarios de la calle una estimación patrimonial totalmente ofrecida. Y es que esa es la base misma de mi profesión: aportar una información fiable a los habitantes de mi sector."

Dale el flyer a cada puerta. Incluso sin proyecto inmediato: "Guardad mi tarjeta, puede servir dentro de 6 meses".

Cada estimación ofrecida = un futuro mandato.`,
    script: `Consejo método — Rotación de las 3 palancas: Bien vendido / En venta / Búsqueda comprador. Cada palanca funciona diferente según el sector y el momento. Prueba, observa, ajusta.`,
    objectif: `🎯 10 puertas tocadas, 4 estimaciones ofrecidas, 2 contactos cualificados`,
  },

  85: {
    title: `Contacto terreno — Conquista completa de una calle`,
    description: `Elige una calle que no conozcas bien.

Selecciona 2 bienes en venta en tu herramienta interna en esta calle o muy cerca.

**En la dirección exacta del bien en venta:**
"Estoy en búsqueda muy activa para compradores que buscan absolutamente ESTE sector, XX habitaciones y XX m². He oído decir que hay un bien en venta que podría corresponder actualmente en venta en esta calle, ¿sabría de cuál se trata?"

Si es la puerta correcta, haz preguntas subjetivas sobre el bien, habla del precio, y coge la cita para una primera visita: "No puedo decentemente descubrir el bien al mismo tiempo que mis compradores — ¿mejor por la mañana o por la tarde?"

**En los vecinos (las 10 puertas alrededor):**
Ahí, pasas a la estimación patrimonial ofrecida. No estás ahí para vender — aportas una info fiable sobre el valor de su patrimonio.

**Pregunta mágica**: "¿Quién conocéis en su entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`,
    script: `Consejo método — Cada puerta tocada = un contacto registrado en el CRM. Propón sistemáticamente una estimación patrimonial — es tu misión primera.`,
    objectif: `🎯 3 bienes en venta seleccionados, 13 puertas tocadas, 3 contactos cualificados, 1 colaborador registrado`,
  },

  86: {
    title: `Colaboradores — Farmacéutico (rotación T2)`,
    description: `Lanza un challenge entre tus colaboradores: "El que me haga más puestas en relación cualificadas este mes, le invito a cenar al mejor restaurante del barrio".

Hoy, encuentra 1 NUEVO colaborador ORIGINAL que nunca hayas abordado. Aquí tienes ideas:
• **Cocinero** — El cliente duda en firmar un presupuesto de 15 000€ si no sabe si va a recuperar el dinero en la venta
• **Chatarrero/brocante** — Cuando se vacía una casa de arriba abajo, es porque va a ser vendida (sucesión, residencia)
• **Farmacéutico** — El confidente del barrio, sabe quién se va a residencia o quién se separa
• **Peluquero de perros** — Los dueños hablan de su vida mientras Médor se arregla

Tus scripts detallados para cada colaborador están en tus memorandos de formación.`,
    script: `Consejo método — Tus scripts y memorandos de formación están a tu disposición. Lanza un challenge para motivar a tus colaboradores activos.`,
    objectif: `🎯 2 colaboradores contactados, 1 partenariado concluido mínimo`,
  },

  87: {
    title: `Informe local inmobiliario — Nuevo formato`,
    description: `Varía los formatos de tu informe local para mantener el interés.

1. Genera tu informe local con la herramienta interna (3 min máx)
2. envíalo a tus contactos con una nota sobre la novedad
3. Cible 10 nuevos propietarios
4. ""Aquí está mi informe de este mes en un nuevo formato. ¡Descubrid las cifras de su barrio!""
5. Aprovecha para discutir con ellos y proponer una estimación patrimonial o registrarles como colaboradores.

Cada informe enviado = un contacto caliente + una prueba de tu expertise.

💡 **Este informe te servirá 1 a 2 meses.** Guárdalo preciosamente. La próxima vez que la acción "informe local" vuelva, no necesitas regenerarlo — irás al terreno cerca de bienes en venta (búsqueda compradores) Y propondrás este mismo informe ya detallado. Una piedra dos pájaros.`,
    script: `Consejo método — La actualización mensual del informe local crea una cita regular con tus contactos. Esperan tu informe como se espera el periódico de la tarde.`,
    objectif: `🎯 1 informe actualizado, 5 antiguos contactos recontactados, 5 nuevos propietarios, 1 R1 mínimo`,
  },

  88: {
    title: `PIGE Legal — Último segmento del mes`,
    description: `Tu sesión PIGE Legal del día — 30 minutos para enviar mensajes ciblados y personalizados sobre los anuncios.

**El principio:** Envías mensajes a propietarios de bienes que has identificado en las plataformas (Idealista, Fotocasa, Milanuncios...). Los propietarios te devuelven la llamada en el día — y tú, coges el R1.

**Tu método (30 min crono):**
1. **Muy temprano por la mañana** (7h-8h30): escanea los anuncios de tu sector en Idealista, Fotocasa, Milanuncios...
2. Selecciona 5-8 bienes que correspondan a tus búsquedas de compradores
3. Redacta un mensaje corto, personalizado, con el nombre del propietario:
   "Hola [Nombre], soy [Tu nombre], asesor inmobiliario en [sector]. Trabajo con compradores muy motivados que buscan exactamente este tipo de bien. ¿Estarías abierto a un intercambio rápido?"
4. Envía tus mensajes ANTES de las 9h — así, los vendedores te devuelven la llamada en el día
5. Cuando un propietario te llame: **si no estás delante de tu ordenador**, calma un momento para devolverle la llamada estando tranquilo. **Nunca hagas la llamada PIGE sin estar delante del anuncio correcto.** Vuelve a pedir la información básica del bien y el precio, para tenerlos a la vista durante tu llamada de vuelta a la hora convenida.

Cada respuesta = un R1 potencial en el día.`,
    script: `Consejo método — Varía tus mensajes a cada oleada. Los vecinos de bienes vendidos = cible ultra-receptiva al FOMO. En cuanto un propietario responda, llama en el minuto para fijar el R1.`,
    objectif: `🎯 15 SMS segmentados enviados, 4 respuestas positivas, 2 R1 fijados`,
  },

  89: {
    title: `Inter-agencias — Desbloquear tus bienes invendidos`,
    description: `Hoy: solicita las inter-agencias para ir a buscar visitas sobre los bienes en los que no logras bajar el precio.

1. Haz tu búsqueda en los sitios de anuncios con los mismos criterios objetivos que tu bien
2. Busca bienes similares en los sitios de anuncios en un radio de 5km
3. Encuentra los bienes por debajo del precio del tuyo
4. Envía un mensaje a los colegas: "Hola, tengo un bien similar al su en [sector]. Tengo compradores serios que han visitado su bien o uno similar. El propietario está abierto a ofertas razonables aunque no quiera bajar el precio público. ¿Estaríais abiertos a un inter-agencia? 50/50 si venta."
5. Espera que los colegas te devuelvan la llamada
6. Programa las visitas

Proponles venir con los compradores serios que estaban interesados por su bien similar, explicando que el propietario quiere bajar pero que no quiere bajar el precio público. La idea es venir en visita y hacer una oferta razonable.

50/50 si venta. Ventaja: te ayuda a trabajar el precio o incluso a hacer tu venta.`,
    script: `Consejo método — El inter-agencia es tu solución para los bienes invendidos. Un colega con un comprador caliente = una venta potencial. Sé transparente sobre la estrategia de precios con tu colega.`,
    objectif: `🎯 4 bienes analizados, 6 colegas contactados, 2 visitas programadas`,
  },

  90: {
    title: `Comerciantes — Rutina semanal`,
    description: `Pasa a ver a tus 5 comerciantes partners.

Flyers frescos (VENDIDO + EN VENTA + QR code), noticias del barrio, inclusión de los clientes que esperan.

**Consejo**: Incluye sistemáticamente a los clientes que esperan. Habla del mercado, pregunta si conocen el valor de su bien. Es tu método de prospección más natural.

Presenta tus objetivos del T2 a tus comerciantes. Deben sentir que progresas.

Retira los flyers viejos (+3 semanas / 1 mes).`,
    script: `Consejo método — Los agradecimientos mensuales crean expectación. Los comerciantes se preguntan "¿seré de los agradecidos este mes?" = motivación para hablar de ti activamente.`,
    objectif: `🎯 5 comerciantes revisitados, 2 agradecidos, 3 contactos cualificados`,
  },
};
