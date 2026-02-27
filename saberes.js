// ─────────────────────────────────────────────────────────────────────
// AULA PREESCOLAR - MÓDULO SABERES Y PENSAMIENTO CIENTÍFICO
// ─────────────────────────────────────────────────────────────────────

console.log('🔬 Módulo Saberes cargado');

let faseSeleccionada = null;

// ─────────────────────────────────────────────────────────────────────
// INICIALIZACIÓN
// ─────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async function() {
    console.log('🔬 Saberes.js inicializado');
    
    // Establecer fecha de hoy para experimentos
    const fechaInput = document.getElementById('experimento-fecha');
    if (fechaInput) {
        fechaInput.valueAsDate = new Date();
    }
    
    // Establecer mes actual para evaluaciones
    const periodoInput = document.getElementById('evaluacion-periodo');
    if (periodoInput) {
        const hoy = new Date();
        const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
        const anio = hoy.getFullYear();
        periodoInput.value = `${anio}-${mes}`;
    }
    
    // Cargar alumnos en selects
    cargarAlumnosEnSelects();
    
    // Cargar planeaciones guardadas
    cargarPlaneacionesSaberesGuardadas();
    
    // Cargar experimentos guardados
    cargarExperimentosGuardados();
    
    // Cargar seguimiento matemático
    cargarSeguimientoMatematico();
    
    // Cargar alumnos para evaluación
    cargarAlumnosEvaluacionSaberes();
    
    // Generar primer problema
    generarProblema();
});

// ─────────────────────────────────────────────────────────────────────
// PLANEACIÓN
// ─────────────────────────────────────────────────────────────────────
window.seleccionarFase = function(fase) {
    faseSeleccionada = fase;
    document.getElementById('planeacion-fase').value = fase;
    
    document.querySelectorAll('.fase-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    console.log('✅ Fase seleccionada:', fase);
};

window.guardarPlaneacionSaberes = function() {
    const fase = document.getElementById('planeacion-fase').value;
    const aprendizaje = document.getElementById('planeacion-aprendizaje').value;
    const proposito = document.getElementById('planeacion-proposito').value;
    const secuencia = document.getElementById('planeacion-secuencia').value;
    const materiales = document.getElementById('planeacion-materiales').value;
    const semana = document.getElementById('planeacion-semana').value;
    
    if (!fase || !aprendizaje || !proposito || !secuencia) {
        alert('⚠️ Completa los campos obligatorios (Fase, Aprendizaje, Propósito, Secuencia)');
        return;
    }
    
    const planeacion = {
        id: 'PLAN_SABERES_' + Date.now(),
        campo: 'saberes',
        fase: fase,
        aprendizajeEsperado: aprendizaje,
        proposito: proposito,
        secuenciaDidactica: secuencia,
        materiales: materiales,
        semana: semana,
        fechaCreacion: new Date().toISOString()
    };
    
    // Guardar en localStorage
    let planeaciones = JSON.parse(localStorage.getItem('aulaPreescolar_planeaciones') || '[]');
    planeaciones.push(planeacion);
    localStorage.setItem('aulaPreescolar_planeaciones', JSON.stringify(planeaciones));
    
    // Guardar en Firebase (si está disponible)
    if (window.db) {
        const usuario = JSON.parse(localStorage.getItem('aulaPreescolar_session'));
        if (usuario && usuario.uid) {
            window.setDoc(window.doc(window.db, 'planeaciones', usuario.uid, 'saberes', planeacion.id), planeacion)
                .then(() => console.log('✅ Planeación guardada en Firebase'))
                .catch(err => console.error('Error Firebase:', err));
        }
    }
    
    alert('✅ Planeación guardada exitosamente');
    
    // Limpiar formulario
    document.getElementById('planeacion-proposito').value = '';
    document.getElementById('planeacion-secuencia').value = '';
    document.getElementById('planeacion-materiales').value = '';
    
    cargarPlaneacionesSaberesGuardadas();
};

function cargarPlaneacionesSaberesGuardadas() {
    const container = document.getElementById('planeaciones-saberes-guardadas');
    if (!container) return;
    
    const planeaciones = JSON.parse(localStorage.getItem('aulaPreescolar_planeaciones') || '[]');
    const saberesPlanes = planeaciones.filter(p => p.campo === 'saberes');
    
    if (saberesPlanes.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No hay planeaciones guardadas</p>';
        return;
    }
    
    container.innerHTML = '<h3 style="margin:20px 0 10px 0;">📋 Planeaciones Guardadas</h3>' +
        saberesPlanes.map(function(p) {
            return '<div class="experimento-card">' +
                '<h4>📅 Semana: ' + (p.semana || 'Sin especificar') + ' | Fase ' + p.fase + '</h4>' +
                '<p><strong>Aprendizaje Esperado:</strong> ' + p.aprendizajeEsperado + '</p>' +
                '<p><strong>Propósito:</strong> ' + p.proposito + '</p>' +
                '<p><strong>Materiales:</strong> ' + p.materiales + '</p>' +
                '<button class="btn btn-danger" onclick="eliminarPlaneacionSaberes(\'' + p.id + '\')" style="margin-top:10px;">🗑️ Eliminar</button>' +
                '</div>';
        }).join('');
}

window.eliminarPlaneacionSaberes = function(id) {
    if (confirm('¿Eliminar esta planeación?')) {
        let planeaciones = JSON.parse(localStorage.getItem('aulaPreescolar_planeaciones') || '[]');
        planeaciones = planeaciones.filter(p => p.id !== id);
        localStorage.setItem('aulaPreescolar_planeaciones', JSON.stringify(planeaciones));
        cargarPlaneacionesSaberesGuardadas();
    }
};

// ─────────────────────────────────────────────────────────────────────
// EXPERIMENTOS
// ─────────────────────────────────────────────────────────────────────
function cargarAlumnosEnSelects() {
    const datosLocales = localStorage.getItem('aulaPreescolar_data');
    if (!datosLocales) return;
    
    const datos = JSON.parse(datosLocales);
    const alumnos = datos.alumnos || [];
    
    const selects = ['experimento-alumno'];
    selects.forEach(function(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        select.innerHTML = '<option value="">Seleccionar...</option>' +
            alumnos.map(function(a) {
                return '<option value="' + a.id + '">' + a.nombre + '</option>';
            }).join('');
    });
}

window.guardarExperimento = function() {
    const alumnoId = document.getElementById('experimento-alumno').value;
    const nombre = document.getElementById('experimento-nombre').value;
    const hipotesis = document.getElementById('experimento-hipotesis').value;
    const materiales = document.getElementById('experimento-materiales').value;
    const resultado = document.getElementById('experimento-resultado').value;
    const conclusion = document.getElementById('experimento-conclusion').value;
    const fecha = document.getElementById('experimento-fecha').value;
    
    if (!alumnoId || !nombre || !hipotesis) {
        alert('⚠️ Completa los campos obligatorios (Alumno, Experimento, Hipótesis)');
        return;
    }
    
    const experimento = {
        id: 'EXP_' + Date.now(),
        alumnoId: alumnoId,
        nombre: nombre,
        hipotesis: hipotesis,
        materiales: materiales,
        resultado: resultado,
        conclusion: conclusion,
        fecha: fecha,
        campo: 'saberes'
    };
    
    // Guardar en localStorage
    let experimentos = JSON.parse(localStorage.getItem('aulaPreescolar_experimentos') || '[]');
    experimentos.push(experimento);
    localStorage.setItem('aulaPreescolar_experimentos', JSON.stringify(experimentos));
    
    alert('✅ Experimento guardado');
    
    // Limpiar formulario
    document.getElementById('experimento-nombre').value = '';
    document.getElementById('experimento-hipotesis').value = '';
    document.getElementById('experimento-materiales').value = '';
    document.getElementById('experimento-resultado').value = '';
    document.getElementById('experimento-conclusion').value = '';
    
    cargarExperimentosGuardados();
};

function cargarExperimentosGuardados() {
    const container = document.getElementById('lista-experimentos');
    if (!container) return;
    
    const experimentos = JSON.parse(localStorage.getItem('aulaPreescolar_experimentos') || '[]');
    const datosLocales = localStorage.getItem('aulaPreescolar_data');
    const alumnos = datosLocales ? JSON.parse(datosLocales).alumnos || [] : [];
    
    if (experimentos.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No hay experimentos guardados</p>';
        return;
    }
    
    container.innerHTML = '<h3 style="margin:20px 0 10px 0;">🧪 Experimentos Recientes</h3>' +
        experimentos.slice(-10).reverse().map(function(e) {
            const alumno = alumnos.find(a => a.id === e.alumnoId);
            return '<div class="experimento-card">' +
                '<h4>🔬 ' + e.nombre + '</h4>' +
                '<p><strong>👶 Alumno:</strong> ' + (alumno ? alumno.nombre : 'Sin nombre') + '</p>' +
                '<p><strong>💭 Hipótesis:</strong> ' + e.hipotesis + '</p>' +
                '<p><strong>👀 Resultado:</strong> ' + e.resultado + '</p>' +
                '<p><strong>💡 Conclusión:</strong> ' + e.conclusion + '</p>' +
                '<small style="color:#999;">📅 ' + e.fecha + '</small>' +
                '</div>';
        }).join('');
}

// ─────────────────────────────────────────────────────────────────────
// SEGUIMIENTO MATEMÁTICO (SEMÁFORO)
// ─────────────────────────────────────────────────────────────────────
function cargarSeguimientoMatematico() {
    const container = document.getElementById('semaforo-matematicas');
    if (!container) return;
    
    const datosLocales = localStorage.getItem('aulaPreescolar_data');
    if (!datosLocales) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No hay alumnos registrados</p>';
        return;
    }
    
    const datos = JSON.parse(datosLocales);
    const alumnos = datos.alumnos || [];
    
    if (alumnos.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No hay alumnos registrados</p>';
        return;
    }
    
    // Cargar evaluaciones guardadas
    const evaluaciones = JSON.parse(localStorage.getItem('aulaPreescolar_evaluaciones_saberes') || '{}');
    
    const competencias = [
        { id: 'conteo', nombre: 'Conteo', icono: '🔢' },
        { id: 'seriacion', nombre: 'Seriación', icono: '📏' },
        { id: 'clasificacion', nombre: 'Clasificación', icono: '📊' },
        { id: 'figuras', nombre: 'Figuras', icono: '🔷' },
        { id: 'patrones', nombre: 'Patrones', icono: '🔁' }
    ];
    
    let html = '';
    alumnos.forEach(function(alumno) {
        html += '<div style="background:white;padding:20px;border-radius:15px;margin:15px 0;border:2px solid #4ECDC4;">' +
            '<h4 style="margin:0 0 15px 0;color:#44A08D;">👶 ' + alumno.nombre + '</h4>' +
            '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;">';
        
        competencias.forEach(function(comp) {
            const nivel = evaluaciones[alumno.id] ? evaluaciones[alumno.id][comp.id] : 'desarrollo';
            const claseNivel = nivel === 'dominado' ? 'dominado' : (nivel === 'apoyo' ? 'apoyo' : 'desarrollo');
            const iconoNivel = nivel === 'dominado' ? '🟢' : (nivel === 'apoyo' ? '🔴' : '🟡');
            const textoNivel = nivel === 'dominado' ? 'Dominado' : (nivel === 'apoyo' ? 'Requiere Apoyo' : 'En Desarrollo');
            
            html += '<div class="semaforo-item ' + claseNivel + '" style="cursor:pointer;" onclick="cambiarNivelMatematico(\'' + alumno.id + '\', \'' + comp.id + '\')">' +
                '<div class="semaforo-icon">' + iconoNivel + '</div>' +
                '<div style="font-size:12px;color:#666;">' + comp.icono + ' ' + comp.nombre + '</div>' +
                '<div style="font-size:11px;color:#999;margin-top:5px;">' + textoNivel + '</div>' +
                '</div>';
        });
        
        html += '</div></div>';
    });
    
    container.innerHTML = html;
}

window.cambiarNivelMatematico = function(alumnoId, competenciaId) {
    const niveles = ['dominado', 'desarrollo', 'apoyo'];
    const nombresNiveles = { dominado: 'Dominado 🟢', desarrollo: 'En Desarrollo 🟡', apoyo: 'Requiere Apoyo 🔴' };
    
    const nivelActual = prompt(
        'Nivel para esta competencia:\n\n1 = Dominado 🟢\n2 = En Desarrollo 🟡\n3 = Requiere Apoyo 🔴\n\nIngresa número (1-3):',
        '2'
    );
    
    if (!nivelActual) return;
    
    const nivelIndex = parseInt(nivelActual) - 1;
    if (nivelIndex < 0 || nivelIndex > 2) {
        alert('⚠️ Número inválido');
        return;
    }
    
    const nivel = niveles[nivelIndex];
    
    // Guardar evaluación
    let evaluaciones = JSON.parse(localStorage.getItem('aulaPreescolar_evaluaciones_saberes') || '{}');
    if (!evaluaciones[alumnoId]) evaluaciones[alumnoId] = {};
    evaluaciones[alumnoId][competenciaId] = nivel;
    localStorage.setItem('aulaPreescolar_evaluaciones_saberes', JSON.stringify(evaluaciones));
    
    alert('✅ Nivel actualizado: ' + nombresNiveles[nivel]);
    cargarSeguimientoMatematico();
};

// ─────────────────────────────────────────────────────────────────────
// GENERADOR DE PROBLEMAS
// ─────────────────────────────────────────────────────────────────────
window.generarProblema = function() {
    const edad = parseInt(document.getElementById('problemas-edad').value);
    const tipo = document.getElementById('problemas-tipo').value;
    
    const problemas = {
        '3': {
            'conteo': [
                '¿Cuántos deditos tienes en una mano?',
                'Si tienes 2 manzanas y te dan 1 más, ¿cuántas tienes?',
                '¿Cuántos ojos tienes en tu cara?'
            ],
            'comparacion': [
                '¿Qué tiene más patas, un perro o una gallina?',
                '¿Qué es más grande, una pelota o un elefante?',
                '¿Quién tiene más años, tu mamá o tú?'
            ],
            'suma': [
                'Tienes 1 galleta y te dan 1 más. ¿Cuántas tienes?',
                'Si tienes 2 lápices y encuentras 1, ¿cuántos tienes?'
            ],
            'resta': [
                'Tienes 2 galletas y te comes 1. ¿Cuántas quedan?',
                'Si tienes 3 dulces y regalas 1, ¿cuántos te quedan?'
            ]
        },
        '4': {
            'conteo': [
                '¿Cuántos deditos tienes en las dos manos?',
                'Si tienes 3 manzanas y te dan 2 más, ¿cuántas tienes?',
                'Cuenta cuántas sillas hay en tu salón'
            ],
            'comparacion': [
                '¿Qué pesa más, 1 kilogramo de plumas o 1 kilogramo de piedras?',
                '¿Qué tiene más ruedas, una bicicleta o un coche?',
                '¿Qué es más largo, tu brazo o tu pierna?'
            ],
            'suma': [
                'Tienes 3 galletas y te dan 2 más. ¿Cuántas tienes?',
                'Si tienes 4 lápices y encuentras 2, ¿cuántos tienes?'
            ],
            'resta': [
                'Tienes 5 galletas y te comes 2. ¿Cuántas quedan?',
                'Si tienes 4 dulces y regalas 2, ¿cuántos te quedan?'
            ]
        },
        '5': {
            'conteo': [
                'Si tienes 5 manzanas y te dan 3 más, ¿cuántas tienes?',
                '¿Cuántos días tiene una semana?',
                'Cuenta de 2 en 2 hasta 20'
            ],
            'comparacion': [
                '¿Qué es más, la mitad de 10 o la mitad de 8?',
                'Si un gato tiene 4 patas, ¿cuántas patas tienen 2 gatos?',
                '¿Qué número es más grande, 15 o 51?'
            ],
            'suma': [
                'Tienes 5 galletas y te dan 3 más. ¿Cuántas tienes?',
                'Si tienes 6 lápices y encuentras 4, ¿cuántos tienes?'
            ],
            'resta': [
                'Tienes 8 galletas y te comes 3. ¿Cuántas quedan?',
                'Si tienes 10 dulces y regalas 4, ¿cuántos te quedan?'
            ]
        }
    };
    
    const problemasEdad = problemas[edad] || problemas['4'];
    const problemasTipo = problemasEdad[tipo] || problemasEdad['conteo'];
    const problemaSeleccionado = problemasTipo[Math.floor(Math.random() * problemasTipo.length)];
    
    const container = document.getElementById('problema-generado');
    const texto = document.getElementById('problema-texto');
    
    if (container && texto) {
        container.style.display = 'block';
        texto.textContent = problemaSeleccionado;
    }
};

// ─────────────────────────────────────────────────────────────────────
// EVALUACIÓN
// ─────────────────────────────────────────────────────────────────────
function cargarAlumnosEvaluacionSaberes() {
    const container = document.getElementById('lista-alumnos-evaluacion-saberes');
    if (!container) return;
    
    const datosLocales = localStorage.getItem('aulaPreescolar_data');
    if (!datosLocales) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No hay alumnos registrados</p>';
        return;
    }
    
    const datos = JSON.parse(datosLocales);
    const alumnos = datos.alumnos || [];
    
    if (alumnos.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No hay alumnos registrados</p>';
        return;
    }
    
    const competencias = [
        { id: 'conteo', nombre: 'Conteo' },
        { id: 'seriacion', nombre: 'Seriación' },
        { id: 'clasificacion', nombre: 'Clasificación' },
        { id: 'figuras', nombre: 'Figuras Geométricas' },
        { id: 'patrones', nombre: 'Patrones' }
    ];
    
    container.innerHTML = alumnos.map(function(alumno) {
        return '<div class="alumno-eval-card" data-alumno="' + alumno.id + '" style="background:white;padding:20px;border-radius:12px;border:2px solid #4ECDC4;margin:15px 0;">' +
            '<h4 style="margin:0 0 15px 0;color:#44A08D;">👶 ' + alumno.nombre + '</h4>' +
            '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">' +
            competencias.map(function(comp) {
                return '<div>' +
                    '<label style="font-size:13px;color:#666;">' + comp.nombre + ':</label>' +
                    '<div class="nivel-selector">' +
                    '<button class="nivel-btn inicial" onclick="seleccionarNivelSaberes(\'' + alumno.id + '\', \'' + comp.id + '\', \'inicial\')">Inicial</button>' +
                    '<button class="nivel-btn proceso" onclick="seleccionarNivelSaberes(\'' + alumno.id + '\', \'' + comp.id + '\', \'proceso\')">Proceso</button>' +
                    '<button class="nivel-btn logrado" onclick="seleccionarNivelSaberes(\'' + alumno.id + '\', \'' + comp.id + '\', \'logrado\')">Logrado</button>' +
                    '<button class="nivel-btn sobresaliente" onclick="seleccionarNivelSaberes(\'' + alumno.id + '\', \'' + comp.id + '\', \'sobresaliente\')">Sobresaliente</button>' +
                    '</div>' +
                    '</div>';
            }).join('') +
            '</div>' +
            '<textarea placeholder="Observaciones generales..." style="width:100%;margin-top:15px;padding:10px;border:2px solid #ddd;border-radius:8px;font-size:13px;" data-obs="' + alumno.id + '"></textarea>' +
            '</div>';
    }).join('');
}

window.seleccionarNivelSaberes = function(alumnoId, competenciaId, nivel) {
    const card = document.querySelector('.alumno-eval-card[data-alumno="' + alumnoId + '"]');
    if (!card) return;
    
    // Remover selección previa en esta competencia
    const buttons = card.querySelectorAll('.nivel-selector button');
    buttons.forEach(btn => btn.classList.remove('selected'));
    
    // Marcar como seleccionado
    event.target.classList.add('selected');
    
    // Guardar evaluación
    let evaluaciones = JSON.parse(localStorage.getItem('aulaPreescolar_evaluaciones_saberes') || '{}');
    if (!evaluaciones[alumnoId]) evaluaciones[alumnoId] = {};
    evaluaciones[alumnoId][competenciaId] = nivel;
    localStorage.setItem('aulaPreescolar_evaluaciones_saberes', JSON.stringify(evaluaciones));
};

// ─────────────────────────────────────────────────────────────────────
// GENERAR REPORTE PDF - SABERES
// ─────────────────────────────────────────────────────────────────────
window.generarReporteSaberesPDF = function() {
    const periodo = document.getElementById('evaluacion-periodo').value;
    const evaluaciones = JSON.parse(localStorage.getItem('aulaPreescolar_evaluaciones_saberes') || '{}');
    const datosLocales = localStorage.getItem('aulaPreescolar_data');
    
    if (!datosLocales) {
        alert('⚠️ No hay datos de alumnos');
        return;
    }
    
    const datos = JSON.parse(datosLocales);
    const alumnos = datos.alumnos || [];
    
    if (alumnos.length === 0) {
        alert('⚠️ No hay alumnos registrados');
        return;
    }
    
    const usuario = JSON.parse(localStorage.getItem('aulaPreescolar_session'));
    
    // Crear PDF con jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // ═══════════════════════════════════════════════════════════════
    // ENCABEZADO
    // ═══════════════════════════════════════════════════════════════
    doc.setFillColor(78, 205, 196);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE EVALUACIÓN', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Campo Formativo: SABERES Y PENSAMIENTO CIENTÍFICO', 105, 30, { align: 'center' });
    
    // ═══════════════════════════════════════════════════════════════
    // DATOS GENERALES
    // ═══════════════════════════════════════════════════════════════
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS GENERALES', 20, 55);
    
    doc.setFont('helvetica', 'normal');
    doc.text('Escuela: ' + (usuario.escuela || 'Sin especificar'), 20, 65);
    doc.text('Periodo: ' + (periodo || 'Sin especificar'), 20, 75);
    doc.text('Fecha de emisión: ' + new Date().toLocaleDateString('es-MX'), 20, 85);
    doc.text('Total de alumnos: ' + alumnos.length, 20, 95);
    
    // ═══════════════════════════════════════════════════════════════
    // RESUMEN POR ALUMNO
    // ═══════════════════════════════════════════════════════════════
    let yPos = 115;
    
    alumnos.forEach(function(alumno, index) {
        if (yPos > 250) {
            doc.addPage();
            yPos = 30;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(68, 160, 141);
        doc.text((index + 1) + '. ' + alumno.nombre, 20, yPos);
        yPos += 10;
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        
        const evalAlumno = evaluaciones[alumno.id] || {};
        const competencias = ['conteo', 'seriacion', 'clasificacion', 'figuras', 'patrones'];
        const nombresComp = ['Conteo', 'Seriación', 'Clasificación', 'Figuras', 'Patrones'];
        
        competencias.forEach(function(compId, i) {
            const nivel = evalAlumno[compId] || 'proceso';
            const icono = nivel === 'inicial' ? '🔴' : (nivel === 'proceso' ? '🟡' : (nivel === 'logrado' ? '🟢' : '💚'));
            doc.text(icono + ' ' + nombresComp[i] + ': ' + nivel, 25, yPos);
            yPos += 6;
        });
        
        yPos += 5;
    });
    
    // ═══════════════════════════════════════════════════════════════
    // RECOMENDACIONES GENERALES
    // ═══════════════════════════════════════════════════════════════
    if (yPos > 200) {
        doc.addPage();
        yPos = 30;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(68, 160, 141);
    doc.text('RECOMENDACIONES GENERALES', 20, yPos);
    yPos += 15;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    const recomendaciones = [
        '• Continuar con actividades de conteo en contextos cotidianos',
        '• Fomentar la resolución de problemas mediante el juego',
        '• Utilizar materiales concretos para conceptos abstractos',
        '• Promover la observación y formulación de hipótesis',
        '• Integrar las matemáticas en actividades diarias'
    ];
    
    recomendaciones.forEach(function(rec) {
        doc.text(rec, 25, yPos);
        yPos += 8;
    });
    
    // ═══════════════════════════════════════════════════════════════
    // FIRMAS
    // ═══════════════════════════════════════════════════════════════
    yPos = 260;
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 90, yPos);
    doc.line(120, yPos, 190, yPos);
    
    doc.setFontSize(10);
    doc.text('Firma del Docente', 55, yPos + 10);
    doc.text('Firma del Director/a', 155, yPos + 10);
    
    // ═══════════════════════════════════════════════════════════════
    // PIE DE PÁGINA
    // ═══════════════════════════════════════════════════════════════
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('Aula Preescolar - Plan 2022 Fase 2', 105, 285, { align: 'center' });
    doc.text('Nueva Escuela Mexicana', 105, 290, { align: 'center' });
    
    // Guardar PDF
    const nombreArchivo = 'Reporte_Saberes_' + periodo + '.pdf';
    doc.save(nombreArchivo);
    
    console.log('✅ PDF generado:', nombreArchivo);
    alert('✅ Reporte PDF generado exitosamente');
};

console.log('✅ Saberes.js listo');