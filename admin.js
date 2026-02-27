// ─────────────────────────────────────────────────────────────────────
// AULA PREESCOLAR - PANEL DIRECTIVO
// ─────────────────────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', async function() {
    console.log('🏫 Admin.js cargado');

    // Verificar sesión
    const usuario = window.obtenerUsuarioActual ? window.obtenerUsuarioActual() : null;
    
    if (!usuario || usuario.rol !== 'director') {
        alert('⚠️ Acceso solo para directores');
        window.location.href = 'login.html';
        return;
    }

    // Esperar Firebase
    if (!window.db) {
        setTimeout(arguments.callee, 500);
        return;
    }

    const { db, collection, getDocs, query, where } = window;

    // ─────────────────────────────────────────────────────────────────────
    // CARGAR DATOS DEL DASHBOARD
    // ─────────────────────────────────────────────────────────────────────
    async function cargarDashboard() {
        try {
            // Contar docentes activos
            const docentesQuery = query(collection(db, 'usuarios'), where('rol', '==', 'docente'));
            const docentesSnapshot = await getDocs(docentesQuery);
            document.getElementById('stat-docentes').textContent = docentesSnapshot.size;

            // Contar alumnos (simulado - en producción sería de Firestore)
            const datosLocales = localStorage.getItem('aulaPreescolar_data');
            if (datosLocales) {
                const datos = JSON.parse(datosLocales);
                document.getElementById('stat-alumnos').textContent = datos.alumnos ? datos.alumnos.length : 0;
                document.getElementById('stat-planeaciones').textContent = datos.planificaciones ? datos.planificaciones.length : 0;
            }

            // Asistencia (simulado)
            document.getElementById('stat-asistencia').textContent = '85%';

            // Cargar lista de docentes
            cargarListaDocentes(docentesSnapshot);

        } catch (error) {
            console.error('Error cargando dashboard:', error);
            document.getElementById('lista-docentes').innerHTML = '<p style="text-align:center;color:#f44336;">Error cargando datos</p>';
        }
    }

    function cargarListaDocentes(snapshot) {
        const container = document.getElementById('lista-docentes');
        
        if (snapshot.size === 0) {
            container.innerHTML = '<p style="text-align:center;color:#666;">No hay docentes registrados</p>';
            return;
        }

        let html = '';
        snapshot.forEach(function(doc) {
            const data = doc.data();
            html += '<div class="docente-item">' +
                '<div><strong>👩‍🏫 ' + data.nombre + '</strong><br>' +
                '<small style="color:#666;">' + data.email + '</small></div>' +
                '<button class="btn btn-info" style="padding:8px 15px;font-size:13px;" onclick="alert(\'Próximamente: Ver perfil\')">👁️ Ver</button>' +
                '</div>';
        });

        container.innerHTML = html;
    }

    // Iniciar
    cargarDashboard();

    console.log('✅ Admin.js listo');
});