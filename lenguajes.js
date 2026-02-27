// ─────────────────────────────────────────────────────────────────────
// AULA PREESCOLAR - MÓDULO LENGUAJES
// ─────────────────────────────────────────────────────────────────────

console.log('📚 Módulo Lenguajes cargado');

let faseSeleccionada = null;

// ─────────────────────────────────────────────────────────────────────
// INICIALIZACIÓN
// ─────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async function() {
    console.log('📚 Lenguajes.js inicializado');
    
    // Establecer fecha de hoy para evidencias
    const fechaInput = document.getElementById('evidencias-fecha');
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
    
    // Cargar alumnos desde localStorage
    cargarAlumnosEnSelects();
    
    // Cargar planeaciones guardadas
    cargarPlaneacionesGuardadas();
    
    // Cargar actividades de Lenguajes
    filtrarActividadesLenguajes();
    
    // Cargar evidencias
    cargarEvidenciasGuardadas();
    
    // Cargar alumnos para evaluación
    cargarAlumnosEvaluacion();
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

window.guardarPlaneacion = function() {
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
        id: 'PLAN_' + Date.now(),
        campo: 'lenguajes',
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
            window.setDoc(window.doc(window.db, 'planeaciones', usuario.uid, 'lenguajes', planeacion.id), planeacion)
                .then(() => console.log('✅ Planeación guardada en Firebase'))
                .catch(err => console.error('Error Firebase:', err));
        }
    }
    
    alert('✅ Planeación guardada exitosamente');
    
    // Limpiar formulario
    document.getElementById('planeacion-proposito').value = '';
    document.getElementById('planeacion-secuencia').value = '';
    document.getElementById('planeacion-materiales').value = '';
    
    cargarPlaneacionesGuardadas();
};

function cargarPlaneacionesGuardadas() {
    const container = document.getElementById('planeaciones-guardadas');
    if (!container) return;
    
    const planeaciones = JSON.parse(localStorage.getItem('aulaPreescolar_planeaciones') || '[]');
    const lenguajesPlanes = planeaciones.filter(p => p.campo === 'lenguajes');
    
    if (lenguajesPlanes.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No hay planeaciones guardadas</p>';
        return;
    }
    
    container.innerHTML = '<h3 style="margin:20px 0 10px 0;">📋 Planeaciones Guardadas</h3>' +
        lenguajesPlanes.map(function(p) {
            return '<div class="aprendizaje-card">' +
                '<h4>📅 Semana: ' + (p.semana || 'Sin especificar') + ' | Fase ' + p.fase + '</h4>' +
                '<p><strong>Aprendizaje Esperado:</strong> ' + p.aprendizajeEsperado + '</p>' +
                '<p><strong>Propósito:</strong> ' + p.propósito + '</p>' +
                '<p><strong>Materiales:</strong> ' + p.materiales + '</p>' +
                '<button class="btn btn-danger" onclick="eliminarPlaneacion(\'' + p.id + '\')" style="margin-top:10px;">🗑️ Eliminar</button>' +
                '</div>';
        }).join('');
}

window.eliminarPlaneacion = function(id) {
    if (confirm('¿Eliminar esta planeación?')) {
        let planeaciones = JSON.parse(localStorage.getItem('aulaPreescolar_planeaciones') || '[]');
        planeaciones = planeaciones.filter(p => p.id !== id);
        localStorage.setItem('aulaPreescolar_planeaciones', JSON.stringify(planeaciones));
        cargarPlaneacionesGuardadas();
    }
};

// ─────────────────────────────────────────────────────────────────────
// BANCO DE ACTIVIDADES
// ─────────────────────────────────────────────────────────────────────
window.filtrarActividadesLenguajes = function() {
    const container = document.getElementById('lista-actividades-lenguajes');
    if (!container) return;
    
    const categoria = document.getElementById('actividades-categoria').value;
    const actividades = window.ACTIVIDADES_PRECARGADAS ? window.ACTIVIDADES_PRECARGADAS.filter(a => a.campo === 'lenguajes') : [];
    
    // Mapeo de categorías (en producción, las actividades tendrían esta clasificación)
    const actividadesConCategoria = actividades.map(function(a, idx) {
        const categorias = ['expresion-oral', 'lectura', 'escritura', 'artistica', 'corporal'];
        return { ...a, categoria: categorias[idx % 5] };
    });
    
    const filtradas = categoria === 'todos' ? 
        actividadesConCategoria : 
        actividadesConCategoria.filter(a => a.categoria === categoria);
    
    if (filtradas.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No hay actividades en esta categoría</p>';
        return;
    }
    
    container.innerHTML = filtradas.map(function(act) {
        return '<div class="aprendizaje-card">' +
            '<h4>🎨 ' + act.nombre + '</h4>' +
            '<span class="actividad-tag">' + act.categoria + '</span>' +
            '<p><strong>Descripción:</strong> ' + act.descripcion + '</p>' +
            '<p><strong>Materiales:</strong> ' + act.materiales + '</p>' +
            '<p><strong>Tiempo:</strong> ' + act.tiempo + ' min | <strong>Edad:</strong> ' + act.edad + '</p>' +
            '<button class="btn btn-primary" onclick="usarActividadPlaneacion(\'' + act.id + '\')" style="margin-top:10px;">📝 Usar en Planeación</button>' +
            '</div>';
    }).join('');
};

window.usarActividadPlaneacion = function(id) {
    const actividad = window.ACTIVIDADES_PRECARGADAS.find(a => a.id == id);
    if (!actividad) return;
    
    // Cambiar a pestaña de planeación
    document.querySelectorAll('.modulo-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.modulo-content').forEach(content => content.classList.remove('active'));
    document.querySelector('.modulo-tab:first-child').classList.add('active');
    document.getElementById('planeacion').classList.add('active');
    
    // Rellenar formulario
    document.getElementById('planeacion-secuencia').value = actividad.descripcion;
    document.getElementById('planeacion-materiales').value = actividad.materiales;
    
    alert('✅ Actividad cargada en planeación. Completa los demás campos y guarda.');
};

// ─────────────────────────────────────────────────────────────────────
// EVIDENCIAS
// ─────────────────────────────────────────────────────────────────────
function cargarAlumnosEnSelects() {
    const datosLocales = localStorage.getItem('aulaPreescolar_data');
    if (!datosLocales) return;
    
    const datos = JSON.parse(datosLocales);
    const alumnos = datos.alumnos || [];
    
    const selects = ['evidencias-alumno', 'reportes-alumno'];
    selects.forEach(function(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        select.innerHTML = '<option value="">Seleccionar...</option>' +
            alumnos.map(function(a) {
                return '<option value="' + a.id + '">' + a.nombre + '</option>';
            }).join('');
    });
}

window.guardarEvidencia = function() {
    const alumnoId = document.getElementById('evidencias-alumno').value;
    const tipo = document.getElementById('evidencias-tipo').value;
    const descripcion = document.getElementById('evidencias-descripcion').value;
    const fecha = document.getElementById('evidencias-fecha').value;
    
    if (!alumnoId || !descripcion) {
        alert('⚠️ Selecciona un alumno y describe la evidencia');
        return;
    }
    
    const evidencia = {
        id: 'EVID_' + Date.now(),
        alumnoId: alumnoId,
        tipo: tipo,
        descripcion: descripcion,
        fecha: fecha,
        campo: 'lenguajes'
    };
    
    // Guardar en localStorage
    let evidencias = JSON.parse(localStorage.getItem('aulaPreescolar_evidencias') || '[]');
    evidencias.push(evidencia);
    localStorage.setItem('aulaPreescolar_evidencias', JSON.stringify(evidencias));
    
    alert('✅ Evidencia guardada');
    document.getElementById('evidencias-descripcion').value = '';
    cargarEvidenciasGuardadas();
};

function cargarEvidenciasGuardadas() {
    const container = document.getElementById('lista-evidencias');
    if (!container) return;
    
    const evidencias = JSON.parse(localStorage.getItem('aulaPreescolar_evidencias') || '[]');
    const datosLocales = localStorage.getItem('aulaPreescolar_data');
    const alumnos = datosLocales ? JSON.parse(datosLocales).alumnos || [] : [];
    
    if (evidencias.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No hay evidencias guardadas</p>';
        return;
    }
    
    container.innerHTML = '<h3 style="margin:20px 0 10px 0;">📸 Evidencias Recientes</h3>' +
        evidencias.slice(-10).reverse().map(function(e) {
            const alumno = alumnos.find(a => a.id === e.alumnoId);
            const iconos = { foto: '📷', audio: '🎤', video: '🎥', nota: '📝' };
            return '<div class="evidencia-item">' +
                '<div><strong>' + iconos[e.tipo] + ' ' + (alumno ? alumno.nombre : 'Alumno') + '</strong></div>' +
                '<p style="margin:5px 0;color:#666;">' + e.descripcion + '</p>' +
                '<small style="color:#999;">📅 ' + e.fecha + '</small>' +
                '</div>';
        }).join('');
}

// ─────────────────────────────────────────────────────────────────────
// EVALUACIÓN
// ─────────────────────────────────────────────────────────────────────
function cargarAlumnosEvaluacion() {
    const container = document.getElementById('lista-alumnos-evaluacion');
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
    
    container.innerHTML = alumnos.map(function(alumno) {
        return '<div class="alumno-eval-card" data-alumno="' + alumno.id + '">' +
            '<h4 style="margin:0 0 15px 0;">👶 ' + alumno.nombre + '</h4>' +
            '<label style="font-size:13px;color:#666;">Nivel de Logro:</label>' +
            '<div class="nivel-selector">' +
            '<button class="nivel-btn inicial" onclick="seleccionarNivel(\'' + alumno.id + '\', \'inicial\')">Inicial</button>' +
            '<button class="nivel-btn proceso" onclick="seleccionarNivel(\'' + alumno.id + '\', \'proceso\')">En Proceso</button>' +
            '<button class="nivel-btn logrado" onclick="seleccionarNivel(\'' + alumno.id + '\', \'logrado\')">Logrado</button>' +
            '<button class="nivel-btn sobresaliente" onclick="seleccionarNivel(\'' + alumno.id + '\', \'sobresaliente\')">Sobresaliente</button>' +
            '</div>' +
            '<textarea placeholder="Observaciones..." style="width:100%;margin-top:10px;padding:8px;border:2px solid #ddd;border-radius:8px;font-size:13px;" data-obs="' + alumno.id + '"></textarea>' +
            '</div>';
    }).join('');
}

window.seleccionarNivel = function(alumnoId, nivel) {
    const card = document.querySelector('.alumno-eval-card[data-alumno="' + alumnoId + '"]');
    if (!card) return;
    
    card.querySelectorAll('.nivel-btn').forEach(btn => btn.classList.remove('selected'));
    card.querySelector('.nivel-btn.' + nivel).classList.add('selected');
    
    // Guardar temporalmente
    let evaluaciones = JSON.parse(localStorage.getItem('aulaPreescolar_evaluaciones') || '{}');
    if (!evaluaciones['lenguajes']) evaluaciones['lenguajes'] = {};
    evaluaciones['lenguajes'][alumnoId] = nivel;
    localStorage.setItem('aulaPreescolar_evaluaciones', JSON.stringify(evaluaciones));
};

window.generarReporteEvaluacion = function() {
    const periodo = document.getElementById('evaluacion-periodo').value;
    const evaluaciones = JSON.parse(localStorage.getItem('aulaPreescolar_evaluaciones') || '{}');
    
    if (!evaluaciones['lenguajes'] || Object.keys(evaluaciones['lenguajes']).length === 0) {
        alert('⚠️ No hay evaluaciones registradas. Evalúa a los alumnos primero.');
        return;
    }
    
    alert('✅ Reporte generado para el periodo: ' + periodo + '\n\nPróximamente: Exportar a PDF');
};

// ─────────────────────────────────────────────────────────────────────
// REPORTES
// ─────────────────────────────────────────────────────────────────────
window.generarComentarioAutomatico = function() {
    const alumnoId = document.getElementById('reportes-alumno').value;
    if (!alumnoId) {
        alert('⚠️ Selecciona un alumno');
        return;
    }
    
    const evaluaciones = JSON.parse(localStorage.getItem('aulaPreescolar_evaluaciones') || '{}');
    const nivel = evaluaciones['lenguajes'] ? evaluaciones['lenguajes'][alumnoId] : 'proceso';
    
    const comentarios = {
        inicial: 'El alumno requiere apoyo constante para desarrollar las competencias de lenguaje. Se recomienda trabajar en casa con lectura diaria y conversaciones familiares.',
        proceso: 'El alumno muestra avance en las competencias de lenguaje. Continúa necesitando apoyo en algunas áreas. Se sugiere reforzar la expresión oral en casa.',
        logrado: 'El alumno ha alcanzado las competencias esperadas de lenguaje. Demuestra buena expresión oral y comprensión. Se recomienda continuar con la lectura en casa.',
        sobresaliente: 'El alumno destaca en las competencias de lenguaje. Muestra excelente expresión oral, comprensión y creatividad. Se sugiere ofrecerle retos adicionales.'
    };
    
    const container = document.getElementById('reporte-resultado');
    container.style.display = 'block';
    container.innerHTML = '<h3>💡 Comentario Automático</h3>' +
        '<div style="background:white;padding:20px;border-radius:10px;margin-top:10px;">' +
        '<p style="line-height:1.8;">' + comentarios[nivel] + '</p>' +
        '</div>';
};

// ─────────────────────────────────────────────────────────────────────
// GENERAR REPORTE PDF REAL
// ─────────────────────────────────────────────────────────────────────
window.generarReportePDF = async function() {
    const alumnoId = document.getElementById('reportes-alumno').value;
    const periodo = document.getElementById('reportes-periodo').value;
    
    if (!alumnoId) {
        alert('⚠️ Selecciona un alumno');
        return;
    }
    
    // Obtener datos del alumno
    const datosLocales = localStorage.getItem('aulaPreescolar_data');
    if (!datosLocales) {
        alert('⚠️ No hay datos de alumnos');
        return;
    }
    
    const datos = JSON.parse(datosLocales);
    const alumno = datos.alumnos.find(a => a.id === alumnoId);
    const usuario = JSON.parse(localStorage.getItem('aulaPreescolar_session'));
    
    if (!alumno) {
        alert('⚠️ Alumno no encontrado');
        return;
    }
    
    // Obtener evaluación del alumno
    const evaluaciones = JSON.parse(localStorage.getItem('aulaPreescolar_evaluaciones') || '{}');
    const nivel = evaluaciones['lenguajes'] ? evaluaciones['lenguajes'][alumnoId] : 'proceso';
    
    // Comentarios por nivel
    const comentarios = {
        inicial: 'El alumno requiere apoyo constante para desarrollar las competencias de lenguaje. Se recomienda trabajar en casa con lectura diaria y conversaciones familiares.',
        proceso: 'El alumno muestra avance en las competencias de lenguaje. Continúa necesitando apoyo en algunas áreas. Se sugiere reforzar la expresión oral en casa.',
        logrado: 'El alumno ha alcanzado las competencias esperadas de lenguaje. Demuestra buena expresión oral y comprensión. Se recomienda continuar con la lectura en casa.',
        sobresaliente: 'El alumno destaca en las competencias de lenguaje. Muestra excelente expresión oral, comprensión y creatividad. Se sugiere ofrecerle retos adicionales.'
    };
    
    // Nombres de niveles
    const nombresNivel = {
        inicial: 'Inicial',
        proceso: 'En Proceso',
        logrado: 'Logrado',
        sobresaliente: 'Sobresaliente'
    };
    
    // Crear PDF con jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // ═══════════════════════════════════════════════════════════════
    // ENCABEZADO
    // ═══════════════════════════════════════════════════════════════
    // Fondo rosa
    doc.setFillColor(255, 107, 157);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Título
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE EVALUACIÓN', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Campo Formativo: LENGUAJES', 105, 30, { align: 'center' });
    
    // ═══════════════════════════════════════════════════════════════
    // DATOS DEL ALUMNO
    // ═══════════════════════════════════════════════════════════════
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL ALUMNO', 20, 55);
    
    doc.setFont('helvetica', 'normal');
    doc.text('Nombre: ' + alumno.nombre, 20, 65);
    doc.text('Grupo: ' + (usuario.escuela || 'Sin especificar'), 20, 75);
    doc.text('Periodo: ' + (periodo || 'Sin especificar'), 20, 85);
    doc.text('Fecha de emisión: ' + new Date().toLocaleDateString('es-MX'), 20, 95);
    
    // ═══════════════════════════════════════════════════════════════
    // RESULTADO DE EVALUACIÓN
    // ═══════════════════════════════════════════════════════════════
    // Fondo de sección
    doc.setFillColor(243, 229, 245);
    doc.rect(15, 105, 180, 40, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('RESULTADO DE EVALUACIÓN - LENGUAJES', 105, 118, { align: 'center' });
    
    // Nivel de logro
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Nivel de Logro:', 25, 135);
    
    // Color según nivel
    let colorNivel = [255, 235, 238]; // inicial
    if (nivel === 'proceso') colorNivel = [255, 243, 224];
    if (nivel === 'logrado') colorNivel = [232, 245, 233];
    if (nivel === 'sobresaliente') colorNivel = [227, 242, 253];
    
    doc.setFillColor(...colorNivel);
    doc.roundedRect(90, 125, 90, 20, 5, 5, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.text(nombresNivel[nivel] || 'En Proceso', 135, 138, { align: 'center' });
    
    // ═══════════════════════════════════════════════════════════════
    // COMENTARIO DEL DOCENTE
    // ═══════════════════════════════════════════════════════════════
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('COMENTARIO DEL DOCENTE', 20, 165);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    
    // Split text para que quepa en la página
    const lines = doc.splitTextToSize(comentarios[nivel] || comentarios.proceso, 170);
    doc.text(lines, 20, 175);
    
    // ═══════════════════════════════════════════════════════════════
    // RECOMENDACIONES
    // ═══════════════════════════════════════════════════════════════
    const recomendaciones = {
        inicial: ['• Leer cuentos diariamente en casa', '• Conversar sobre las actividades del día', '• Practicar trazos y garabateo', '• Escuchar y repetir canciones'],
        proceso: ['• Continuar con la lectura diaria', '• Fomentar que narre experiencias', '• Practicar escritura de su nombre', '• Juegos de rimas y sonidos'],
        logrado: ['• Mantener el hábito de lectura', '• Ofrecer libros de diferentes géneros', '• Fomentar que escriba mensajes simples', '• Continuar con conversaciones familiares'],
        sobresaliente: ['• Ofrecer libros más complejos', '• Fomentar que escriba historias cortas', '• Juegos de palabras más avanzados', '• Compartir sus creaciones con otros']
    };
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RECOMENDACIONES PARA CASA', 20, 210);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const recLines = recomendaciones[nivel] || recomendaciones.proceso;
    recLines.forEach((rec, i) => {
        doc.text(rec, 25, 220 + (i * 8));
    });
    
    // ═══════════════════════════════════════════════════════════════
    // FIRMAS
    // ═══════════════════════════════════════════════════════════════
    doc.setLineWidth(0.5);
    doc.line(20, 260, 90, 260);
    doc.line(120, 260, 190, 260);
    
    doc.setFontSize(10);
    doc.text('Firma del Docente', 55, 270);
    doc.text('Firma del Director/a', 155, 270);
    
    // ═══════════════════════════════════════════════════════════════
    // PIE DE PÁGINA
    // ═══════════════════════════════════════════════════════════════
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('Aula Preescolar - Plan 2022 Fase 2', 105, 285, { align: 'center' });
    doc.text('Nueva Escuela Mexicana', 105, 290, { align: 'center' });
    
    // Guardar PDF
    const nombreArchivo = 'Reporte_Lenguajes_' + alumno.nombre.replace(/\s/g, '_') + '_' + periodo + '.pdf';
    doc.save(nombreArchivo);
    
    console.log('✅ PDF generado:', nombreArchivo);
};


console.log('✅ Lenguajes.js listo');
