let gradoActual = "";
let eleccionActual = "";


// ================================
// SELECCIONAR GRADO
// ================================

function seleccionarGrado(grado) {

    gradoActual = grado;

    document.getElementById("gradoSeleccionado").textContent =
        "Grado " + grado;

    document.getElementById("inicio").classList.add("oculto");
    document.getElementById("elecciones").classList.remove("oculto");

}


// ================================
// MOSTRAR CANDIDATOS
// ================================

function mostrarCandidatos(tipo) {

    eleccionActual = tipo;

    document.getElementById("elecciones").classList.add("oculto");
    document.getElementById("candidatos").classList.remove("oculto");

    let titulo = "";
    let etiqueta = "";

    if (tipo === "personero") {
        titulo = "Personero/a";
        etiqueta = "ELECCIÓN DE PERSONERO/A";
    }

    if (tipo === "personerito") {
        titulo = "Personerito/a";
        etiqueta = "ELECCIÓN DE PERSONERITO/A";
    }

    if (tipo === "representante") {
        titulo = "Representante del curso";
        etiqueta = "ELECCIÓN DE REPRESENTANTE";
    }

    if (tipo === "contralor") {
        titulo = "Contralor/a";
        etiqueta = "ELECCIÓN DE CONTRALOR/A";
    }

    document.getElementById("tipoEleccion").textContent = etiqueta;
    document.getElementById("tituloEleccion").textContent = titulo;


    const lista = document.getElementById("listaCandidatos");

    lista.innerHTML = `

        <div class="candidato">
            <h3>Candidato 1</h3>
            <p>Lista 1</p>

            <button onclick="seleccionarCandidato(1)">
                VOTAR
            </button>
        </div>

        <div class="candidato">
            <h3>Candidato 2</h3>
            <p>Lista 2</p>

            <button onclick="seleccionarCandidato(2)">
                VOTAR
            </button>
        </div>

        <div class="candidato">
            <h3>Candidato 3</h3>
            <p>Lista 3</p>

            <button onclick="seleccionarCandidato(3)">
                VOTAR
            </button>
        </div>

    `;
}


// ================================
// SELECCIONAR CANDIDATO
// ================================

function seleccionarCandidato(numero) {

    console.log("Grado:", gradoActual);
    console.log("Elección:", eleccionActual);
    console.log("Candidato:", numero);

    alert(
        "Seleccionaste el candidato " +
        numero +
        " para " +
        eleccionActual
    );
}


// ================================
// VOLVER AL INICIO
// ================================

function volverInicio() {

    document.getElementById("elecciones").classList.add("oculto");
    document.getElementById("inicio").classList.remove("oculto");

}


// ================================
// VOLVER A ELECCIONES
// ================================

function volverElecciones() {

    document.getElementById("candidatos").classList.add("oculto");
    document.getElementById("resultados").classList.add("oculto");
    document.getElementById("elecciones").classList.remove("oculto");

}


// ================================
// RESULTADOS
// ================================

function mostrarResultados() {

    document.getElementById("elecciones").classList.add("oculto");
    document.getElementById("resultados").classList.remove("oculto");

    document.getElementById("listaResultados").innerHTML = `
        
        <div class="candidato">
            <h3>Resultados</h3>
            <p>Los resultados aparecerán aquí.</p>
        </div>

    `;
}
