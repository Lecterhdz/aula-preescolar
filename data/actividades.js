// ─────────────────────────────────────────────────────────────────────
// AULA PREESCOLAR - BANCO DE ACTIVIDADES (30 ACTIVIDADES)
// ─────────────────────────────────────────────────────────────────────

const ACTIVIDADES_PRECARGADAS = [
    // LENGUAJE Y COMUNICACIÓN (5)
    {
        id: 1,
        campo: 'lenguaje',
        nombre: 'El Cuento de la Semana',
        descripcion: 'Leer un cuento corto y hacer preguntas de comprensión. Los niños dibujan su parte favorita.',
        materiales: 'Cuento impreso, hojas blancas, crayolas',
        tiempo: 30,
        edad: '3-5 años'
    },
    {
        id: 2,
        campo: 'lenguaje',
        nombre: 'Mi Nombre en Letras',
        descripcion: 'Reconocer y trazar las letras de su nombre usando diferentes materiales.',
        materiales: 'Tarjetas con nombres, arena, palitos',
        tiempo: 25,
        edad: '4-5 años'
    },
    {
        id: 3,
        campo: 'lenguaje',
        nombre: 'Adivinanzas Divertidas',
        descripcion: 'Resolver adivinanzas simples sobre animales y objetos cotidianos.',
        materiales: 'Tarjetas con adivinanzas, imágenes',
        tiempo: 20,
        edad: '3-5 años'
    },
    {
        id: 4,
        campo: 'lenguaje',
        nombre: 'Día de Noticias',
        descripcion: 'Cada niño comparte una noticia de su casa. Desarrolla expresión oral.',
        materiales: 'Micrófono de juguete (opcional)',
        tiempo: 30,
        edad: '4-5 años'
    },
    {
        id: 5,
        campo: 'lenguaje',
        nombre: 'Rimas y Canciones',
        descripcion: 'Aprender canciones con rimas y movimientos corporales.',
        materiales: 'Reproductor de música, letras impresas',
        tiempo: 25,
        edad: '3-5 años'
    },

    // PENSAMIENTO MATEMÁTICO (5)
    {
        id: 6,
        campo: 'pensamiento',
        nombre: 'Contando Objetos',
        descripcion: 'Contar objetos del aula y clasificarlos por color o tamaño.',
        materiales: 'Bloques, botones, fichas de colores',
        tiempo: 30,
        edad: '3-4 años'
    },
    {
        id: 7,
        campo: 'pensamiento',
        nombre: 'Figuras Geométricas',
        descripcion: 'Identificar y nombrar círculos, cuadrados y triángulos en el entorno.',
        materiales: 'Figuras de cartón, objetos del aula',
        tiempo: 25,
        edad: '4-5 años'
    },
    {
        id: 8,
        campo: 'pensamiento',
        nombre: 'Patrones de Colores',
        descripcion: 'Crear y continuar patrones simples con colores (rojo-azul-rojo-azul).',
        materiales: 'Fichas de colores, cuentas',
        tiempo: 30,
        edad: '4-5 años'
    },
    {
        id: 9,
        campo: 'pensamiento',
        nombre: 'Más que, Menos que',
        descripcion: 'Comparar cantidades usando objetos concretos.',
        materiales: 'Fichas, vasos, platos',
        tiempo: 25,
        edad: '4-5 años'
    },
    {
        id: 10,
        campo: 'pensamiento',
        nombre: 'El Calendario del Día',
        descripcion: 'Identificar el día de la semana, mes y número del día.',
        materiales: 'Calendario grande, marcadores',
        tiempo: 15,
        edad: '3-5 años'
    },

    // EXPLORACIÓN DEL MUNDO (5)
    {
        id: 11,
        campo: 'exploracion',
        nombre: 'Los Animales y Su Hábitat',
        descripcion: 'Conocer diferentes animales y dónde viven.',
        materiales: 'Imágenes de animales, mapa simple',
        tiempo: 30,
        edad: '3-5 años'
    },
    {
        id: 12,
        campo: 'exploracion',
        nombre: 'Experimento: Flota o Se Hunde',
        descripcion: 'Predecir y probar qué objetos flotan en el agua.',
        materiales: 'Recipiente con agua, objetos variados',
        tiempo: 35,
        edad: '4-5 años'
    },
    {
        id: 13,
        campo: 'exploracion',
        nombre: 'Las Partes del Cuerpo',
        descripcion: 'Identificar y nombrar las partes del cuerpo humano.',
        materiales: 'Dibujo del cuerpo, etiquetas',
        tiempo: 25,
        edad: '3-4 años'
    },
    {
        id: 14,
        campo: 'exploracion',
        nombre: 'El Clima de Hoy',
        descripcion: 'Observar y registrar el clima del día en un gráfico.',
        materiales: 'Gráfico del clima, stickers',
        tiempo: 15,
        edad: '3-5 años'
    },
    {
        id: 15,
        campo: 'exploracion',
        nombre: 'Plantamos una Semilla',
        descripcion: 'Plantar una semilla y observar su crecimiento.',
        materiales: 'Vasos, tierra, semillas, agua',
        tiempo: 30,
        edad: '4-5 años'
    },

    // EXPRESIÓN ARTÍSTICA (5)
    {
        id: 16,
        campo: 'arte',
        nombre: 'Pintura con Dedos',
        descripcion: 'Crear dibujos libres usando pintura y los dedos.',
        materiales: 'Pintura lavable, papel grande, delantales',
        tiempo: 40,
        edad: '3-5 años'
    },
    {
        id: 17,
        campo: 'arte',
        nombre: 'Collage de Texturas',
        descripcion: 'Crear un collage usando diferentes materiales (tela, papel, algodón).',
        materiales: 'Pegamento, tijeras, materiales variados',
        tiempo: 35,
        edad: '4-5 años'
    },
    {
        id: 18,
        campo: 'arte',
        nombre: 'Baile con Músicas Variadas',
        descripcion: 'Bailar al ritmo de diferentes géneros musicales.',
        materiales: 'Reproductor, música variada',
        tiempo: 25,
        edad: '3-5 años'
    },
    {
        id: 19,
        campo: 'arte',
        nombre: 'Máscaras de Animales',
        descripcion: 'Crear máscaras de animales con platos de cartón.',
        materiales: 'Platos de cartón, crayolas, palitos, elástico',
        tiempo: 45,
        edad: '4-5 años'
    },
    {
        id: 20,
        campo: 'arte',
        nombre: 'Instrumentos Musicales Caseros',
        descripcion: 'Crear instrumentos con materiales reciclados.',
        materiales: 'Botellas, arroz, globos, ligas',
        tiempo: 40,
        edad: '4-5 años'
    },

    // DESARROLLO SOCIOEMOCIONAL (5)
    {
        id: 21,
        campo: 'socioemocional',
        nombre: '¿Cómo Me Siento Hoy?',
        descripcion: 'Identificar y expresar emociones usando caritas.',
        materiales: 'Tarjetas con emociones, espejo',
        tiempo: 20,
        edad: '3-5 años'
    },
    {
        id: 22,
        campo: 'socioemocional',
        nombre: 'El Rincón de la Calma',
        descripcion: 'Enseñar técnicas de respiración para calmarse.',
        materiales: 'Cojines, peluches, música suave',
        tiempo: 15,
        edad: '3-5 años'
    },
    {
        id: 23,
        campo: 'socioemocional',
        nombre: 'Compartir es Bonito',
        descripcion: 'Juegos que fomentan el compartir y turnarse.',
        materiales: 'Juguetes para compartir',
        tiempo: 30,
        edad: '3-4 años'
    },
    {
        id: 24,
        campo: 'socioemocional',
        nombre: 'Abrazos de Amistad',
        descripcion: 'Actividad para fomentar la amistad y el respeto.',
        materiales: 'Dibujo de manos, crayolas',
        tiempo: 25,
        edad: '3-5 años'
    },
    {
        id: 25,
        campo: 'socioemocional',
        nombre: 'Resolviendo Conflictos',
        descripcion: 'Role-playing de situaciones comunes y cómo resolverlas.',
        materiales: 'Tarjetas con situaciones',
        tiempo: 30,
        edad: '4-5 años'
    },

    // DESARROLLO FÍSICO Y SALUD (5)
    {
        id: 26,
        campo: 'fisico',
        nombre: 'Circuito de Movimiento',
        descripcion: 'Circuito con saltos, gateo, equilibrio.',
        materiales: 'Colchonetas, aros, conos',
        tiempo: 35,
        edad: '3-5 años'
    },
    {
        id: 27,
        campo: 'fisico',
        nombre: 'Lavado de Manos Correcto',
        descripcion: 'Enseñar la técnica correcta de lavado de manos.',
        materiales: 'Jabón, toallas, cartel ilustrativo',
        tiempo: 15,
        edad: '3-5 años'
    },
    {
        id: 28,
        campo: 'fisico',
        nombre: 'Yoga para Niños',
        descripcion: 'Posturas simples de yoga con nombres de animales.',
        materiales: 'Colchonetas, música relajante',
        tiempo: 25,
        edad: '4-5 años'
    },
    {
        id: 29,
        campo: 'fisico',
        nombre: 'Lanzamiento a la Canasta',
        descripcion: 'Desarrollar coordinación óculo-manual.',
        materiales: 'Pelotas pequeñas, canastas',
        tiempo: 30,
        edad: '3-5 años'
    },
    {
        id: 30,
        campo: 'fisico',
        nombre: 'Alimentos Saludables',
        descripcion: 'Clasificar alimentos saludables vs. no saludables.',
        materiales: 'Imágenes de alimentos, dos canastas',
        tiempo: 25,
        edad: '4-5 años'
    }
];

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.ACTIVIDADES_PRECARGADAS = ACTIVIDADES_PRECARGADAS;
    console.log('✅ ' + ACTIVIDADES_PRECARGADAS.length + ' actividades precargadas');
}