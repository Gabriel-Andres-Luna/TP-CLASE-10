var formulario = document.getElementById("formulario");
var nombreInput = document.getElementById("nombre");
var emailInput = document.getElementById("email");
var contrasenaInput = document.getElementById("contrasena");
var edadInput = document.getElementById("edad");
var telefonoInput = document.getElementById("telefono");
var direccionInput = document.getElementById("direccion");
var ciudadInput = document.getElementById("ciudad");
var codigoPostalInput = document.getElementById("codigo-postal");
var dniInput = document.getElementById("dni");

function mostrarModal(mensaje) {
  var modal = document.getElementById("modal");
  var modalMessage = document.getElementById("modal-message");

  modalMessage.textContent = mensaje;
  modal.style.display = "block";

  var close = document.getElementsByClassName("close")[0];
  close.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function guardarEnLocalStorage(datos) {
  var datosGuardados = JSON.parse(localStorage.getItem("datosEnvio")) || [];
  datosGuardados.push(datos);
  localStorage.setItem("datosEnvio", JSON.stringify(datosGuardados));
}

function validarNombre(nombre) {
  return nombre.trim().length > 6 && nombre.includes(" ");
}

function validarEmail(email) {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
  return regex.test(email);
}

function validarContrasena(contrasena) {
  var regex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
  return regex.test(contrasena);
}

function validarEdad(edad) {
  return Number.isInteger(Number(edad)) && parseInt(edad) >= 18;
}

function validarTelefono(telefono) {
  var regex = /^\d{7,}$/;
  return regex.test(telefono);
}

function validarDireccion(direccion) {
  var regex = /^[a-zA-Z0-9]+\s[a-zA-Z0-9\s]+$/;
  return regex.test(direccion) && direccion.length >= 5;
}

function validarCiudad(ciudad) {
  return ciudad.trim().length >= 3;
}

function validarCodigoPostal(codigoPostal) {
  return codigoPostal.trim().length >= 3;
}

function validarDNI(dni) {
  var regex = /^\d{7,8}$/;
  return regex.test(dni);
}

function mostrarError(elemento, mensaje) {
  var errorDiv = elemento.nextElementSibling;
  errorDiv.innerHTML = mensaje;
  errorDiv.style.display = "block";
}

window.onload = function () {
  var datosGuardados = JSON.parse(localStorage.getItem("datosEnvio"));

  if (datosGuardados && datosGuardados.length > 0) {
    var datosUltimo = datosGuardados[datosGuardados.length - 1];
    nombreInput.value = datosUltimo.nombre || "";
    emailInput.value = datosUltimo.email || "";
    contrasenaInput.value = datosUltimo.contrasena || "";
    edadInput.value = datosUltimo.edad || "";
    telefonoInput.value = datosUltimo.telefono || "";
    direccionInput.value = datosUltimo.direccion || "";
    ciudadInput.value = datosUltimo.ciudad || "";
    codigoPostalInput.value = datosUltimo.codigoPostal || "";
    dniInput.value = datosUltimo.dni || "";
  }
};

formulario.addEventListener("submit", function (event) {
  event.preventDefault();
  var nombre = nombreInput.value;
  var email = emailInput.value;
  var contrasena = contrasenaInput.value;
  var edad = edadInput.value;
  var telefono = telefonoInput.value;
  var direccion = direccionInput.value;
  var ciudad = ciudadInput.value;
  var codigoPostal = codigoPostalInput.value;
  var dni = dniInput.value;
  var errores = false;

  if (!validarNombre(nombre)) {
    mostrarError(nombreInput, "El nombre debe tener más de 6 letras y al menos un espacio entre medio.");
    errores = true;
  }

  if (!validarEmail(email)) {
    mostrarError(emailInput, "El email debe tener un formato válido.");
    errores = true;
  }

  if (!validarContrasena(contrasena)) {
    mostrarError(contrasenaInput, "La contraseña debe tener al menos 8 caracteres, formados por letras y números.");
    errores = true;
  }

  if (!validarEdad(edad)) {
    mostrarError(edadInput, "La edad debe ser un número entero mayor o igual a 18.");
    errores = true;
  }

  if (!validarTelefono(telefono)) {
    mostrarError(
      telefonoInput,
      "El teléfono debe tener al menos 7 dígitos y no debe contener espacios, guiones ni paréntesis."
    );
    errores = true;
  }

  if (!validarDireccion(direccion)) {
    mostrarError(
      direccionInput,
      "La dirección debe tener al menos 5 caracteres, con letras, números y un espacio en el medio."
    );
    errores = true;
  }

  if (!validarCiudad(ciudad)) {
    mostrarError(ciudadInput, "La ciudad debe tener al menos 3 caracteres.");
    errores = true;
  }

  if (!validarCodigoPostal(codigoPostal)) {
    mostrarError(codigoPostalInput, "El código postal debe tener al menos 3 caracteres.");
    errores = true;
  }

  if (!validarDNI(dni)) {
    mostrarError(dniInput, "El DNI debe ser un número de 7 u 8 dígitos.");
    errores = true;
  }

  if (!errores) {
    var data =
      nombre,
      email,
      contrasena,
      edad,
      telefono,
      direccion,
      ciudad,
      codigoPostal,
      dni;
    var queryParams = new URLSearchParams(data).toString();
    fetch("http://curso-dev-2021.herokuapp.com/newsletter?" + queryParams)
      .then(function (response) {
        if (response.ok) {
          mostrarModal("Registro exitoso");
          guardarEnLocalStorage({
            nombre: nombre,
            email: email,
            contrasena: contrasena,
            edad: edad,
            telefono: telefono,
            direccion: direccion,
            ciudad: ciudad,
            codigoPostal: codigoPostal,
            dni: dni,
          });
        } else {
          response.text().then(function (errorMessage) {
            mostrarModal("Error en el registro: " + errorMessage);
          });
        }
      })
      .catch(function (error) {
        mostrarModal("Error en la comunicación con el servidor: " + error.message);
      });
  }
});
