// ─────────────────────────────────────────────────────────────────────
// AULA PREESCOLAR - DASHBOARD CON GRÁFICA RADAR
// ─────────────────────────────────────────────────────────────────────

console.log('📊 Dashboard cargado');

let radarChartInstance = null;

// Campos formativos del Plan 2022
const CAMPOS_FORMATIVOS = [
    { id: 'lenguajes', nombre: 'Lenguajes', icono: '📚', color: '#FF6B9D' },
    { id: 'saberes', nombre: 'Saberes y Pensamiento Científico', icono: '🔬', color: '#4ECDC4' },
    { id: 'etica', nombre: 'Ética, Naturaleza y Sociedades', icono: '🤝', color: '#FFE66D' },
    { id: 'humano', nombre: 'De lo Humano y lo Comunitario', icono: '💚', color: '#95E1D3' }
];

// Niveles de logro y sus valores numéricos
const NIVELES_VALORES = {
    'inicial': 25,
    'proceso': 50,
    'logrado': 75,
    'sobresaliente': 100
};

// ─────────────────────────────────────────────────────────────────────
// INICIALIZACIÓN
// ─────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async function() {
    console.log('📊 Dashboard.js inicializado');
    
    // Cargar alumnos en el selector
    cargarAlumnosEnSelector();
    
    // Cargar estadísticas generales
    cargarEstadisticasGenerales();
    
    // Cargar alertas tempranas
    cargarAlertasTempranas();
    
    console.log('✅ Dashboard.js listo');
});

// ─────────────────────────────────────────────────────────────────────
// CARGAR ALUMNOS EN SELECTOR
// ─────────────────────────────────────────────────────────────────────
function cargarAlumnosEnSelector() {
    const datosLocales = localStorage.getItem('aulaPreescolar_data');
    if (!datosLocales) {
        console.log('⚠️ No hay datos de alumnos');
        return;
    }
    
    const datos = JSON.parse(datosLocales);
    const alumnos = datos.alumnos || [];
    
    const select = document.getElementById('dashboard-alumno');
    if (!select) return;
    
    select.innerHTML = '<option value="">Seleccionar alumno para ver su gráfica...</option>' +
        alumnos.map(function(a) {
            return '<option value="' + a.id + '">' + a.nombre + '</option>';
        }).join('');
}

// ─────────────────────────────────────────────────────────────────────
// CARGAR ESTADÍSTICAS GENERALES
// ─────────────────────────────────────────────────────────────────────
function cargarEstadisticasGenerales() {
    const datosLocales = localStorage.getItem('aulaPreescolar_data');
    const datos = datosLocales ? JSON.parse(datosLocales) : { alumnos: [] };
    const alumnos = datos.alumnos || [];
    
    // Contar evaluaciones por campo
    const evaluacionesLenguajes = JSON.parse(localStorage.getItem('aulaPreescolar_evaluaciones') || '{}');
    const evaluacionesSaberes = JSON.parse(localStorage.getItem('aulaPreescolar_evaluaciones_saberes') || '{}');
    
    // Total de evaluaciones
    const totalEvaluados = Object.keys(evaluacionesLenguajes['lenguajes'] || {}).length +
                           Object.keys(evaluacionesSaberes || {}).length;
    
    // Contar alertas (nivel inicial en algún campo)
    let alertasCount = 0;
    alumnos.forEach(function(alumno) {
        const evalLeng = evaluacionesLenguajes['lenguajes'] ? evaluacionesLenguajes['lenguajes'][alumno.id] : null;
        if (evalLeng === 'inicial') alertasCount++;
    });
    
    // Calcular promedio
    let sumaNiveles = 0;
    let countNiveles = 0;
    
    Object.values(evaluacionesLenguajes['lenguajes'] || {}).forEach(function(nivel) {
        if (NIVELES_VALORES[nivel]) {
            sumaNiveles += NIVELES_VALORES[nivel];
            countNiveles++;
        }
    });
    
    const promedio = countNiveles > 0 ? Math.round(sumaNiveles / countNiveles) : 0;
    
    // Actualizar UI
    document.getElementById('stat-total-alumnos').textContent = alumnos.length;
    document.getElementById('stat-evaluados').textContent = totalEvaluados;
    document.getElementById('stat-alertas').textContent = alertasCount;
    document.getElementById('stat-promedio').textContent = promedio + '%';
}

// ─────────────────────────────────────────────────────────────────────
// CARGAR GRÁFICA DE ALUMNO
// ─────────────────────────────────────────────────────────────────────
window.cargarGraficaAlumno = function() {
    const alumnoId = document.getElementById('dashboard-alumno').value;
    if (!alumnoId) {
        // Limpiar gráfica si no hay selección
        if (radarChartInstance) {
            radarChartInstance.destroy();
            radarChartInstance = null;
        }
        document.getElementById('radar-leyenda').innerHTML = '';
        return;
    }
    
    // Obtener evaluaciones del alumno por campo
    const datosAlumno = obtenerEvaluacionesAlumno(alumnoId);
    
    // Crear/Actualizar gráfica radar
    crearGraficaRadar(datosAlumno);
    
    // Actualizar leyenda
    actualizarLeyenda(datosAlumno);
};

// ─────────────────────────────────────────────────────────────────────
// OBTENER EVALUACIONES DE UN ALUMNO
// ─────────────────────────────────────────────────────────────────────
function obtenerEvaluacionesAlumno(alumnoId) {
    const evaluacionesLenguajes = JSON.parse(localStorage.getItem('aulaPreescolar_evaluaciones') || '{}');
    const evaluacionesSaberes = JSON.parse(localStorage.getItem('aulaPreescolar_evaluaciones_saberes') || '{}');
    
    // Lenguajes
    const nivelLenguajes = evaluacionesLenguajes['lenguajes'] ? 
        evaluacionesLenguajes['lenguajes'][alumnoId] : 'proceso';
    
    // Saberes (promedio de competencias)
    const evalSaberes = evaluacionesSaberes[alumnoId] || {};
    const saberesNiveles = Object.values(evalSaberes);
    let saberesPromedio = 'proceso';
    if (saberesNiveles.length > 0) {
        const cuentaInicial = saberesNiveles.filter(n => n === 'inicial').length;
        const cuentaSobresaliente = saberesNiveles.filter(n => n === 'sobresaliente').length;
        if (cuentaInicial > saberesNiveles.length / 2) saberesPromedio = 'inicial';
        else if (cuentaSobresaliente > saberesNiveles.length / 2) saberesPromedio = 'sobresaliente';
        else if (saberesNiveles.includes('logrado')) saberesPromedio = 'logrado';
    }
    
    // Ética y Humano (por ahora usar proceso como default)
    const nivelEtica = 'proceso';
    const nivelHumano = 'proceso';
    
    return {
        'lenguajes': nivelLenguajes,
        'saberes': saberesPromedio,
        'etica': nivelEtica,
        'humano': nivelHumano
    };
}

// ─────────────────────────────────────────────────────────────────────
// CREAR GRÁFICA RADAR
// ─────────────────────────────────────────────────────────────────────
function crearGraficaRadar(datosAlumno) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    
    // Convertir niveles a valores numéricos
    const datosValores = CAMPOS_FORMATIVOS.map(function(campo) {
        return NIVELES_VALORES[datosAlumno[campo.id]] || 50;
    });
    
    // Destruir gráfica anterior si existe
    if (radarChartInstance) {
        radarChartInstance.destroy();
    }
    
    // Crear nueva gráfica
    radarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: CAMPOS_FORMATIVOS.map(c => c.icono + ' ' + c.nombre),
            datasets: [{
                label: 'Nivel de Logro',
                data: datosValores,
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2,
                pointBackgroundColor: CAMPOS_FORMATIVOS.map(c => c.color),
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: CAMPOS_FORMATIVOS.map(c => c.color)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    angleLines: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    pointLabels: {
                        font: {
                            size: 12,
                            family: "'Segoe UI', 'Roboto', sans-serif"
                        },
                        color: '#333'
                    },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: {
                        stepSize: 25,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const valor = context.raw;
                            let nivel = 'proceso';
                            if (valor >= 87.5) nivel = 'sobresaliente';
                            else if (valor >= 62.5) nivel = 'logrado';
                            else if (valor >= 37.5) nivel = 'proceso';
                            else nivel = 'inicial';
                            
                            return 'Nivel: ' + nivel.charAt(0).toUpperCase() + nivel.slice(1) + ' (' + valor + '%)';
                        }
                    }
                }
            }
        }
    });
}

// ─────────────────────────────────────────────────────────────────────
// ACTUALIZAR LEYENDA
// ─────────────────────────────────────────────────────────────────────
function actualizarLeyenda(datosAlumno) {
    const container = document.getElementById('radar-leyenda');
    if (!container) return;
    
    const nivelesInfo = {
        'inicial': { color: '#f44336', texto: 'Requiere Apoyo' },
        'proceso': { color: '#FFC107', texto: 'En Proceso' },
        'logrado': { color: '#4CAF50', texto: 'Logrado' },
        'sobresaliente': { color: '#2196F3', texto: 'Sobresaliente' }
    };
    
    let html = '<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:15px;margin-top:15px;">';
    
    CAMPOS_FORMATIVOS.forEach(function(campo) {
        const nivel = datosAlumno[campo.id];
        const info = nivelesInfo[nivel] || nivelesInfo.proceso;
        
        html += '<div style="display:flex;align-items:center;gap:8px;">' +
            '<div style="width:16px;height:16px;border-radius:50%;background:' + info.color + ';"></div>' +
            '<span style="font-size:13px;">' + campo.icono + ' ' + info.texto + '</span>' +
            '</div>';
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// ─────────────────────────────────────────────────────────────────────
// CARGAR ALERTAS TEMPRANAS
// ─────────────────────────────────────────────────────────────────────
function cargarAlertasTempranas() {
    const container = document.getElementById('lista-alertas');
    if (!container) return;
    
    const datosLocales = localStorage.getItem('aulaPreescolar_data');
    if (!datosLocales) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No hay datos de alumnos</p>';
        return;
    }
    
    const datos = JSON.parse(datosLocales);
    const alumnos = datos.alumnos || [];
    
    const evaluacionesLenguajes = JSON.parse(localStorage.getItem('aulaPreescolar_evaluaciones') || '{}');
    
    let alertasHTML = '';
    let alertasCount = 0;
    
    alumnos.forEach(function(alumno) {
        const nivel = evaluacionesLenguajes['lenguajes'] ? 
            evaluacionesLenguajes['lenguajes'][alumno.id] : null;
        
        if (nivel === 'inicial') {
            alertasHTML += '<div class="alerta-card">' +
                '<h4 style="margin:0 0 10px 0;color:#C62828;">⚠️ ' + alumno.nombre + '</h4>' +
                '<p style="margin:0;color:#666;">Nivel <strong>Inicial</strong> en Lenguajes. Se recomienda intervención inmediata.</p>' +
                '<button class="btn btn-primary" onclick="window.location.href=\'lenguajes.html\'" style="margin-top:10px;padding:8px 20px;font-size:13px;">📝 Ver Evaluación</button>' +
                '</div>';
            alertasCount++;
        } else if (nivel === 'proceso') {
            alertasHTML += '<div class="alerta-card amarilla">' +
                '<h4 style="margin:0 0 10px 0;color:#E65100;">⚡ ' + alumno.nombre + '</h4>' +
                '<p style="margin:0;color:#666;">Nivel <strong>En Proceso</strong> en Lenguajes. Monitorear progreso.</p>' +
                '<button class="btn btn-info" onclick="window.location.href=\'lenguajes.html\'" style="margin-top:10px;padding:8px 20px;font-size:13px;">📝 Ver Evaluación</button>' +
                '</div>';
            alertasCount++;
        }
    });
    
    if (alertasCount === 0) {
        container.innerHTML = '<div class="alerta-card verde">' +
            '<h4 style="margin:0 0 10px 0;color:#2E7D32;">✅ ¡Excelente!</h4>' +
            '<p style="margin:0;color:#666;">No hay alertas tempranas. Todos los alumnos evaluados muestran progreso adecuado.</p>' +
            '</div>';
    } else {
        container.innerHTML = '<p style="color:#666;margin-bottom:15px;">Se encontraron ' + alertasCount + ' alumno(s) que requieren atención.</p>' + alertasHTML;
    }
}

// ─────────────────────────────────────────────────────────────────────
// GENERAR DASHBOARD PDF
// ─────────────────────────────────────────────────────────────────────
window.generarDashboardPDF = function() {
    alert('🚧 Próximamente: Exportar Dashboard completo a PDF\n\nEsta función generará un reporte con:\n• Gráfica radar de todos los alumnos\n• Alertas tempranas\n• Estadísticas generales\n• Recomendaciones grupales');
};

console.log('✅ Dashboard.js completo cargado');