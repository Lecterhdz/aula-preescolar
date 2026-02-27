// ─────────────────────────────────────────────────────────────────────
// AULA PREESCOLAR - MÓDULO DE LO HUMANO Y LO COMUNITARIO
// ─────────────────────────────────────────────────────────────────────

console.log('💚 Módulo Humano cargado');

let faseSeleccionada = null;
let emocionSeleccionada = null;

// ─────────────────────────────────────────────────────────────────────
// INICIALIZACIÓN
// ─────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async function() {
    console.log('💚 Humano.js inicializado');
    
    cargarAlumnosEnSelects();
    cargarPlaneacionesHumanoGuardadas();
    cargarSocioemocionalGuardado();
    cargarDesarrolloFisicoGuardado();
    cargarAutonomiaGuardada();
    cargarAlumnosEvaluacionHumano();
    
    console.log('✅ Humano.js listo');
});

// ─────────────────────────────────────────────────────────────────────
// PLANEACIÓN
// ─────────────────────────────────────────────────────────────────────
window.seleccionarFaseHumano = function(fase) {
    faseSeleccionada = fase;
    document.getElementById('planeacion-fase').value = fase;
    
    document.querySelectorAll('.fase-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
};

window.guardarPlaneacionHumano = function() {
    const fase = document.getElementById('planeacion-fase').value;
    const aprendizaje = document.getElementById('planeacion-aprendizaje').value;
    const proposito = document.getElementById('planeacion-proposito').value;
    const secuencia = document.getElementById('planeacion-secuencia').value;
    const materiales = document.getElementById('planeacion-materiales').value;
    const semana = document.getElementById('planeacion-semana').value;
    
    if (!fase || !aprendizaje || !proposito || !secuencia) {
        alert('⚠️ Completa los campos obligatorios');
        return;
    }
    
    const planeacion = {
        id: 'PLAN_HUMANO_' + Date.now(),
        campo: 'humano',
        fase: fase,
        aprendizajeEsperado: aprendizaje,
        proposito: proposito,
        secuenciaDidactica: secuencia,
        materiales: materiales,
        semana: semana,
        fechaCreacion: new Date().toISOString()
    };
    
    let planeaciones = JSON.parse(localStorage.getItem('aulaPreescolar_planeaciones') || '[]');
    planeaciones.push(planeacion);
    localStorage.setItem('aulaPreescolar_planeaciones', JSON.stringify(planeaciones));
    
    alert('✅ Planeación guardada');
    document.getElementById('planeacion-proposito').value = '';
    document.getElementById('planeacion-secuencia').value = '';
    document.getElementById('planeacion-materiales').value = '';
    
    cargarPlaneacionesHumanoGuardadas();
};

function cargarPlaneacionesHumanoGuardadas() {
    const container = document.getElementById('planeaciones-humano-guardadas');
    if (!container) return;
    
    const planeaciones = JSON.parse(localStorage.getItem('aulaPreescolar_planeaciones') || '[]');
    const humanoPlanes = planeaciones.filter(p => p.campo === 'humano');
    
    if (humanoPlanes.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No hay planeaciones guardadas</p>';
        return;
    }
    
    container.innerHTML = '<h3 style="margin:20px 0 10px 0;">📋 Planeaciones Guardadas</h3>' +
        humanoPlanes.map(function(p) {
            return '<div class="autonomia-card">' +
                '<h4>📅 Semana: ' + (p.semana || 'Sin especificar') + ' | Fase ' + p.fase + '</h4>' +
                '<p><strong>Aprendizaje:</strong> ' + p.aprendizajeEsperado + '</p>' +
                '<p><strong>Propósito:</strong> ' + p.proposito + '</p>' +
                '<button class="btn btn-danger" onclick="eliminarPlaneacionHumano(\'' + p.id + '\')" style="margin-top:10px;">🗑️ Eliminar</button>' +
                '</div>';
        }).join('');
}

window.eliminarPlaneacionHumano = function(id) {
    if (confirm('¿Eliminar esta planeación?')) {
        let planeaciones = JSON.parse(localStorage.getItem('aulaPreescolar_planeaciones') || '[]');
        planeaciones = planeaciones.filter(p => p.id !== id);
        localStorage.setItem('aulaPreescolar_planeaciones', JSON.stringify(planeaciones));
        cargarPlaneacionesHumanoGuardadas();
    }
};

// ─────────────────────────────────────────────────────────────────────
// SOCIOEMOCIONAL
// ─────────────────────────────────────────────────────────────────────
function cargarAlumnosEnSelects() {
    const datosLocales = localStorage.getItem('aulaPreescolar_data');
    if (!datosLocales) return;
    
    const datos = JSON.parse(datosLocales);
    const alumnos = datos.alumnos || [];
    
    const selects = ['socioemocional-alumno', 'fisico-alumno', 'autonomia-alumno'];
    selects.forEach(function(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        select.innerHTML = '<option value="">Seleccionar...</option>' +
            alumnos.map(function(a) {
                return '<option value="' + a.id + '">' + a.nombre + '</option>';
            }).join('');
    });
}

window.seleccionarEmocion = function(emocion) {
    emocionSeleccionada = emocion;
    document.getElementById('socioemocional-emocion').value = emocion;
    
    document.querySelectorAll('.emocion-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
};

window.guardarSocioemocional = function() {
    const alumnoId = document.getElementById('socioemocional-alumno').value;
    const emocion = document.getElementById('socioemocional-emocion').value;
    const situacion = document.getElementById('socioemocional-situacion').value;
    const estrategia = document.getElementById('socioemocional-estrategia').value;
    const resultado = document.getElementById('socioemocional-resultado').value;
    const fecha = document.getElementById('socioemocional-fecha').value;
    
    if (!alumnoId || !emocion || !situacion) {
        alert('⚠️ Completa los campos obligatorios');
        return;
    }
    
    const registro = {
        id: 'SOCIO_' + Date.now(),
        alumnoId: alumnoId,
        emocion: emocion,
        situacion: situacion,
        estrategia: estrategia,
        resultado: resultado,
        fecha: fecha,
        campo: 'humano'
    };
    
    let registros = JSON.parse(localStorage.getItem('aulaPreescolar_socioemocional') || '[]');
    registros.push(registro);
    localStorage.setItem('aulaPreescolar_socioemocional', JSON.stringify(registros));
    
    alert('✅ Registro socioemocional guardado');
    document.getElementById('socioemocional-situacion').value = '';
    document.getElementById('socioemocional-estrategia').value = '';
    document.querySelectorAll('.emocion-btn').forEach(btn => btn.classList.remove('active'));
    emocionSeleccionada = null;
    
    cargarSocioemocionalGuardado();
};

function cargarSocioemocionalGuardado() {
    const container = document.getElementById('lista-socioemocional');
    if (!container) return;
    
    const registros = JSON.parse(localStorage.getItem('aulaPreescolar_socioemocional') || '[]');
    const datosLocales = localStorage.getItem('aulaPreescolar_data');
    const alumnos = datosLocales ? JSON.parse(datosLocales).alumnos || [] : [];
    
    if (registros.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No hay registros socioemocionales</p>';
        return;
    }
    
    const emociones = {
        feliz: '😊 Feliz', triste: '😢 Triste', enojado: '😠 Enojado',
        asustado: '😨 Asustado', tranquilo: '😌 Tranquilo', ansioso: '😰 Ansioso'
    };
    const resultados = { favorable: '✅ Favorable', regular: '⚠️ Regular', 'requiere-seguimiento': '🔶 Requiere Seguimiento' };
    
    container.innerHTML = '<h3 style="margin:20px 0 10px 0;">💕 Registros Recientes</h3>' +
        registros.slice(-10).reverse().map(function(r) {
            const alumno = alumnos.find(a => a.id === r.alumnoId);
            return '<div class="emocion-card">' +
                '<h4>' + emociones[r.emocion] + ' ' + (alumno ? alumno.nombre : 'Alumno') + '</h4>' +
                '<p><strong>Situación:</strong> ' + r.situacion + '</p>' +
                '<p><strong>Estrategia:</strong> ' + (r.estrategia || 'N/A') + '</p>' +
                '<p><strong>Resultado:</strong> ' + resultados[r.resultado] + '</p>' +
                '<small style="color:#999;">📅 ' + r.fecha + '</small>' +
                '</div>';
        }).join('');
}

// ─────────────────────────────────────────────────────────────────────
// DESARROLLO FÍSICO
// ─────────────────────────────────────────────────────────────────────
window.guardarDesarrolloFisico = function() {
    const alumnoId = document.getElementById('fisico-alumno').value;
    const fecha = document.getElementById('fisico-fecha').value;
    const observaciones = document.getElementById('fisico-observaciones').value;
    
    if (!alumnoId) {
        alert('⚠️ Selecciona un alumno');
        return;
    }
    
    // Motricidad Gruesa
    const mg = [];
    ['mg-corre', 'mg-salta', 'mg-lanza', 'mg-equilibrio'].forEach(function(id) {
        const cb = document.getElementById(id);
        if (cb && cb.checked) mg.push(cb.value);
    });
    
    // Motricidad Fina
    const mf = [];
    ['mf-recorta', 'mf-dibuja', 'mf-abrocha', 'mf-ensarta'].forEach(function(id) {
        const cb = document.getElementById(id);
        if (cb && cb.checked) mf.push(cb.value);
    });
    
    const registro = {
        id: 'FISICO_' + Date.now(),
        alumnoId: alumnoId,
        motricidadGruesa: mg,
        motricidadFina: mf,
        observaciones: observaciones,
        fecha: fecha,
        campo: 'humano'
    };
    
    let registros = JSON.parse(localStorage.getItem('aulaPreescolar_fisico') || '[]');
    registros.push(registro);
    localStorage.setItem('aulaPreescolar_fisico', JSON.stringify(registros));
    
    alert('✅ Evaluación de desarrollo físico guardada');
    
    // Limpiar checkboxes
    document.querySelectorAll('#fisico input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('fisico-observaciones').value = '';
    
    cargarDesarrolloFisicoGuardado();
};

function cargarDesarrolloFisicoGuardado() {
    const container = document.getElementById('lista-fisico');
    if (!container) return;
    
    const registros = JSON.parse(localStorage.getItem('aulaPreescolar_fisico') || '[]');
    const datosLocales = localStorage.getItem('aulaPreescolar_data');
    const alumnos = datosLocales ? JSON.parse(datosLocales).alumnos || [] : [];
    
    if (registros.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No hay evaluaciones de desarrollo físico</p>';
        return;
    }
    
    container.innerHTML = '<h3 style="margin:20px 0 10px 0;">🏃 Evaluaciones Recientes</h3>' +
        registros.slice(-10).reverse().map(function(r) {
            const alumno = alumnos.find(a => a.id === r.alumnoId);
            return '<div class="desarrollo-card">' +
                '<h4>👶 ' + (alumno ? alumno.nombre : 'Alumno') + '</h4>' +
                '<p><strong>🦾 Motricidad Gruesa:</strong> ' + (r.motricidadGruesa.length > 0 ? r.motricidadGruesa.join(', ') : 'N/A') + '</p>' +
                '<p><strong>👐 Motricidad Fina:</strong> ' + (r.motricidadFina.length > 0 ? r.motricidadFina.join(', ') : 'N/A') + '</p>' +
                '<p><strong>Observaciones:</strong> ' + (r.observaciones || 'N/A') + '</p>' +
                '<small style="color:#999;">📅 ' + r.fecha + '</small>' +
                '</div>';
        }).join('');
}

// ─────────────────────────────────────────────────────────────────────
// AUTONOMÍA
// ─────────────────────────────────────────────────────────────────────
window.guardarAutonomia = function() {
    const alumnoId = document.getElementById('autonomia-alumno').value;
    const fecha = document.getElementById('autonomia-fecha').value;
    const observaciones = document.getElementById('autonomia-observaciones').value;
    
    if (!alumnoId) {
        alert('⚠️ Selecciona un alumno');
        return;
    }
    
    // Cuidado Personal
    const cp = [];
    ['cp-viste', 'cp-calza', 'cp-aseo', 'cp-esfinteres'].forEach(function(id) {
        const cb = document.getElementById(id);
        if (cb && cb.checked) cp.push(cb.value);
    });
    
    // Responsabilidades
    const resp = [];
    ['resp-ordena', 'resp-sigue', 'resp-completa', 'resp-cuida'].forEach(function(id) {
        const cb = document.getElementById(id);
        if (cb && cb.checked) resp.push(cb.value);
    });
    
    const registro = {
        id: 'AUTON_' + Date.now(),
        alumnoId: alumnoId,
        cuidadoPersonal: cp,
        responsabilidades: resp,
        observaciones: observaciones,
        fecha: fecha,
        campo: 'humano'
    };
    
    let registros = JSON.parse(localStorage.getItem('aulaPreescolar_autonomia') || '[]');
    registros.push(registro);
    localStorage.setItem('aulaPreescolar_autonomia', JSON.stringify(registros));
    
    alert('✅ Evaluación de autonomía guardada');
    
    // Limpiar checkboxes
    document.querySelectorAll('#autonomia input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('autonomia-observaciones').value = '';
    
    cargarAutonomiaGuardada();
};

function cargarAutonomiaGuardada() {
    const container = document.getElementById('lista-autonomia');
    if (!container) return;
    
    const registros = JSON.parse(localStorage.getItem('aulaPreescolar_autonomia') || '[]');
    const datosLocales = localStorage.getItem('aulaPreescolar_data');
    const alumnos = datosLocales ? JSON.parse(datosLocales).alumnos || [] : [];
    
    if (registros.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No hay evaluaciones de autonomía</p>';
        return;
    }
    
    container.innerHTML = '<h3 style="margin:20px 0 10px 0;">👕 Evaluaciones Recientes</h3>' +
        registros.slice(-10).reverse().map(function(r) {
            const alumno = alumnos.find(a => a.id === r.alumnoId);
            return '<div class="autonomia-card">' +
                '<h4>👶 ' + (alumno ? alumno.nombre : 'Alumno') + '</h4>' +
                '<p><strong>👕 Cuidado Personal:</strong> ' + (r.cuidadoPersonal.length > 0 ? r.cuidadoPersonal.join(', ') : 'N/A') + '</p>' +
                '<p><strong>📋 Responsabilidades:</strong> ' + (r.responsabilidades.length > 0 ? r.responsabilidades.join(', ') : 'N/A') + '</p>' +
                '<p><strong>Observaciones:</strong> ' + (r.observaciones || 'N/A') + '</p>' +
                '<small style="color:#999;">📅 ' + r.fecha + '</small>' +
                '</div>';
        }).join('');
}

// ─────────────────────────────────────────────────────────────────────
// EVALUACIÓN
// ─────────────────────────────────────────────────────────────────────
function cargarAlumnosEvaluacionHumano() {
    const container = document.getElementById('lista-alumnos-evaluacion-humano');
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
    
    const criterios = [
        { id: 'socioemocional', nombre: 'Desarrollo Socioemocional' },
        { id: 'fisico', nombre: 'Desarrollo Físico' },
        { id: 'autonomia', nombre: 'Autonomía' }
    ];
    
    container.innerHTML = alumnos.map(function(alumno) {
        return '<div class="alumno-eval-card" data-alumno="' + alumno.id + '" style="background:white;padding:20px;border-radius:12px;border:2px solid #95E1D3;margin:15px 0;">' +
            '<h4 style="margin:0 0 15px 0;color:#00897B;">👶 ' + alumno.nombre + '</h4>' +
            '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">' +
            criterios.map(function(crit) {
                return '<div>' +
                    '<label style="font-size:13px;color:#666;">' + crit.nombre + ':</label>' +
                    '<div class="nivel-selector">' +
                    '<button class="nivel-btn inicial" onclick="seleccionarNivelHumano(\'' + alumno.id + '\', \'' + crit.id + '\', \'inicial\')">Inicial</button>' +
                    '<button class="nivel-btn proceso" onclick="seleccionarNivelHumano(\'' + alumno.id + '\', \'' + crit.id + '\', \'proceso\')">Proceso</button>' +
                    '<button class="nivel-btn logrado" onclick="seleccionarNivelHumano(\'' + alumno.id + '\', \'' + crit.id + '\', \'logrado\')">Logrado</button>' +
                    '<button class="nivel-btn sobresaliente" onclick="seleccionarNivelHumano(\'' + alumno.id + '\', \'' + crit.id + '\', \'sobresaliente\')">Sobresaliente</button>' +
                    '</div>' +
                    '</div>';
            }).join('') +
            '</div>' +
            '<textarea placeholder="Observaciones..." style="width:100%;margin-top:15px;padding:10px;border:2px solid #ddd;border-radius:8px;font-size:13px;" data-obs="' + alumno.id + '"></textarea>' +
            '</div>';
    }).join('');
}

window.seleccionarNivelHumano = function(alumnoId, criterioId, nivel) {
    const card = document.querySelector('.alumno-eval-card[data-alumno="' + alumnoId + '"]');
    if (!card) return;
    
    card.querySelectorAll('.nivel-selector button').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    
    let evaluaciones = JSON.parse(localStorage.getItem('aulaPreescolar_evaluaciones_humano') || '{}');
    if (!evaluaciones[alumnoId]) evaluaciones[alumnoId] = {};
    evaluaciones[alumnoId][criterioId] = nivel;
    localStorage.setItem('aulaPreescolar_evaluaciones_humano', JSON.stringify(evaluaciones));
};

// ─────────────────────────────────────────────────────────────────────
// GENERAR REPORTE PDF - HUMANO
// ─────────────────────────────────────────────────────────────────────
window.generarReporteHumanoPDF = function() {
    const periodo = document.getElementById('evaluacion-periodo').value;
    const evaluaciones = JSON.parse(localStorage.getItem('aulaPreescolar_evaluaciones_humano') || '{}');
    const datosLocales = localStorage.getItem('aulaPreescolar_data');
    
    if (!datosLocales) {
        alert('⚠️ No hay datos de alumnos');
        return;
    }
    
    const datos = JSON.parse(datosLocales);
    const alumnos = datos.alumnos || [];
    const usuario = JSON.parse(localStorage.getItem('aulaPreescolar_session'));
    
    if (alumnos.length === 0) {
        alert('⚠️ No hay alumnos registrados');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // ENCABEZADO
    doc.setFillColor(149, 225, 211);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFontSize(22);
    doc.setTextColor(93, 64, 55);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE EVALUACIÓN', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('Campo Formativo: DE LO HUMANO Y LO COMUNITARIO', 105, 30, { align: 'center' });
    
    // DATOS GENERALES
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS GENERALES', 20, 55);
    
    doc.setFont('helvetica', 'normal');
    doc.text('Escuela: ' + (usuario?.escuela || 'Sin especificar'), 20, 65);
    doc.text('Periodo: ' + (periodo || 'Sin especificar'), 20, 75);
    doc.text('Fecha de emisión: ' + new Date().toLocaleDateString('es-MX'), 20, 85);
    
    // RESUMEN POR ALUMNO
    let yPos = 110;
    
    alumnos.forEach(function(alumno, index) {
        if (yPos > 240) {
            doc.addPage();
            yPos = 30;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 137, 123);
        doc.text((index + 1) + '. ' + alumno.nombre, 20, yPos);
        yPos += 10;
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        
        const evalAlumno = evaluaciones[alumno.id] || {};
        const criterios = ['socioemocional', 'fisico', 'autonomia'];
        const nombresCrit = ['Desarrollo Socioemocional', 'Desarrollo Físico', 'Autonomía'];
        
        criterios.forEach(function(critId, i) {
            const nivel = evalAlumno[critId] || 'proceso';
            const icono = nivel === 'inicial' ? '🔴' : (nivel === 'proceso' ? '🟡' : (nivel === 'logrado' ? '🟢' : '💚'));
            doc.text(icono + ' ' + nombresCrit[i] + ': ' + nivel, 25, yPos);
            yPos += 6;
        });
        
        yPos += 5;
    });
    
    // RECOMENDACIONES
    if (yPos > 200) {
        doc.addPage();
        yPos = 30;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 137, 123);
    doc.text('RECOMENDACIONES GENERALES', 20, yPos);
    yPos += 15;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    const recomendaciones = [
        '• Fomentar la expresión de emociones en casa',
        '• Promover actividades de motricidad gruesa y fina',
        '• Permitir que el niño realice tareas de autocuidado',
        '• Establecer rutinas que fomenten la autonomía',
        '• Reconocer y celebrar los logros de independencia'
    ];
    
    recomendaciones.forEach(function(rec) {
        doc.text(rec, 25, yPos);
        yPos += 8;
    });
    
    // FIRMAS
    const firmaY = 260;
    doc.setLineWidth(0.5);
    doc.line(20, firmaY, 90, firmaY);
    doc.line(120, firmaY, 190, firmaY);
    
    doc.setFontSize(10);
    doc.text('Firma del Docente', 55, firmaY + 10);
    doc.text('Firma del Director/a', 155, firmaY + 10);
    
    // PIE DE PÁGINA
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('Aula Preescolar - Plan 2022 Fase 2', 105, 285, { align: 'center' });
    doc.text('Nueva Escuela Mexicana', 105, 290, { align: 'center' });
    
    const nombreArchivo = 'Reporte_Humano_' + periodo + '.pdf';
    doc.save(nombreArchivo);
    
    console.log('✅ PDF generado:', nombreArchivo);
    alert('✅ Reporte PDF generado exitosamente');
};

console.log('✅ Humano.js completo cargado');