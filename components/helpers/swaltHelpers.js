import Swal from "sweetalert2";
import Logo from "../../public/img/klean-vet-home.jpg";
import Image from "next/image";
export const welcomeAlert = () =>
  Swal.fire({
    icon: "success",
    titleText: "¡Bienvenido a Klean-Vet!",
    customClass: {
      icon: "no-border",
    },
    html: `
    
    <p > ¡Felicidades! Acabas de convertirte en un pionero del cambio al usar nuestra innovadora plataforma para recetar y dosificar medicamentos de grado farmacéutico para mascotas de manera rápida, fácil y precisa. 
    </br></br>
    Con nuestra aplicación, podrás prescribir tratamientos de cannabis de alta calidad diseñados específicamente para uso veterinario. 
    </br></br>
    Estamos seguros de que Klean-Vet te ayudará a mejorar tu práctica y brindar una atención excepcional a tus pacientes peludos. Si tienes alguna pregunta o comentario, no dudes en contactarnos a través del soporte técnico de la aplicación. ¡Bienvenido a Klean-Vet!</br></br>
    <h2> ¿Completar mis datos para iniciar?</h2></strong>`,
    // customClass:klass
    showCancelButton: true,
    confirmButtonColor: "#ff8000",
    confirmButtonText: "Completar mis datos",
    cancelButtonText: "Ahora no",
  });

export const swaltMiddleware = () =>
  Swal.fire({
    title: "<strong>Ingresa a perfil y completa los datos</strong>",
    icon: "error",
    html: `<p>Para comenzar a prescribir Klean-Vet debes completar tu información profesional como médico veterinario.</strong>`,
    confirmButtonText: "Completar mi información!",
    confirmButtonColor: "orange",
    showCancelButton: true,
    cancelButtonText: "Luego",
  });

export const swaltConfirm = () =>
  Swal.fire({
    icon: "warning",
    title: "<span>¡Alto, sus datos serán eliminados!</span>",
    text: "Klean-Vet® cumple con la Ley de Protección de Datos Personales o Ley 1581 de 2012, eliminaremos su información personal y debera registrarse de nuevo, si desea seguir prescribiendo Klean-Vet®",
    confirmButtonColor: "orange",
    showDenyButton: true,
    confirmButtonText: "Eliminar mi perfil",
    denyButtonText: "No",
  });

export const swaltConfirmPayment = () =>
  Swal.fire({
    icon: "warning",
    text: "Validar el pago de esta prescripción",
    confirmButtonColor: "orange",
    showDenyButton: true,
    confirmButtonText: "Validar Pago",
    denyButtonText: "Pasar a no pagada",
  });

  export const swaltConfirmPasswordTrue = () =>
  Swal.fire({
    icon: "warning",
    text: "Hemos enviado las instrucciones a tu correo. Revisalo!",
    confirmButtonColor: "orange",
    showDenyButton: false,
    confirmButtonText: "Ok ",
 
  });
  export const swaltConfirmPasswordFalse = () =>
  Swal.fire({
    icon: "warning",
    text: "Verifica tu correo electronico y vuelve a intentar",
    confirmButtonColor: "orange",
    showDenyButton: false,
    confirmButtonText: "Ok ",
  
 
  });
  export const swaltResetPasswordSucces = () =>
  Swal.fire({
    icon: "success",
    title:"Buen trabajo actualizo la contraseña!",
    confirmButtonColor: "orange",
});
export const swaltResetPasswordError = () =>
Swal.fire({
  icon: "error",
  title:"No se logro actualizar la contraseña intentalo de nuevo!",
  confirmButtonColor: "orange",
});