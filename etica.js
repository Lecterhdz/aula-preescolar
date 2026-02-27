// ─────────────────────────────────────────────────────────────────────
// AULA PREESCOLAR - MÓDULO ÉTICA, NATURALEZA Y SOCIEDADES
// ─────────────────────────────────────────────────────────────────────

console.log('🤝 Módulo Ética cargado');

let faseSeleccionada = null;
let valoresSeleccionados = [];

// ─────────────────────────────────────────────────────────────────────
// INICIALIZACIÓN
// ─────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async function() {
    console.log('🤝 Etica.js inicializado');
    
    cargarAlumnosEnSelects();
    cargarPlaneacionesEticaGuardadas();
    cargarConvivenciaGuardada();
    cargarProyectosGuardados();
    cargarValoresGuardados();
    cargarAlumnosEvaluacionEtica();
    
    console.log('✅ Etica.js listo');
});

// ─────────────────────────────────────────────────────────────────────
// PLANEACIÓN
// ─────────────────────────────────────────────────────────────────────
window.seleccionarFaseEtica = function(fase) {
    faseSeleccionada = fase;
    document.getElementById('planeacion-fase').value = fase;
    
    document.querySelectorAll('.fase-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
};

window.guardarPlaneacionEtica = function() {
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
        id: 'PLAN_ETICA_' + Date.now(),
        campo: 'etica',
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
    
    cargarPlaneacionesEticaGuardadas();
};

function cargarPlaneacionesEticaGuardadas() {
    const container = document.getElementById('planeaciones-etica-guardadas');
    if (!container) return;
    
    const planeaciones = JSON.parse(localStorage.getItem('aulaPreescolar_planeaciones') || '[]');
    const eticaPlanes = planeaciones.filter(p => p.campo === 'etica');
    
    if (eticaPlanes.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No hay planeaciones guardadas</p>';
        return;
    }
    
    container.innerHTML = '<h3 style="margin:20px 0 10px 0;">📋 Planeaciones Guardadas</h3>' +
        eticaPlanes.map(function(p) {
            return '<div class="convivencia-card">' +
                '<h4>📅 Semana: ' + (p.semana || 'Sin especificar') + ' | Fase ' + p.fase + '</h4>' +
                '<p><strong>Aprendizaje:</strong> ' + p.aprendizajeEsperado + '</p>' +
                '<p><strong>Propósito:</strong> ' + p.proposito + '</p>' +
                '<button class="btn btn-danger" onclick="eliminarPlaneacionEtica(\'' + p.id + '\')" style="margin-top:10px;">🗑️ Eliminar</button>' +
                '</div>';
        }).join('');
}

window.eliminarPlaneacionEtica = function(id) {
    if (confirm('¿Eliminar esta planeación?')) {
        let planeaciones = JSON.parse(localStorage.getItem('aulaPreescolar_planeaciones') || '[]');
        planeaciones = planeaciones.filter(p => p.id !== id);
        localStorage.setItem('aulaPreescolar_planeaciones', JSON.stringify(planeaciones));
        cargarPlaneacionesEticaGuardadas();
    }
};

// ─────────────────────────────────────────────────────────────────────
// CONVIVENCIA
// ─────────────────────────────────────────────────────────────────────
function cargarAlumnosEnSelects() {
    const datosLocales = localStorage.getItem('aulaPreescolar_data');
    if (!datosLocales) return;
    
    const datos = JSON.parse(datosLocales);
    const alumnos = datos.alumnos || [];
    
    const selects = ['convivencia-alumno'];
    selects.forEach(function(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        select.innerHTML = '<option value="">Seleccionar...</option>' +
            alumnos.map(function(a) {
                return '<option value="' + a.id + '">' + a.nombre + '</option>';
            }).join('');
    });
}

window.guardarConvivencia = function() {
    const alumnoId = document.getElementById('convivencia-alumno').value;
    const tipo = document.getElementById('convivencia-tipo').value;
    const descripcion = document.getElementById('convivencia-descripcion').value;
    const estrategia = document.getElementById('convivencia-estrategia').value;
    const resultado = document.getElementById('convivencia-resultado').value;
    const fecha = document.getElementById('convivencia-fecha').value;
    
    if (!alumnoId || !descripcion) {
        alert('⚠️ Completa los campos obligatorios');
        return;
    }
    
    const registro = {
        id: 'CONV_' + Date.now(),
        alumnoId: alumnoId,
        tipo: tipo,
        descripcion: descripcion,
        estrategia: estrategia,
        resultado: resultado,
        fecha: fecha,
        campo: 'etica'
    };
    
    let convivencias = JSON.parse(localStorage.getItem('aulaPreescolar_convivencia') || '[]');
    convivencias.push(registro);
    localStorage.setItem('aulaPreescolar_convivencia', JSON.stringify(convivencias));
    
    alert('✅ Registro de convivencia guardado');
    document.getElementById('convivencia-descripcion').value = '';
    document.getElementById('convivencia-estrategia').value = '';
    
    cargarConvivenciaGuardada();
};

function cargarConvivenciaGuardada() {
    const container = document.getElementById('lista-convivencia');
    if (!container) return;
    
    const registros = JSON.parse(localStorage.getItem('aulaPreescolar_convivencia') || '[]');
    const datosLocales = localStorage.getItem('aulaPreescolar_data');
    const alumnos = datosLocales ? JSON.parse(datosLocales).alumnos || [] : [];
    
    if (registros.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No hay registros de convivencia</p>';
        return;
    }
    
    const iconos = { positiva: '✅', conflicto: '⚠️', intervencion: '🔧' };
    const resultados = { favorable: '✅ Favorable', regular: '⚠️ Regular', 'requiere-seguimiento': '🔶 Requiere Seguimiento' };
    
    container.innerHTML = '<h3 style="margin:20px 0 10px 0;">📋 Registros Recientes</h3>' +
        registros.slice(-10).reverse().map(function(r) {
            const alumno = alumnos.find(a => a.id === r.alumnoId);
            return '<div class="convivencia-card">' +
                '<h4>' + iconos[r.tipo] + ' ' + (alumno ? alumno.nombre : 'Alumno') + ' - ' + r.tipo + '</h4>' +
                '<p><strong>Situación:</strong> ' + r.descripcion + '</p>' +
                '<p><strong>Estrategia:</strong> ' + (r.estrategia || 'N/A') + '</p>' +
                '<p><strong>Resultado:</strong> ' + resultados[r.resultado] + '</p>' +
                '<small style="color:#999;">📅 ' + r.fecha + '</small>' +
                '</div>';
        }).join('');
}

// ─────────────────────────────────────────────────────────────────────
// PROYECTOS COMUNITARIOS
// ─────────────────────────────────────────────────────────────────────
window.guardarProyecto = function() {
    const nombre = document.getElementById('proyecto-nombre').value;
    const objetivo = document.getElementById('proyecto-objetivo').value;
    const participacion = document.getElementById('proyecto-participacion').value;
    const actividades = document.getElementById('proyecto-actividades').value;
    const reflexion = document.getElementById('proyecto-reflexion').value;
    const fechaInicio = document.getElementById('proyecto-fecha-inicio').value;
    const fechaFin = document.getElementById('proyecto-fecha-fin').value;
    
    if (!nombre || !objetivo) {
        alert('⚠️ Completa los campos obligatorios');
        return;
    }
    
    const proyecto = {
        id: 'PROY_' + Date.now(),
        nombre: nombre,
        objetivo: objetivo,
        participacion: participacion,
        actividades: actividades,
        reflexion: reflexion,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        campo: 'etica'
    };
    
    let proyectos = JSON.parse(localStorage.getItem('aulaPreescolar_proyectos') || '[]');
    proyectos.push(proyecto);
    localStorage.setItem('aulaPreescolar_proyectos', JSON.stringify(proyectos));
    
    alert('✅ Proyecto guardado');
    document.getElementById('proyecto-nombre').value = '';
    document.getElementById('proyecto-objetivo').value = '';
    document.getElementById('proyecto-actividades').value = '';
    document.getElementById('proyecto-reflexion').value = '';
    
    cargarProyectosGuardados();
};

function cargarProyectosGuardados() {
    const container = document.getElementById('lista-proyectos');
    if (!container) return;
    
    const proyectos = JSON.parse(localStorage.getItem('aulaPreescolar_proyectos') || '[]');
    
    if (proyectos.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No hay proyectos registrados</p>';
        return;
    }
    
    const participacionInfo = { alta: '🟢 Alta', media: '🟡 Media', baja: '🔴 Baja' };
    
    container.innerHTML = '<h3 style="margin:20px 0 10px 0;">🌱 Proyectos Registrados</h3>' +
        proyectos.map(function(p) {
            return '<div class="proyecto-card">' +
                '<h4>🌱 ' + p.nombre + '</h4>' +
                '<p><strong>Objetivo:</strong> ' + p.objetivo + '</p>' +
                '<p><strong>Participación:</strong> ' + participacionInfo[p.participacion] + '</p>' +
                '<p><strong>Actividades:</strong> ' + p.actividades + '</p>' +
                '<p><strong>Reflexión:</strong> ' + (p.reflexion || 'N/A') + '</p>' +
                '<small style="color:#666;">📅 ' + (p.fechaInicio || '') + ' - ' + (p.fechaFin || '') + '</small>' +
                '</div>';
        }).join('');
}

// ─────────────────────────────────────────────────────────────────────
// VALORES TRABAJADOS
// ─────────────────────────────────────────────────────────────────────
window.toggleValor = function(checkbox) {
    if (checkbox.checked) {
        checkbox.parentElement.classList.add('checked');
        if (!valoresSeleccionados.includes(checkbox.value)) {
            valoresSeleccionados.push(checkbox.value);
        }
    } else {
        checkbox.parentElement.classList.remove('checked');
        valoresSeleccionados = valoresSeleccionados.filter(v => v !== checkbox.value);
    }
};

window.guardarValores = function() {
    const semana = document.getElementById('valores-semana').value;
    const observaciones = document.getElementById('valores-observaciones').value;
    
    if (valoresSeleccionados.length === 0) {
        alert('⚠️ Selecciona al menos un valor');
        return;
    }
    
    const registro = {
        id: 'VAL_' + Date.now(),
        semana: semana,
        valores: valoresSeleccionados,
        observaciones: observaciones,
        fecha: new Date().toISOString()
    };
    
    let valores = JSON.parse(localStorage.getItem('aulaPreescolar_valores') || '[]');
    valores.push(registro);
    localStorage.setItem('aulaPreescolar_valores', JSON.stringify(valores));
    
    alert('✅ Valores guardados');
    document.getElementById('valores-observaciones').value = '';
    document.querySelectorAll('.valor-checkbox input').forEach(cb => {
        cb.checked = false;
        cb.parentElement.classList.remove('checked');
    });
    valoresSeleccionados = [];
    
    cargarValoresGuardados();
};

function cargarValoresGuardados() {
    const container = document.getElementById('lista-valores');
    if (!container) return;
    
    const registros = JSON.parse(localStorage.getItem('aulaPreescolar_valores') || '[]');
    
    if (registros.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No hay valores registrados</p>';
        return;
    }
    
    const nombresValores = {
        respeto: '🤝 Respeto', empatia: '💕 Empatía', honestidad: '✨ Honestidad',
        responsabilidad: '📋 Responsabilidad', colaboracion: '👥 Colaboración',
        tolerancia: '🌈 Tolerancia', gratitud: '🙏 Gratitud', solidaridad: '💚 Solidaridad'
    };
    
    container.innerHTML = '<h3 style="margin:20px 0 10px 0;">⭐ Valores Registrados</h3>' +
        registros.slice(-10).reverse().map(function(r) {
            return '<div class="convivencia-card">' +
                '<h4>📅 Semana: ' + (r.semana || 'Sin especificar') + '</h4>' +
                '<p><strong>Valores:</strong> ' + r.valores.map(v => nombresValores[v]).join(', ') + '</p>' +
                '<p><strong>Observaciones:</strong> ' + (r.observaciones || 'N/A') + '</p>' +
                '</div>';
        }).join('');
}

// ─────────────────────────────────────────────────────────────────────
// EVALUACIÓN
// ─────────────────────────────────────────────────────────────────────
function cargarAlumnosEvaluacionEtica() {
    const container = document.getElementById('lista-alumnos-evaluacion-etica');
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
        { id: 'convivencia', nombre: 'Convivencia' },
        { id: 'valores', nombre: 'Valores' },
        { id: 'medio_ambiente', nombre: 'Medio Ambiente' },
        { id: 'comunidad', nombre: 'Comunidad' }
    ];
    
    container.innerHTML = alumnos.map(function(alumno) {
        return '<div class="alumno-eval-card" data-alumno="' + alumno.id + '" style="background:white;padding:20px;border-radius:12px;border:2px solid #FFE66D;margin:15px 0;">' +
            '<h4 style="margin:0 0 15px 0;color:#F57F17;">👶 ' + alumno.nombre + '</h4>' +
            '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">' +
            criterios.map(function(crit) {
                return '<div>' +
                    '<label style="font-size:13px;color:#666;">' + crit.nombre + ':</label>' +
                    '<div class="nivel-selector">' +
                    '<button class="nivel-btn inicial" onclick="seleccionarNivelEtica(\'' + alumno.id + '\', \'' + crit.id + '\', \'inicial\')">Inicial</button>' +
                    '<button class="nivel-btn proceso" onclick="seleccionarNivelEtica(\'' + alumno.id + '\', \'' + crit.id + '\', \'proceso\')">Proceso</button>' +
                    '<button class="nivel-btn logrado" onclick="seleccionarNivelEtica(\'' + alumno.id + '\', \'' + crit.id + '\', \'logrado\')">Logrado</button>' +
                    '<button class="nivel-btn sobresaliente" onclick="seleccionarNivelEtica(\'' + alumno.id + '\', \'' + crit.id + '\', \'sobresaliente\')">Sobresaliente</button>' +
                    '</div>' +
                    '</div>';
            }).join('') +
            '</div>' +
            '<textarea placeholder="Observaciones..." style="width:100%;margin-top:15px;padding:10px;border:2px solid #ddd;border-radius:8px;font-size:13px;" data-obs="' + alumno.id + '"></textarea>' +
            '</div>';
    }).join('');
}

window.seleccionarNivelEtica = function(alumnoId, criterioId, nivel) {
    const card = document.querySelector('.alumno-eval-card[data-alumno="' + alumnoId + '"]');
    if (!card) return;
    
    // Buscar solo los botones dentro del mismo criterio (mismo padre)
    const botonPadre = event.target.closest('div');
    if (botonPadre) {
        botonPadre.querySelectorAll('.nivel-btn').forEach(btn => btn.classList.remove('selected'));
    }
    
    event.target.classList.add('selected');
    
    let evaluaciones = JSON.parse(localStorage.getItem('aulaPreescolar_evaluaciones_etica') || '{}');
    if (!evaluaciones[alumnoId]) evaluaciones[alumnoId] = {};
    evaluaciones[alumnoId][criterioId] = nivel;
    localStorage.setItem('aulaPreescolar_evaluaciones_etica', JSON.stringify(evaluaciones));
};

// ─────────────────────────────────────────────────────────────────────
// GENERAR REPORTE PDF - ÉTICA
// ─────────────────────────────────────────────────────────────────────
window.generarReporteEticaPDF = function() {
    const periodo = document.getElementById('evaluacion-periodo').value;
    const evaluaciones = JSON.parse(localStorage.getItem('aulaPreescolar_evaluaciones_etica') || '{}');
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
    doc.setFillColor(255, 230, 109);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFontSize(22);
    doc.setTextColor(93, 64, 55);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE EVALUACIÓN', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('Campo Formativo: ÉTICA, NATURALEZA Y SOCIEDADES', 105, 30, { align: 'center' });
    
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
        doc.setTextColor(245, 127, 23);
        doc.text((index + 1) + '. ' + alumno.nombre, 20, yPos);
        yPos += 10;
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        
        const evalAlumno = evaluaciones[alumno.id] || {};
        const criterios = ['convivencia', 'valores', 'medio_ambiente', 'comunidad'];
        const nombresCrit = ['Convivencia', 'Valores', 'Medio Ambiente', 'Comunidad'];
        
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
    doc.setTextColor(245, 127, 23);
    doc.text('RECOMENDACIONES GENERALES', 20, yPos);
    yPos += 15;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    const recomendaciones = [
        '• Fomentar la participación en actividades comunitarias',
        '• Reforzar valores mediante el ejemplo cotidiano',
        '• Promover el cuidado del medio ambiente en casa',
        '• Establecer rutinas de convivencia familiar',
        '• Reconocer y celebrar los logros en valores'
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
    
    const nombreArchivo = 'Reporte_Etica_' + periodo + '.pdf';
    doc.save(nombreArchivo);
    
    console.log('✅ PDF generado:', nombreArchivo);
    alert('✅ Reporte PDF generado exitosamente');
};


console.log('✅ Etica.js completo cargado');
