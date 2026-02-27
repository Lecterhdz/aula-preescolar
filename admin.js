// ─────────────────────────────────────────────────────────────────────
// AULA PREESCOLAR - PANEL DIRECTIVO (CORREGIDO)
// ─────────────────────────────────────────────────────────────────────

console.log('🏫 Admin.js cargado');

window.addEventListener('DOMContentLoaded', async function() {
    // ✅ LEER SESIÓN DIRECTAMENTE DE LOCALSTORAGE (SIN FUNCIÓN)
    const sessionStr = localStorage.getItem('aulaPreescolar_session');
    
    console.log('📋 Sesión raw:', sessionStr); // DEBUG
    
    if (!sessionStr) {
        console.log('❌ No hay sesión en localStorage');
        alert('⚠️ No hay sesión activa. Por favor inicia sesión.');
        window.location.href = 'login.html';
        return;
    }
    
    let usuario;
    try {
        usuario = JSON.parse(sessionStr);
    } catch (e) {
        console.log('❌ Error parseando sesión:', e);
        localStorage.removeItem('aulaPreescolar_session');
        alert('⚠️ Sesión inválida. Por favor inicia sesión de nuevo.');
        window.location.href = 'login.html';
        return;
    }
    
    console.log('👤 Usuario:', usuario); // DEBUG
    console.log('👤 Rol:', usuario.rol); // DEBUG
    
    // ✅ VERIFICAR ROL (CASE-INSENSITIVE)
    const rolNormalizado = (usuario.rol || '').toLowerCase().trim();
    
    if (rolNormalizado !== 'director') {
        console.log('❌ Rol no es director:', rolNormalizado);
        alert('⚠️ Acceso solo para directores.\n\nTu rol actual es: ' + usuario.rol);
        window.location.href = 'index.html';
        return;
    }
    
    console.log('✅ Acceso concedido a director:', usuario.nombre);

    // Esperar Firebase
    if (!window.db) {
        console.log('⏳ Esperando Firebase...');
        let intentos = 0;
        const esperarFirebase = setInterval(function() {
            if (window.db || intentos > 20) {
                clearInterval(esperarFirebase);
                if (window.db) {
                    cargarDashboard();
                } else {
                    console.log('❌ Firebase no disponible');
                    document.getElementById('lista-docentes').innerHTML = '<p style="text-align:center;color:#f44336;">Error: No se pudo conectar a la base de datos.</p>';
                }
            }
            intentos++;
        }, 500);
        return;
    }

    const { db, collection, getDocs, query, where } = window;

    // ─────────────────────────────────────────────────────────────────────
    // CARGAR DATOS DEL DASHBOARD
    // ─────────────────────────────────────────────────────────────────────
    async function cargarDashboard() {
        try {
            console.log('📊 Cargando dashboard...');
            
            // Contar docentes activos
            const docentesQuery = query(collection(db, 'usuarios'), where('rol', '==', 'docente'));
            const docentesSnapshot = await getDocs(docentesQuery);
            document.getElementById('stat-docentes').textContent = docentesSnapshot.size;
            console.log('👩‍🏫 Docentes:', docentesSnapshot.size);

            // Contar alumnos (de localStorage para demo)
            const datosLocales = localStorage.getItem('aulaPreescolar_data');
            if (datosLocales) {
                const datos = JSON.parse(datosLocales);
                document.getElementById('stat-alumnos').textContent = datos.alumnos ? datos.alumnos.length : 0;
                document.getElementById('stat-planeaciones').textContent = datos.planificaciones ? datos.planificaciones.length : 0;
            } else {
                document.getElementById('stat-alumnos').textContent = '0';
                document.getElementById('stat-planeaciones').textContent = '0';
            }

            // Asistencia (simulado)
            document.getElementById('stat-asistencia').textContent = '85%';

            // Cargar lista de docentes
            cargarListaDocentes(docentesSnapshot);

            console.log('✅ Dashboard cargado');

        } catch (error) {
            console.error('Error cargando dashboard:', error);
            document.getElementById('lista-docentes').innerHTML = '<p style="text-align:center;color:#666;">No se pudieron cargar los datos.</p>';
        }
    }

    function cargarListaDocentes(snapshot) {
        const container = document.getElementById('lista-docentes');
        
        if (!container) {
            console.log('❌ No se encontró lista-docentes');
            return;
        }
        
        if (snapshot.size === 0) {
            container.innerHTML = '<p style="text-align:center;color:#666;">No hay docentes registrados aún.</p>';
            return;
        }

        let html = '';
        snapshot.forEach(function(docSnapshot) {
            const data = docSnapshot.data();
            html += '<div class="docente-item">' +
                '<div><strong>👩‍🏫 ' + (data.nombre || 'Sin nombre') + '</strong><br>' +
                '<small style="color:#666;">' + (data.email || '') + '</small>' +
                (data.escuela ? '<br><small style="color:#999;">🏫 ' + data.escuela + '</small>' : '') +
                '</div>' +
                '<button class="btn btn-info" style="padding:8px 15px;font-size:13px;" onclick="alert(\'Próximamente: Ver perfil\')">👁️ Ver</button>' +
                '</div>';
        });

        container.innerHTML = html;
    }

    // Iniciar
    cargarDashboard();

    console.log('✅ Admin.js listo');
});
