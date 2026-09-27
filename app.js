const SUPABASE_URL = "https://dtibgfsozrnpmhnaalvp.supabase.co";
const SUPABASE_KEY = "PEGA_AQUI_TU_PUBLISHABLE_KEY";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

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

        lista.innerHTML =
            "<p>No se pudieron cargar los candidatos.</p>";

        console.error(error);

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

    const codigoJornada = localStorage.getItem("codigo_jornada");

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

    const { data: candidatos } = await supabase
        .from("candidatos")
        .select("*");

    const conteo = {};

    votos.forEach(voto => {

        if (!conteo[voto.candidato_id]) {
            conte
