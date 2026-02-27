// ─────────────────────────────────────────────────────────────────────
// AULA PREESCOLAR - BANCO DE ACTIVIDADES (PLAN 2022 - FASE 2)
// Actualizado según Nueva Escuela Mexicana (NEM) - SEP
// ─────────────────────────────────────────────────────────────────────

const ACTIVIDADES_PRECARGADAS = [
    // ═══════════════════════════════════════════════════════════════
    // 1. LENGUAJES (8 actividades)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 1,
        campo: 'lenguajes',
        nombre: 'El Cuento de la Semana',
        descripcion: 'Leer un cuento y hacer preguntas de comprensión. Los niños dibujan su parte favorita.',
        materiales: 'Cuento impreso, hojas blancas, crayolas',
        tiempo: 30,
        edad: '3-5 años'
    },
    {
        id: 2,
        campo: 'lenguajes',
        nombre: 'Mi Nombre en Letras',
        descripcion: 'Reconocer y trazar las letras de su nombre usando diferentes materiales.',
        materiales: 'Tarjetas con nombres, arena, palitos',
        tiempo: 25,
        edad: '4-5 años'
    },
    {
        id: 3,
        campo: 'lenguajes',
        nombre: 'Adivinanzas y Rimas',
        descripcion: 'Resolver adivinanzas simples y crear rimas con palabras cotidianas.',
        materiales: 'Tarjetas con adivinanzas, imágenes',
        tiempo: 20,
        edad: '3-5 años'
    },
    {
        id: 4,
        campo: 'lenguajes',
        nombre: 'Día de Noticias',
        descripcion: 'Cada niño comparte una noticia de su casa. Desarrolla expresión oral.',
        materiales: 'Micrófono de juguete (opcional)',
        tiempo: 30,
        edad: '4-5 años'
    },
    {
        id: 5,
        campo: 'lenguajes',
        nombre: 'Teatro de Títeres',
        descripcion: 'Crear historias usando títeres para desarrollar lenguaje y creatividad.',
        materiales: 'Títeres, telón, guion simple',
        tiempo: 40,
        edad: '4-5 años'
    },
    {
        id: 6,
        campo: 'lenguajes',
        nombre: 'Libro Viajero',
        descripcion: 'Un cuaderno que va a cada casa. Familias escriben historias con los niños.',
        materiales: 'Cuaderno, lápices, decoraciones',
        tiempo: 15,
        edad: '3-5 años'
    },
    {
        id: 7,
        campo: 'lenguajes',
        nombre: 'Canciones con Movimiento',
        descripcion: 'Aprender canciones con acciones corporales para desarrollar ritmo y lenguaje.',
        materiales: 'Reproductor de música, letras',
        tiempo: 25,
        edad: '3-5 años'
    },
    {
        id: 8,
        campo: 'lenguajes',
        nombre: 'Describir y Adivinar',
        descripcion: 'Un niño describe un objeto sin nombrarlo, otros adivinan qué es.',
        materiales: 'Objetos del aula, caja misteriosa',
        tiempo: 20,
        edad: '4-5 años'
    },

    // ═══════════════════════════════════════════════════════════════
    // 2. SABERES Y PENSAMIENTO CIENTÍFICO (8 actividades)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 9,
        campo: 'saberes',
        nombre: 'Contando en el Aula',
        descripcion: 'Contar objetos del aula y clasificarlos por color, tamaño o forma.',
        materiales: 'Bloques, botones, fichas de colores',
        tiempo: 30,
        edad: '3-5 años'
    },
    {
        id: 10,
        campo: 'saberes',
        nombre: 'Figuras en el Entorno',
        descripcion: 'Identificar figuras geométricas en objetos del salón y la escuela.',
        materiales: 'Figuras de cartón, objetos del aula',
        tiempo: 25,
        edad: '4-5 años'
    },
    {
        id: 11,
        campo: 'saberes',
        nombre: 'Patrones de Colores',
        descripcion: 'Crear y continuar patrones simples (rojo-azul-rojo-azul).',
        materiales: 'Fichas de colores, cuentas, cordones',
        tiempo: 30,
        edad: '4-5 años'
    },
    {
        id: 12,
        campo: 'saberes',
        nombre: 'Más que, Menos que',
        descripcion: 'Comparar cantidades usando objetos concretos y lenguaje matemático.',
        materiales: 'Fichas, vasos, platos, balanza',
        tiempo: 25,
        edad: '4-5 años'
    },
    {
        id: 13,
        campo: 'saberes',
        nombre: 'El Calendario del Día',
        descripcion: 'Identificar día de la semana, mes, número del día y clima.',
        materiales: 'Calendario grande, marcadores, símbolos del clima',
        tiempo: 15,
        edad: '3-5 años'
    },
    {
        id: 14,
        campo: 'saberes',
        nombre: 'Experimento: Flota o Se Hunde',
        descripcion: 'Predecir y probar qué objetos flotan. Introducción al método científico.',
        materiales: 'Recipiente con agua, objetos variados, hoja de registro',
        tiempo: 35,
        edad: '4-5 años'
    },
    {
        id: 15,
        campo: 'saberes',
        nombre: 'Medimos con Pasos',
        descripcion: 'Medir distancias y objetos usando pasos, palmadas y unidades no convencionales.',
        materiales: 'Cinta métrica, objetos para medir',
        tiempo: 30,
        edad: '4-5 años'
    },
    {
        id: 16,
        campo: 'saberes',
        nombre: 'Clasificamos Animales',
        descripcion: 'Clasificar animales por hábitat, alimentación o características.',
        materiales: 'Imágenes de animales, carteles de categorías',
        tiempo: 30,
        edad: '4-5 años'
    },

    // ═══════════════════════════════════════════════════════════════
    // 3. ÉTICA, NATURALEZA Y SOCIEDADES (7 actividades)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 17,
        campo: 'etica',
        nombre: 'Las Reglas del Salón',
        descripcion: 'Crear entre todos las reglas de convivencia del grupo.',
        materiales: 'Cartulina, marcadores, dibujos',
        tiempo: 30,
        edad: '3-5 años'
    },
    {
        id: 18,
        campo: 'etica',
        nombre: 'Cuidamos las Plantas',
        descripcion: 'Plantar semillas y observar su crecimiento. Responsabilidad y cuidado.',
        materiales: 'Vasos, tierra, semillas, agua, regadera',
        tiempo: 30,
        edad: '4-5 años'
    },
    {
        id: 19,
        campo: 'etica',
        nombre: 'Los Oficios de la Comunidad',
        descripcion: 'Conocer diferentes trabajos y su importancia para la comunidad.',
        materiales: 'Imágenes de oficios, disfraces, herramientas de juguete',
        tiempo: 35,
        edad: '4-5 años'
    },
    {
        id: 20,
        campo: 'etica',
        nombre: 'Reciclaje en el Aula',
        descripcion: 'Clasificar residuos y aprender sobre cuidado del medio ambiente.',
        materiales: 'Contenedores de reciclaje, residuos limpios, carteles',
        tiempo: 25,
        edad: '4-5 años'
    },
    {
        id: 21,
        campo: 'etica',
        nombre: 'Las Fiestas de México',
        descripcion: 'Conocer tradiciones mexicanas y su significado cultural.',
        materiales: 'Imágenes, música, materiales para manualidades',
        tiempo: 40,
        edad: '4-5 años'
    },
    {
        id: 22,
        campo: 'etica',
        nombre: 'Cómo Cuidar el Agua',
        descripcion: 'Aprender la importancia del agua y cómo no desperdiciarla.',
        materiales: 'Carteles, video educativo, experimento simple',
        tiempo: 25,
        edad: '3-5 años'
    },
    {
        id: 23,
        campo: 'etica',
        nombre: 'Emociones en el Salón',
        descripcion: 'Identificar emociones propias y de otros. Empatía y respeto.',
        materiales: 'Tarjetas con emociones, espejo, cuentos',
        tiempo: 30,
        edad: '3-5 años'
    },

    // ═══════════════════════════════════════════════════════════════
    // 4. DE LO HUMANO Y LO COMUNITARIO (7 actividades)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 24,
        campo: 'humano',
        nombre: 'Mi Familia y Yo',
        descripcion: 'Compartir sobre su familia y crear un árbol genealógico simple.',
        materiales: 'Fotos, cartulina, crayolas, pegamento',
        tiempo: 35,
        edad: '4-5 años'
    },
    {
        id: 25,
        campo: 'humano',
        nombre: 'El Rincón de la Calma',
        descripcion: 'Enseñar técnicas de respiración para regular emociones.',
        materiales: 'Cojines, peluches, música suave, botella de la calma',
        tiempo: 15,
        edad: '3-5 años'
    },
    {
        id: 26,
        campo: 'humano',
        nombre: 'Compartir es Bonito',
        descripcion: 'Juegos que fomentan el compartir, turnarse y cooperar.',
        materiales: 'Juguetes para compartir, cronómetro',
        tiempo: 30,
        edad: '3-5 años'
    },
    {
        id: 27,
        campo: 'humano',
        nombre: 'Somos Diferentes y Iguales',
        descripcion: 'Reconocer que todos somos únicos pero también tenemos cosas en común.',
        materiales: 'Espejos, dibujos, cartulinas',
        tiempo: 30,
        edad: '4-5 años'
    },
    {
        id: 28,
        campo: 'humano',
        nombre: 'Resolviendo Conflictos',
        descripcion: 'Role-playing de situaciones comunes y cómo resolverlas pacíficamente.',
        materiales: 'Tarjetas con situaciones, títeres',
        tiempo: 30,
        edad: '4-5 años'
    },
    {
        id: 29,
        campo: 'humano',
        nombre: 'Nuestras Tradiciones Familiares',
        descripcion: 'Cada niño comparte una tradición de su familia.',
        materiales: 'Fotos, objetos familiares, dibujos',
        tiempo: 35,
        edad: '4-5 años'
    },
    {
        id: 30,
        campo: 'humano',
        nombre: 'El Grupo es un Equipo',
        descripcion: 'Actividades de colaboración donde todos deben participar para lograr la meta.',
        materiales: 'Materiales variados según actividad',
        tiempo: 40,
        edad: '4-5 años'
    }
];

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.ACTIVIDADES_PRECARGADAS = ACTIVIDADES_PRECARGADAS;
    console.log('✅ ' + ACTIVIDADES_PRECARGADAS.length + ' actividades precargadas (Plan 2022 - Fase 2)');
}
