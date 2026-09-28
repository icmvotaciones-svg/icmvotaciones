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

    // Aquí posteriormente cargaremos los candidatos
    // desde Supabase.
}
