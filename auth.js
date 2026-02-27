// ─────────────────────────────────────────────────────────────────────
// AULA PREESCOLAR - AUTENTICACIÓN FIREBASE
// ─────────────────────────────────────────────────────────────────────

// Esperar a que Firebase esté cargado
window.addEventListener('DOMContentLoaded', async function() {
    console.log('🔐 Auth.js cargado');

    // Verificar si Firebase está disponible
    if (!window.auth || !window.db) {
        console.log('⏳ Esperando Firebase...');
        setTimeout(arguments.callee, 500);
        return;
    }

    const { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, doc, setDoc, getDoc } = window;

    // Estado actual del usuario
    let usuarioActual = null;

    // ─────────────────────────────────────────────────────────────────────
    // CAMBIAR ENTRE LOGIN Y REGISTRO
    // ─────────────────────────────────────────────────────────────────────
    window.mostrarForm = function(tipo) {
        document.querySelectorAll('.login-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.login-form').forEach(form => form.classList.remove('active'));
        
        if (tipo === 'login') {
            document.querySelector('.login-tab:nth-child(1)').classList.add('active');
            document.getElementById('login-form').classList.add('active');
        } else {
            document.querySelector('.login-tab:nth-child(2)').classList.add('active');
            document.getElementById('registro-form').classList.add('active');
        }
        
        ocultarMensajes();
    };

    function ocultarMensajes() {
        document.getElementById('error-message').style.display = 'none';
        document.getElementById('success-message').style.display = 'none';
    }

    function mostrarError(mensaje) {
        const el = document.getElementById('error-message');
        el.textContent = '❌ ' + mensaje;
        el.style.display = 'block';
    }

    function mostrarExito(mensaje) {
        const el = document.getElementById('success-message');
        el.textContent = '✅ ' + mensaje;
        el.style.display = 'block';
    }

    // ─────────────────────────────────────────────────────────────────────
    // INICIAR SESIÓN
    // ─────────────────────────────────────────────────────────────────────
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        ocultarMensajes();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            mostrarError('Ingresa email y contraseña');
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Obtener datos del usuario de Firestore
            const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
            const userData = userDoc.exists() ? userDoc.data() : {};

            // Guardar en localStorage
            const sessionData = {
                uid: user.uid,
                email: user.email,
                nombre: userData.nombre || 'Usuario',
                rol: userData.rol || 'docente',
                escuela: userData.escuela || '',
                plan: userData.plan || 'gratis'
            };

            localStorage.setItem('aulaPreescolar_session', JSON.stringify(sessionData));

            mostrarExito('¡Bienvenida, ' + sessionData.nombre + '!');
            
            // Redirigir según rol
            setTimeout(function() {
                if (sessionData.rol === 'director') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 1500);

        } catch (error) {
            console.error('Error login:', error);
            let mensaje = 'Error al iniciar sesión';
            
            if (error.code === 'auth/invalid-email') mensaje = 'Email inválido';
            else if (error.code === 'auth/user-not-found') mensaje = 'Usuario no encontrado';
            else if (error.code === 'auth/wrong-password') mensaje = 'Contraseña incorrecta';
            else if (error.code === 'auth/too-many-requests') mensaje = 'Demasiados intentos. Intenta después';
            
            mostrarError(mensaje);
        }
    });

    // ─────────────────────────────────────────────────────────────────────
    // REGISTRARSE
    // ─────────────────────────────────────────────────────────────────────
    document.getElementById('registro-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        ocultarMensajes();

        const nombre = document.getElementById('registro-nombre').value.trim();
        const escuela = document.getElementById('registro-escuela').value.trim();
        const email = document.getElementById('registro-email').value.trim();
        const password = document.getElementById('registro-password').value;
        const rol = document.getElementById('registro-rol').value;

        if (!nombre || !email || !password) {
            mostrarError('Completa los campos obligatorios');
            return;
        }

        if (password.length < 6) {
            mostrarError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            // Crear usuario en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Guardar datos en Firestore
            await setDoc(doc(db, 'usuarios', user.uid), {
                nombre: nombre,
                email: email,
                escuela: escuela,
                rol: rol,
                plan: 'gratis',
                fechaRegistro: new Date().toISOString(),
                activo: true
            });

            // Guardar sesión
            const sessionData = {
                uid: user.uid,
                email: email,
                nombre: nombre,
                rol: rol,
                escuela: escuela,
                plan: 'gratis'
            };

            localStorage.setItem('aulaPreescolar_session', JSON.stringify(sessionData));

            mostrarExito('¡Cuenta creada exitosamente!');
            
            setTimeout(function() {
                window.location.href = rol === 'director' ? 'admin.html' : 'index.html';
            }, 1500);

        } catch (error) {
            console.error('Error registro:', error);
            let mensaje = 'Error al crear cuenta';
            
            if (error.code === 'auth/email-already-in-use') mensaje = 'Este email ya está registrado';
            else if (error.code === 'auth/invalid-email') mensaje = 'Email inválido';
            else if (error.code === 'auth/weak-password') mensaje = 'Contraseña muy débil (mínimo 6 caracteres)';
            
            mostrarError(mensaje);
        }
    });

    // ─────────────────────────────────────────────────────────────────────
    // ENTRAR COMO INVITADO
    // ─────────────────────────────────────────────────────────────────────
    window.entrarComoInvitado = function() {
        const sessionData = {
            uid: 'guest_' + Date.now(),
            email: 'invitado@temporal.com',
            nombre: 'Invitado',
            rol: 'docente',
            escuela: '',
            plan: 'gratis'
        };

        localStorage.setItem('aulaPreescolar_session', JSON.stringify(sessionData));
        
        mostrarExito('Entrando como invitado...');
        
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 1000);
    };

    // ─────────────────────────────────────────────────────────────────────
    // VERIFICAR SESIÓN AL CARGAR
    // ─────────────────────────────────────────────────────────────────────
    onAuthStateChanged(auth, function(user) {
        if (user) {
            console.log('✅ Usuario autenticado:', user.email);
        } else {
            console.log('⚠️ Sin sesión activa');
        }
    });

    // ─────────────────────────────────────────────────────────────────────
    // CERRAR SESIÓN (Función global)
    // ─────────────────────────────────────────────────────────────────────
    window.cerrarSesion = async function() {
        try {
            await signOut(auth);
            localStorage.removeItem('aulaPreescolar_session');
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error cerrar sesión:', error);
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // OBTENER USUARIO ACTUAL (Función global)
    // ─────────────────────────────────────────────────────────────────────
    window.obtenerUsuarioActual = function() {
        const session = localStorage.getItem('aulaPreescolar_session');
        return session ? JSON.parse(session) : null;
    };

    console.log('✅ Auth.js listo');
});