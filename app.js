let gradoActual = "";

function seleccionarGrado(grado) {
    gradoActual = grado;

    document.getElementById("gradoSeleccionado").textContent =
        "Grado " + grado;

    document.getElementById("inicio").classList.add("oculto");
    document.getElementById("elecciones").classList.remove("oculto");

    mostrarElecciones();
}

function mostrarElecciones() {
    console.log("Grado seleccionado:", gradoActual);

    const candidatos = [
        {
            nombre: "Candidato 1",
            numero: 1
        },
        {
            nombre: "Candidato 2",
            numero: 2
        },
        {
            nombre: "Candidato 3",
            numero: 3
        }
    ];

    const contenedor = document.getElementById("candidatos");

    if (!contenedor) {
        console.log("No existe el contenedor de candidatos todavía.");
        return;
    }

    contenedor.innerHTML = "";

    candidatos.forEach(candidato => {
        const tarjeta = document.createElement("div");

        tarjeta.innerHTML = `
            <h3>${candidato.nombre}</h3>
            <p>Número ${candidato.numero}</p>
            <button onclick="seleccionarCandidato(${candidato.numero})">
                VOTAR
            </button>
        `;

        contenedor.appendChild(tarjeta);
    });
}

function seleccionarCandidato(numero) {
    console.log("Grado:", gradoActual);
    console.log("Candidato seleccionado:", numero);
}
