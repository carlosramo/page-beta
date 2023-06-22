import nodeMailer from "nodemailer";

export default function mail(req, res){
  const data = req.body;
  const sender = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: "menudowar@gmail.com",
      pass: "getljzvioziclfly",
    },
  });
  const mailOptions = {
    from: "menudowar@gmail.com",
    to: "warcali94@gmail.com",
    // to: "carlos.gs.andres@gmail.com",

    subject: "Prescription notification",
    html: `
    <p> ID Prescripción: <strong>${data.id}</strong></p>
    <hr>
    <h3> Datos veterinario</h3>
    <p> <strong>Nombre: </strong> ${data.veterinary.name}</p>
    <p> <strong>Tarjeta: </strong>${data.veterinary.card}</p>
    <p> <strong>Dirección: </strong>${data.veterinary.address}</p>
    <p> <strong>Ubicación: </strong>${data.veterinary.location}</p>
    <p> <strong>Celular: </strong>${data.veterinary.telephone}</p>
    <p> <strong>E-mail: </strong>${data.veterinary.email}</p>
    <p> <strong>Cédula: </strong>${data.veterinary.id}</p>
    <p> <strong>Barrio: </strong>${data.veterinary.neighborhood}</p>
    <hr>
    <h3> Datos propietario</h3>
    <p> <strong>Nombre: </strong>${data.owner.name}</p>
    <p> <strong>Departamento: </strong>${data.owner.department}</p>
    <p> <strong>Ubicación: </strong>${data.owner.location}</p>
    <p> <strong>Dirección: </strong>${data.owner.address}</p>
    <p> <strong>Celular: </strong>${data.owner.telephone}</p>
    <p> <strong>E-mail: </strong>${data.owner.email}</p>
    <p> <strong>Cédula: </strong>${data.owner.id}</p>
    <p> <strong>Barrio: </strong>${data.owner.neighborhood}</p>
    <hr>
    <h3> Datos Mascota</h3>
    <p> <strong>Nombre: </strong>${data.pet.name}</p>
    <p> <strong>Especie: </strong>${data.pet.specie}</p>
    <p> <strong>Peso: </strong>${data.pet.weight}</p>
    <p> <strong>Edad: </strong>${data.pet.age}</p>
    <p> <strong>Sexo: </strong>${data.pet.sex}</p>
    <p> <strong>Raza: </strong>${data.pet.breed}</p>
    <hr>
    <h3> Datos Diagnóstico</h3>
    <p> <strong>Diagnóstico: </strong>${data.consultation.diagnostic}</p>
    <p> <strong>Presentación: </strong>${data.consultation.presentation}</p>
    <p> <strong>Unidades: </strong>${data.consultation.units}</p>
    <hr>
    <h3> Datos Adicionales</h3>
    <p> <strong>Adicional: </strong>${data.attachments.notes}</p>


    `,
    // text: JSON.stringify(JSON.parse(data)),
  };
  try {
    sender.sendMail(mailOptions, (err, inf) => {
      err
        ? console.log("HUBO UN ERROR")
        : console.log("ENVIADO CORRECTAMENTE", inf);
    });
  } catch (error) {
    throw new error();
  }
  res.status(200).json("ok");
};
