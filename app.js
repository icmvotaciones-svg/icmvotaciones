const SUPABASE_URL = "https://dtibgfsozrnpmhnaalvp.supabase.co";
const SUPABASE_KEY = "sb_publishable_0TE3LtbUDldB5TLnTpoK9A_3-RXU4_q";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

alert("APP.JS FUNCIONANDO");

let gradoActual = "";
let eleccionActual = "";

/* =========================
   SELECCIONAR GRADO
========================= */

function seleccionarGrado(grado) {

    gradoActual = grado;

    document.getElementById("gradoSeleccionado").textContent =
        "Grado " + grado;

    document.getElementById("inicio").classList.add("oculto");
    document.getElementById("elecciones").classList.remove("oculto");
}


/* =========================
   VOLVER AL INICIO
========================= */

function volverInicio() {

    document.getElementById("elecciones").classList.add("oculto");
    document.getElementById("candidatos").classList.add("oculto");
    document.getElementById("resultados").classList.add("oculto");

    document.getElementById("inicio").classList.remove("oculto");
}


/* =========================
   VOLVER A ELECCIONES
========================= */

function volverElecciones() {

    document.getElementById("candidatos").classList.add("oculto");
    document.getElementById("resultados").classList.add("oculto");

    document.getElementById("elecciones").classList.remove("oculto");
}


/* =========================
   MOSTRAR CANDIDATOS
========================= */

async function mostrarCandidatos(tipo) {

    eleccionActual = tipo;

    const nombres = {
        personero: "PERSONERO/A",
        personarito: "PERSONERITO/A",
        representante: "REPRESENTANTE DEL CURSO",
        contralor: "CONTRALOR/A"
    };

    document.getElementById("tipoEleccion").textContent =
        nombres[tipo];

    document.getElementById("tituloEleccion").textContent =
        tipo === "representante"
            ? "Representante de " + gradoActual
            : nombres[tipo];

    const lista = document.getElementById("listaCandidatos");

    lista.innerHTML = "<p>Cargando candidatos...</p>";

    document.getElementById("elecciones").classList.add("oculto");
    document.getElementById("candidatos").classList.remove("oculto");

    let consulta = supabase
        .from("candidatos")
        .select("*")
        .eq("cargo", tipo)
        .eq("activo", true)
        .order("numero");

    if (tipo === "representante") {
        consulta = consulta.eq("grado", gradoActual);
    }

    const { data, error } = await consulta;

    if (error) {

        console.error(error);

        lista.innerHTML =
            "<p>No se pudieron cargar los candidatos.</p>";

        return;
    }

    if (!data || data.length === 0) {

        lista.innerHTML =
            "<p>No hay candidatos registrados para esta elección.</p>";

        return;
    }

    lista.innerHTML = "";

    data.forEach(candidato => {

        const elemento = document.createElement("div");

        elemento.className = "candidato";

        elemento.innerHTML = `
            <div class="numero">
                ${candidato.numero}
            </div>

            <div class="info">
                <strong>${escapeHTML(candidato.nombre)}</strong>

                <span>
                    ${
                        tipo === "representante"
                            ? "Representante de " + candidato.grado
                            : "Candidato/a"
                    }
                </span>
            </div>

            <button
                class="votar"
                onclick="registrarVoto(${candidato.id}, '${escapeJS(candidato.nombre)}')">
                VOTAR
            </button>
        `;

        lista.appendChild(elemento);
    });
}


/* =========================
   REGISTRAR VOTO
========================= */

async function registrarVoto(candidatoId, nombre) {

    const confirmar = confirm(
        "¿Confirmas tu voto por " +
        nombre +
        "?\n\nEsta acción quedará registrada."
    );

    if (!confirmar) {
        return;
    }

    const codigoJornada =
        localStorage.getItem("codigo_jornada");

    if (!codigoJornada) {

        alert(
            "No hay una jornada de votación activa."
        );

        return;
    }

    const { error } = await supabase
        .from("votos")
        .insert({
            cargo: eleccionActual,
            grado: gradoActual,
            candidato_id: candidatoId,
            codigo_jornada: codigoJornada
        });

    if (error) {

        console.error(error);

        alert(
            "No fue posible registrar el voto."
        );

        return;
    }

    alert(
        "✓ Voto registrado correctamente."
    );

    volverElecciones();
}


/* =========================
   RESULTADOS
========================= */

async function mostrarResultados() {

    const email = prompt(
        "Correo electrónico del administrador:"
    );

    if (!email) {
        return;
    }

    const password = prompt(
        "Contraseña:"
    );

    if (!password) {
        return;
    }

    const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (loginError) {

        console.error(loginError);

        alert(
            "Correo o contraseña incorrectos."
        );

        return;
    }

    if (!loginData.session) {

        alert(
            "No se pudo iniciar la sesión."
        );

        return;
    }

    document.getElementById("elecciones").classList.add("oculto");
    document.getElementById("resultados").classList.remove("oculto");

    const contenedor =
        document.getElementById("listaResultados");

    contenedor.innerHTML =
        "<p>Cargando resultados...</p>";

    const codigoJornada =
        localStorage.getItem("codigo_jornada");

    if (!codigoJornada) {

        contenedor.innerHTML =
            "<p>No hay una jornada activa.</p>";

        return;
    }

    const { data: votos, error } = await supabase
        .from("votos")
        .select("*")
        .eq("codigo_jornada", codigoJornada);

    if (error) {

        console.error(error);

        contenedor.innerHTML =
            "<p>No se pudieron cargar los resultados.</p>";

        return;
    }

    if (!votos || votos.length === 0) {

        contenedor.innerHTML =
            "<p>Aún no hay votos registrados.</p>";

        return;
    }

    const { data: candidatos, error: candidatosError } =
        await supabase
            .from("candidatos")
            .select("*");

    if (candidatosError) {

        console.error(candidatosError);

        contenedor.innerHTML =
            "<p>No se pudieron cargar los candidatos.</p>";

        return;
    }

    const conteo = {};

    votos.forEach(voto => {

        if (!conteo[voto.candidato_id]) {
            conteo[voto.candidato_id] = 0;
        }

        conteo[voto.candidato_id]++;
    });

    const resultados = candidatos
        .filter(candidato =>
            conteo[candidato.id]
        )
        .sort((a, b) =>
            conteo[b.id] - conteo[a.id]
        );

    contenedor.innerHTML = "";

    resultados.forEach(candidato => {

        const elemento = document.createElement("div");

        elemento.className = "candidato";

        elemento.innerHTML = `
            <div class="numero">
                ${candidato.numero}
            </div>

            <div class="info">
                <strong>
                    ${escapeHTML(candidato.nombre)}
                </strong>

                <span>
                    ${escapeHTML(candidato.cargo)}
                    ${
                        candidato.grado
                            ? " — " + escapeHTML(candidato.grado)
                            : ""
                    }
                </span>
            </div>

            <div class="numero">
                ${conteo[candidato.id]} votos
            </div>
        `;

        contenedor.appendChild(elemento);
    });
}


/* =========================
   CERRAR SESIÓN
========================= */

async function cerrarSesion() {

    await supabase.auth.signOut();

    alert("Sesión administrativa cerrada.");

    volverInicio();
}


/* =========================
   SEGURIDAD DE TEXTO
========================= */

function escapeHTML(texto) {

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeJS(texto) {

    return String(texto)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");
}
