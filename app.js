// ─────────────────────────────────────────────────────────────────────
// AULA PREESCOLAR - APP PRINCIPAL (FASE 1 - MEJORADA)
// ─────────────────────────────────────────────────────────────────────

const app = {
    datos: {
        maestra: { nombre: '', grupo: '', ciclo: '' },
        alumnos: [],
        planificaciones: [],
        asistencia: [],
        actividadesFavoritas: [],
        ajustes: { recordatorios: true }
    },
    deferredPrompt: null,

    init: function() {
        console.log('🎓 Aula Preescolar iniciado');
        this.cargarDatos();
        this.actualizarUI();
        this.initPWAInstall();
        this.mostrarPantalla('home-screen');
        
        var fechaInput = document.getElementById('asistencia-fecha');
        if (fechaInput) {
            fechaInput.valueAsDate = new Date();
        }
    },

    mostrarPantalla: function(id) {
        document.querySelectorAll('.screen').forEach(function(s) {
            s.classList.remove('active');
        });
        var screen = document.getElementById(id);
        if (screen) {
            screen.classList.add('active');
            window.scrollTo(0, 0);
        }
        
        if (id === 'alumnos-screen') this.renderAlumnos();
        if (id === 'asistencia-screen') this.renderAsistencia();
        if (id === 'actividades-screen') this.filtrarActividades();
        if (id === 'planificar-screen') this.renderPlanes();
        if (id === 'recursos-screen') this.renderRecursos();
        if (id === 'ajustes-screen') this.cargarAjustes();
    },

    actualizarUI: function() {
        var nombreEl = document.getElementById('maestra-nombre');
        var grupoEl = document.getElementById('maestra-grupo');
        if (nombreEl && this.datos.maestra.nombre) {
            nombreEl.textContent = '👋 ¡Hola, ' + this.datos.maestra.nombre + '!';
        }
        if (grupoEl && this.datos.maestra.grupo) {
            grupoEl.textContent = 'Grupo: ' + this.datos.maestra.grupo + ' años | ' + (this.datos.maestra.ciclo || '2026-2027');
        }

        document.getElementById('stat-alumnos').textContent = this.datos.alumnos.length;
        document.getElementById('stat-actividades').textContent = typeof ACTIVIDADES_PRECARGADAS !== 'undefined' ? ACTIVIDADES_PRECARGADAS.length : 0;
        document.getElementById('stat-planificaciones').textContent = this.datos.planificaciones.length;
    },

    cargarDatos: function() {
        try {
            var s = localStorage.getItem('aulaPreescolar_data');
            if (s) {
                this.datos = JSON.parse(s);
            }
        } catch(e) {
            console.log('Datos por defecto');
        }
    },

    guardarDatos: function() {
        localStorage.setItem('aulaPreescolar_data', JSON.stringify(this.datos));
        this.actualizarUI();
    },

    agregarAlumno: function() {
        var input = document.getElementById('alumno-nombre');
        var nombre = input ? input.value.trim() : '';
        
        if (!nombre) {
            alert('⚠️ Ingresa un nombre');
            return;
        }

        var alumno = {
            id: 'ALU' + Date.now(),
            nombre: nombre,
            fechaRegistro: new Date().toISOString()
        };

        this.datos.alumnos.push(alumno);
        this.guardarDatos();
        
        if (input) input.value = '';
        this.renderAlumnos();
        alert('✅ Alumno agregado');
    },

    eliminarAlumno: function(id) {
        if (confirm('¿Eliminar este alumno?')) {
            this.datos.alumnos = this.datos.alumnos.filter(function(a) { return a.id !== id; });
            this.guardarDatos();
            this.renderAlumnos();
        }
    },

    renderAlumnos: function() {
        var container = document.getElementById('lista-alumnos');
        if (!container) return;

        if (this.datos.alumnos.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">🌸 No hay alumnos registrados</p>';
            return;
        }

        container.innerHTML = this.datos.alumnos.map(function(alumno) {
            return '<div class="alumno-item">' +
                '<span><strong>👶 ' + alumno.nombre + '</strong></span>' +
                '<button onclick="app.eliminarAlumno(\'' + alumno.id + '\')">🗑️</button>' +
                '</div>';
        }).join('');
    },

    renderAsistencia: function() {
        var container = document.getElementById('lista-asistencia');
        if (!container) return;

        if (this.datos.alumnos.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">🌸 Primero registra alumnos</p>';
            return;
        }

        var fecha = document.getElementById('asistencia-fecha').value || new Date().toISOString().split('T')[0];

        container.innerHTML = this.datos.alumnos.map(function(alumno) {
            return '<div class="asistencia-item">' +
                '<span><strong>👶 ' + alumno.nombre + '</strong></span>' +
                '<select data-alumno="' + alumno.id + '">' +
                '<option value="presente">✅ Presente</option>' +
                '<option value="ausente">❌ Ausente</option>' +
                '<option value="justificada">⚠️ Justificada</option>' +
                '</select>' +
                '</div>';
        }).join('');
    },

    guardarAsistencia: function() {
        var fecha = document.getElementById('asistencia-fecha').value;
        if (!fecha) {
            alert('⚠️ Selecciona una fecha');
            return;
        }

        var registros = [];
        document.querySelectorAll('.asistencia-item select').forEach(function(select) {
            registros.push({
                alumnoId: select.dataset.alumno,
                estado: select.value,
                fecha: fecha
            });
        });

        this.datos.asistencia = this.datos.asistencia.filter(function(r) { return r.fecha !== fecha; });
        this.datos.asistencia = this.datos.asistencia.concat(registros);
        this.guardarDatos();
        
        alert('✅ Asistencia guardada');
    },

    exportarAsistenciaExcel: function() {
        if (this.datos.asistencia.length === 0) {
            alert('⚠️ No hay registros de asistencia');
            return;
        }

        var csv = 'Fecha,Alumno,Estado\n';
        this.datos.asistencia.forEach(function(r) {
            var alumno = app.datos.alumnos.find(function(a) { return a.id === r.alumnoId; });
            csv += r.fecha + ',' + (alumno ? alumno.nombre : 'N/A') + ',' + r.estado + '\n';
        });

        var blob = new Blob([csv], { type: 'text/csv' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'asistencia_' + new Date().toISOString().split('T')[0] + '.csv';
        a.click();
        URL.revokeObjectURL(url);
    },

    exportarTodoExcel: function() {
        // ✅ FUNCIÓN AGREGADA - Exportar todo a Excel (múltiples hojas)
        var csv = '=== ALUMNOS ===\nNombre,Fecha Registro\n';
        this.datos.alumnos.forEach(function(a) {
            csv += a.nombre + ',' + a.fechaRegistro.split('T')[0] + '\n';
        });

        csv += '\n=== ASISTENCIA ===\nFecha,Alumno,Estado\n';
        this.datos.asistencia.forEach(function(r) {
            var alumno = app.datos.alumnos.find(function(a) { return a.id === r.alumnoId; });
            csv += r.fecha + ',' + (alumno ? alumno.nombre : 'N/A') + ',' + r.estado + '\n';
        });

        csv += '\n=== PLANIFICACIONES ===\nSemana,Campo,Actividad,Materiales,Tiempo\n';
        this.datos.planificaciones.forEach(function(p) {
            csv += p.semana + ',' + p.campo + ',"' + p.actividad + '","' + p.materiales + '",' + p.tiempo + '\n';
        });

        var blob = new Blob([csv], { type: 'text/csv' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'aulaPreescolar_completo_' + new Date().toISOString().split('T')[0] + '.csv';
        a.click();
        URL.revokeObjectURL(url);
        
        alert('✅ Datos exportados correctamente');
    },

    filtrarActividades: function() {
        var container = document.getElementById('lista-actividades');
        if (!container) return;

        var filtro = document.getElementById('actividades-filtro').value;
        var actividades = typeof ACTIVIDADES_PRECARGADAS !== 'undefined' ? ACTIVIDADES_PRECARGADAS : [];

        if (filtro !== 'todos') {
            actividades = actividades.filter(function(a) { return a.campo === filtro; });
        }

        if (actividades.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">🌸 No hay actividades</p>';
            return;
        }

        container.innerHTML = actividades.map(function(act) {
            return '<div class="actividad-card">' +
                '<h4>🎨 ' + act.nombre + '</h4>' +
                '<span class="actividad-tag">' + act.campo.toUpperCase() + '</span>' +
                '<p><strong>Descripción:</strong> ' + act.descripcion + '</p>' +
                '<p><strong>Materiales:</strong> ' + act.materiales + '</p>' +
                '<p><strong>Tiempo:</strong> ' + act.tiempo + ' min | <strong>Edad:</strong> ' + act.edad + '</p>' +
                '<button class="btn btn-primary" onclick="app.usarActividad(' + act.id + ')" style="margin-top:10px;">📝 Usar en Planificación</button>' +
                '</div>';
        }).join('');
    },

    usarActividad: function(id) {
        var actividad = ACTIVIDADES_PRECARGADAS.find(function(a) { return a.id == id; });
        if (!actividad) return;

        document.getElementById('plan-campo').value = actividad.campo;
        document.getElementById('plan-actividad').value = actividad.descripcion;
        document.getElementById('plan-materiales').value = actividad.materiales;
        document.getElementById('plan-tiempo').value = actividad.tiempo;
        
        this.mostrarPantalla('planificar-screen');
        alert('✅ Actividad cargada en planificación');
    },

    guardarPlanificacion: function() {
        var semana = document.getElementById('plan-semana').value;
        var campo = document.getElementById('plan-campo').value;
        var actividad = document.getElementById('plan-actividad').value;
        var materiales = document.getElementById('plan-materiales').value;
        var tiempo = document.getElementById('plan-tiempo').value;

        if (!semana || !campo || !actividad) {
            alert('⚠️ Completa los campos obligatorios');
            return;
        }

        var plan = {
            id: 'PLAN' + Date.now(),
            semana: semana,
            campo: campo,
            actividad: actividad,
            materiales: materiales,
            tiempo: tiempo,
            fecha: new Date().toISOString()
        };

        this.datos.planificaciones.push(plan);
        this.guardarDatos();
        
        document.getElementById('plan-actividad').value = '';
        document.getElementById('plan-materiales').value = '';
        
        this.renderPlanes();
        alert('✅ Planificación guardada');
    },

    renderPlanes: function() {
        var container = document.getElementById('planes-guardados');
        if (!container) return;

        if (this.datos.planificaciones.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">🌸 No hay planificaciones guardadas</p>';
            return;
        }

        container.innerHTML = '<h3 style="margin:20px 0 10px 0;">📋 Planes Guardados</h3>' +
            this.datos.planificaciones.map(function(plan) {
                return '<div class="actividad-card">' +
                    '<h4>Semana: ' + plan.semana + '</h4>' +
                    '<span class="actividad-tag">' + plan.campo.toUpperCase() + '</span>' +
                    '<p>' + plan.actividad + '</p>' +
                    '<p><strong>Materiales:</strong> ' + plan.materiales + ' | <strong>Tiempo:</strong> ' + plan.tiempo + ' min</p>' +
                    '<button class="btn btn-danger" onclick="app.eliminarPlan(\'' + plan.id + '\')" style="margin-top:10px;">🗑️ Eliminar</button>' +
                    '</div>';
            }).join('');
    },

    eliminarPlan: function(id) {
        if (confirm('¿Eliminar esta planificación?')) {
            this.datos.planificaciones = this.datos.planificaciones.filter(function(p) { return p.id !== id; });
            this.guardarDatos();
            this.renderPlanes();
        }
    },

    renderRecursos: function() {
        var container = document.getElementById('lista-recursos');
        if (!container) return;

        var recursos = [
            { nombre: 'Lista de Asistencia (PDF)', tipo: 'PDF' },
            { nombre: 'Planificación Semanal (PDF)', tipo: 'PDF' },
            { nombre: 'Calendario Escolar', tipo: 'PDF' },
            { nombre: 'Carteles de Colores', tipo: 'PDF' },
            { nombre: 'Carteles de Números', tipo: 'PDF' }
        ];

        container.innerHTML = recursos.map(function(rec) {
            return '<div class="actividad-card">' +
                '<h4>📄 ' + rec.nombre + '</h4>' +
                '<span class="actividad-tag">' + rec.tipo + '</span>' +
                '<button class="btn btn-primary" onclick="app.descargarRecurso(\'' + rec.nombre + '\')" style="margin-top:10px;">📥 Descargar</button>' +
                '</div>';
        }).join('');
    },

    descargarRecurso: function(nombre) {
        alert('ℹ️ En producción, esto descargaría: ' + nombre + '\n\nPuedes crear estos PDFs y ponerlos en la carpeta /recursos/');
    },

    exportarDatos: function() {
        var fecha = new Date().toISOString().split('T')[0];
        var blob = new Blob([JSON.stringify(this.datos, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'aulaPreescolar_respaldo_' + fecha + '.json';
        a.click();
        URL.revokeObjectURL(url);
        alert('✅ Respaldo descargado. Guárdalo en un lugar seguro.');
    },

    importarDatos: function() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                try {
                    var datos = JSON.parse(e.target.result);
                    localStorage.setItem('aulaPreescolar_data', JSON.stringify(datos));
                    alert('✅ Datos restaurados correctamente');
                    location.reload();
                } catch(err) {
                    alert('❌ Archivo inválido: ' + err.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },

    cargarAjustes: function() {
        document.getElementById('ajuste-nombre').value = this.datos.maestra.nombre || '';
        document.getElementById('ajuste-grupo').value = this.datos.maestra.grupo || '3';
        document.getElementById('ajuste-ciclo').value = this.datos.maestra.ciclo || '2026-2027';
    },

    guardarAjustes: function() {
        this.datos.maestra.nombre = document.getElementById('ajuste-nombre').value;
        this.datos.maestra.grupo = document.getElementById('ajuste-grupo').value;
        this.datos.maestra.ciclo = document.getElementById('ajuste-ciclo').value;
        this.guardarDatos();
        alert('✅ Ajustes guardados');
    },

    borrarTodo: function() {
        if (confirm('⚠️ ¿Estás seguro? Esto borrará TODOS tus datos.')) {
            localStorage.removeItem('aulaPreescolar_data');
            location.reload();
        }
    },

    initPWAInstall: function() {
        var self = this;
        window.addEventListener('beforeinstallprompt', function(e) {
            console.log('PWA instalable');
            e.preventDefault();
            self.deferredPrompt = e;
            var banner = document.getElementById('pwa-install-banner');
            if (banner) banner.style.display = 'block';
        });

        window.addEventListener('appinstalled', function() {
            console.log('PWA instalada');
            self.deferredPrompt = null;
            var banner = document.getElementById('pwa-install-banner');
            if (banner) banner.style.display = 'none';
        });
    },

    instalarPWA: function() {
        var self = this;
        if (!this.deferredPrompt) {
            alert('Menú navegador → "Agregar a pantalla principal"');
            return;
        }
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then(function(r) {
            console.log('Instalación:', r.outcome);
            self.deferredPrompt = null;
            var banner = document.getElementById('pwa-install-banner');
            if (banner) banner.style.display = 'none';
        });
    }
};

// Iniciar cuando DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 DOM listo');
    app.init();
});
