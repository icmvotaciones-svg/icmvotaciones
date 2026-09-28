let gradoActual = "";

function seleccionarGrado(grado) {
    gradoActual = grado;

    document.getElementById("gradoSeleccionado").textContent =
        "Grado " + grado;

    document.getElementById("inicio").classList.add("oculto");
    document.getElementById("elecciones").classList.remove("oculto");
}
