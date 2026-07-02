// Banco de frases — nivel básico. Frases completas y útiles, no palabras sueltas.
const PHRASES = [
  // Saludos y presentaciones
  { cat: "Saludos", en: "Hi, how are you?", es: "Hola, ¿cómo estás?" },
  { cat: "Saludos", en: "Good morning, nice to meet you.", es: "Buenos días, mucho gusto." },
  { cat: "Saludos", en: "My name is Carlos.", es: "Mi nombre es Carlos." },
  { cat: "Saludos", en: "I'm from Colombia.", es: "Soy de Colombia." },
  { cat: "Saludos", en: "Nice to meet you too.", es: "Mucho gusto también." },
  { cat: "Saludos", en: "How was your day?", es: "¿Cómo estuvo tu día?" },
  { cat: "Saludos", en: "See you later!", es: "¡Nos vemos luego!" },
  { cat: "Saludos", en: "Have a nice day!", es: "¡Que tengas un buen día!" },
  { cat: "Saludos", en: "Long time no see!", es: "¡Tanto tiempo sin verte!" },
  { cat: "Saludos", en: "What do you do for a living?", es: "¿A qué te dedicas?" },

  // Frases de supervivencia
  { cat: "Supervivencia", en: "I don't understand.", es: "No entiendo." },
  { cat: "Supervivencia", en: "Can you speak slower, please?", es: "¿Puedes hablar más despacio, por favor?" },
  { cat: "Supervivencia", en: "Can you repeat that, please?", es: "¿Puedes repetir eso, por favor?" },
  { cat: "Supervivencia", en: "How do you say this in English?", es: "¿Cómo se dice esto en inglés?" },
  { cat: "Supervivencia", en: "What does that mean?", es: "¿Qué significa eso?" },
  { cat: "Supervivencia", en: "I'm still learning English.", es: "Todavía estoy aprendiendo inglés." },
  { cat: "Supervivencia", en: "Sorry, my English is not very good yet.", es: "Perdón, mi inglés no es muy bueno todavía." },
  { cat: "Supervivencia", en: "Can you help me, please?", es: "¿Puedes ayudarme, por favor?" },
  { cat: "Supervivencia", en: "I need help with this.", es: "Necesito ayuda con esto." },
  { cat: "Supervivencia", en: "No problem, don't worry.", es: "No hay problema, no te preocupes." },

  // Día a día
  { cat: "Día a día", en: "I wake up at six in the morning.", es: "Me despierto a las seis de la mañana." },
  { cat: "Día a día", en: "I'm going to the store.", es: "Voy a la tienda." },
  { cat: "Día a día", en: "What time is it?", es: "¿Qué hora es?" },
  { cat: "Día a día", en: "I'm running late.", es: "Voy tarde." },
  { cat: "Día a día", en: "I'm very tired today.", es: "Estoy muy cansado hoy." },
  { cat: "Día a día", en: "It's very hot today.", es: "Hace mucho calor hoy." },
  { cat: "Día a día", en: "I like this a lot.", es: "Me gusta mucho esto." },
  { cat: "Día a día", en: "I don't like coffee.", es: "No me gusta el café." },
  { cat: "Día a día", en: "Where is the bathroom?", es: "¿Dónde está el baño?" },
  { cat: "Día a día", en: "I have to go now.", es: "Me tengo que ir ahora." },
  { cat: "Día a día", en: "Wait a moment, please.", es: "Espera un momento, por favor." },
  { cat: "Día a día", en: "I'll call you later.", es: "Te llamo más tarde." },
  { cat: "Día a día", en: "What are you doing this weekend?", es: "¿Qué vas a hacer este fin de semana?" },
  { cat: "Día a día", en: "Let me think about it.", es: "Déjame pensarlo." },
  { cat: "Día a día", en: "That sounds good to me.", es: "Eso me parece bien." },

  // Restaurante y comida
  { cat: "Comida", en: "A table for two, please.", es: "Una mesa para dos, por favor." },
  { cat: "Comida", en: "Can I see the menu, please?", es: "¿Puedo ver el menú, por favor?" },
  { cat: "Comida", en: "I would like a coffee, please.", es: "Quisiera un café, por favor." },
  { cat: "Comida", en: "What do you recommend?", es: "¿Qué me recomiendas?" },
  { cat: "Comida", en: "The check, please.", es: "La cuenta, por favor." },
  { cat: "Comida", en: "This is delicious!", es: "¡Esto está delicioso!" },
  { cat: "Comida", en: "I'm allergic to peanuts.", es: "Soy alérgico al maní." },
  { cat: "Comida", en: "Can I pay with card?", es: "¿Puedo pagar con tarjeta?" },
  { cat: "Comida", en: "I'm very hungry.", es: "Tengo mucha hambre." },
  { cat: "Comida", en: "Water without ice, please.", es: "Agua sin hielo, por favor." },

  // Viajes
  { cat: "Viajes", en: "Where is the airport?", es: "¿Dónde está el aeropuerto?" },
  { cat: "Viajes", en: "How much does it cost?", es: "¿Cuánto cuesta?" },
  { cat: "Viajes", en: "I have a reservation.", es: "Tengo una reservación." },
  { cat: "Viajes", en: "What time does the flight leave?", es: "¿A qué hora sale el vuelo?" },
  { cat: "Viajes", en: "I lost my luggage.", es: "Perdí mi equipaje." },
  { cat: "Viajes", en: "Can you take me to this address?", es: "¿Me puede llevar a esta dirección?" },
  { cat: "Viajes", en: "Is it far from here?", es: "¿Queda lejos de aquí?" },
  { cat: "Viajes", en: "I'm here on vacation.", es: "Estoy aquí de vacaciones." },
  { cat: "Viajes", en: "Where can I take a taxi?", es: "¿Dónde puedo tomar un taxi?" },
  { cat: "Viajes", en: "Can I have the wifi password?", es: "¿Me das la contraseña del wifi?" },

  // Trabajo y tecnología
  { cat: "Trabajo", en: "I work with computers.", es: "Trabajo con computadores." },
  { cat: "Trabajo", en: "I have a meeting at ten.", es: "Tengo una reunión a las diez." },
  { cat: "Trabajo", en: "Can we schedule a call?", es: "¿Podemos agendar una llamada?" },
  { cat: "Trabajo", en: "I'll send you an email.", es: "Te envío un correo." },
  { cat: "Trabajo", en: "Let me share my screen.", es: "Déjame compartir mi pantalla." },
  { cat: "Trabajo", en: "I'm working on a new project.", es: "Estoy trabajando en un proyecto nuevo." },
  { cat: "Trabajo", en: "Sorry, I was on mute.", es: "Perdón, estaba en silencio." },
  { cat: "Trabajo", en: "Can you explain that again?", es: "¿Puedes explicar eso otra vez?" },
  { cat: "Trabajo", en: "I agree with you.", es: "Estoy de acuerdo contigo." },
  { cat: "Trabajo", en: "I'll finish it tomorrow.", es: "Lo termino mañana." },

  // Opiniones y sentimientos
  { cat: "Opiniones", en: "I think it's a good idea.", es: "Creo que es una buena idea." },
  { cat: "Opiniones", en: "I'm not sure about that.", es: "No estoy seguro de eso." },
  { cat: "Opiniones", en: "In my opinion, it's better this way.", es: "En mi opinión, es mejor así." },
  { cat: "Opiniones", en: "I'm very happy today.", es: "Estoy muy feliz hoy." },
  { cat: "Opiniones", en: "Don't worry, everything will be fine.", es: "No te preocupes, todo va a estar bien." },
  { cat: "Opiniones", en: "That's a great question.", es: "Esa es una gran pregunta." },
  { cat: "Opiniones", en: "I really like learning English.", es: "Me gusta mucho aprender inglés." },
  { cat: "Opiniones", en: "It's more difficult than I thought.", es: "Es más difícil de lo que pensé." },
  { cat: "Opiniones", en: "Practice makes perfect.", es: "La práctica hace al maestro." },
  { cat: "Opiniones", en: "Little by little, I'm getting better.", es: "Poco a poco estoy mejorando." },

  // Preguntas útiles
  { cat: "Preguntas", en: "Where are you from?", es: "¿De dónde eres?" },
  { cat: "Preguntas", en: "How old are you?", es: "¿Cuántos años tienes?" },
  { cat: "Preguntas", en: "Do you have any brothers or sisters?", es: "¿Tienes hermanos o hermanas?" },
  { cat: "Preguntas", en: "What do you like to do in your free time?", es: "¿Qué te gusta hacer en tu tiempo libre?" },
  { cat: "Preguntas", en: "Have you been to Colombia?", es: "¿Has estado en Colombia?" },
  { cat: "Preguntas", en: "What kind of music do you like?", es: "¿Qué tipo de música te gusta?" },
  { cat: "Preguntas", en: "Can I ask you a question?", es: "¿Te puedo hacer una pregunta?" },
  { cat: "Preguntas", en: "What's your favorite food?", es: "¿Cuál es tu comida favorita?" },
  { cat: "Preguntas", en: "Do you speak Spanish?", es: "¿Hablas español?" },
  { cat: "Preguntas", en: "What's the weather like today?", es: "¿Cómo está el clima hoy?" }
];

// Clips de shadowing — mini diálogos reales para escuchar y repetir.
const CLIPS = [
  { id: "c1", title: "Ordering at a café", level: "A2", text: "Hi, can I get a latte to go? — Sure, that'll be four dollars." },
  { id: "c2", title: "Weekend small talk", level: "B1", text: "So, what did you get up to this weekend? — Not much, just relaxed at home." },
  { id: "c3", title: "Making plans with a friend", level: "B1", text: "Are you free on Friday? — Yeah, let's grab dinner around seven." },
  { id: "c4", title: "Meeting someone new", level: "A1", text: "Hi, I'm Carlos, nice to meet you. — Nice to meet you too, where are you from?" },
  { id: "c5", title: "Asking for directions", level: "A2", text: "Excuse me, how do I get to the station? — Go straight and turn left at the corner." },
  { id: "c6", title: "At work", level: "B1", text: "Can we schedule a quick call tomorrow? — Sure, does ten in the morning work for you?" }
];
