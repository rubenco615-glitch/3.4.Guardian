const formulario = document.getElementById("formulario");
const nombre = document.getElementById("nombre");
const color = document.getElementById("color-fondo");
const tema = document.getElementById("tema");
const bienvenida = document.getElementById("contenedor-bienvenida");
const restablecer = document.getElementById("restablecer");

/**
 * Guarda un valor en una cookie.
 * Si no se le pasan días de expiración, la cookie dura solo la sesión actual.
 *
 * @param {string} clave  - Nombre de la cookie.
 * @param {string} valor  - Valor que se quiere guardar.
 * @param {number} [dias] - Días hasta que expire (opcional).
 */
function guardarCookie(clave, valor, dias) {
    let cookie = clave + "=" + encodeURIComponent(valor) + "; path=/; SameSite=Lax";
    if (dias !== undefined) {
        const fecha = new Date();
        fecha.setTime(fecha.getTime() + dias * 24 * 60 * 60 * 1000);
        cookie += "; expires=" + fecha.toUTCString();
    }
    document.cookie = cookie;
}

/**
 * Busca una cookie por su nombre y devuelve su valor.
 * Si no existe ninguna cookie con ese nombre, devuelve una cadena vacía.
 *
 * @param {string} clave - Nombre de la cookie que se quiere leer.
 * @returns {string} El valor de la cookie, o "" si no se encuentra.
 */
function leerCookie(clave) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const separador = cookie.indexOf("=");
        if (separador !== -1 && cookie.slice(0, separador) === clave) {
            return decodeURIComponent(cookie.slice(separador + 1));
        }
    }
    return "";
}

/**
 * Muestra el mensaje de bienvenida con el nombre del usuario.
 * Limpia el contenido anterior antes de insertar los nuevos elementos.
 * Si no se recibe usuario, simplemente deja el contenedor vacío.
 *
 * @param {string} usuario - Nombre del usuario que se quiere saludar.
 */
function mostrarBienvenida(usuario) {
    bienvenida.replaceChildren();
    if (!usuario) return;
    const titulo = document.createElement("h2");
    titulo.textContent = "¡Hola, " + usuario + "!";
    const parrafo = document.createElement("p");
    parrafo.textContent = "Estas son tus preferencias.";
    bienvenida.appendChild(titulo);
    bienvenida.appendChild(parrafo);
}

/**
 * Aplica el tema visual añadiendo o quitando la clase "tema-oscuro" del body.
 * El resto de estilos los gestiona directamente el CSS.
 *
 * @param {string} valor - Tema a aplicar: "claro" u "oscuro".
 */
function aplicarTema(valor) {
    document.body.classList.remove("tema-oscuro");
    if (valor === "oscuro") document.body.classList.add("tema-oscuro");
}

// El color de fondo se actualiza en tiempo real mientras el usuario lo elige.
color.addEventListener("input", () => {
    document.body.style.backgroundColor = color.value;
});

// El tema se aplica en cuanto el usuario cambia el selector.
tema.addEventListener("change", () => {
    aplicarTema(tema.value);
});

// Al enviar el formulario se guardan las tres preferencias en cookies.
// El nombre y el color duran 7 días; el tema solo dura la sesión.
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    guardarCookie("nombre", nombre.value.trim(), 7);
    guardarCookie("color", color.value, 7);
    guardarCookie("tema", tema.value);
    mostrarBienvenida(nombre.value.trim());
});

// Al restablecer se borran todas las cookies y se vuelve al aspecto por defecto.
restablecer.addEventListener("click", () => {
    for (const clave of ["nombre", "color", "tema"]) {
        document.cookie = clave + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
    }
    formulario.reset();
    document.body.style.backgroundColor = "";
    document.body.classList.remove("tema-oscuro");
    while (bienvenida.firstChild) bienvenida.firstChild.remove();
});

// Al cargar la página se leen las cookies y se restauran las preferencias guardadas.
const nombreGuardado = leerCookie("nombre");
const colorGuardado = leerCookie("color");
const temaGuardado = leerCookie("tema");

if (nombreGuardado) {
    nombre.value = nombreGuardado;
    mostrarBienvenida(nombreGuardado);
}
if (/^#[0-9a-fA-F]{6}$/.test(colorGuardado)) {
    color.value = colorGuardado;
    document.body.style.backgroundColor = colorGuardado;
}
if (temaGuardado === "claro" || temaGuardado === "oscuro") {
    tema.value = temaGuardado;
    aplicarTema(temaGuardado);
}