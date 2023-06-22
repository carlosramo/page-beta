// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// "use strict";
// const path = require('path');
// const fs = require('fs').promises;
import path from "path";
import fs from "fs";
// import libre from "libreoffice-convert";
// libre.convertAsync = require("util").promisify(libre.convert);
import ejs from "ejs";
import pdf from "html-pdf";
// Requiring the module
import reader, { utils } from "xlsx"; // Reading our test file
import { connectToDatabase } from "lib/mongodb";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";
import axios from "axios";
import { getDate, totalUserPrescriptions } from "./helpers/helpers";
const { v4: uuidv4 } = require("uuid");

export default async function Prescription(req, res) {
  // console.log("api prescription");
  const { db } = await connectToDatabase();
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });
  // console.log("JSON Web Token", token);
  let formulae;
  const templatePath = path.join(
    process.cwd(),
    // `/${process.env.FORMULA_FOLDER}`,
    "formula/formula.ejs"
  );
  if (req.method == "POST") {
    // const inputPath = path.join(process.cwd(), "formula/vetFormula2.xlsm");
    const {
      pet,
      consultation,
      veterinary: { card },
      prescriptionPersonalizeData
    } = req.body;
    const result1 = await axios.post(
      process.env.URIEXCELBACKEND,
      { pet, consultation },
      {
        headers: {
          // 'application/json' is the modern content-type for JSON, but some
          // older servers may use 'text/json'.
          // See: http://bit.ly/text-json
          "content-type": "application/json",
        },
      }
    );
    console.log("Seerver Excel Answer ");
    const data = await result1.data;
    const totalPrescriptions = await totalUserPrescriptions(token.user._id || token.user.id,);

    formulae = {
      time: getDate("L"),
      id: req.body.id,
      register: { ...req.body },
      prescription: {
        personalize: prescriptionPersonalizeData.personalize,
        treatment: data.treatment,
        concentration: data.concentration,
        presentation: data.presentation,
        week1:prescriptionPersonalizeData.week1 ,
        week2:prescriptionPersonalizeData.week2,
        week3:prescriptionPersonalizeData.week3,
        week4:prescriptionPersonalizeData.week4 ,
        uniqueId: `${getDate("YYYY")}-${card}-${totalPrescriptions}`, 
        hc: `${getDate("YYYY")}-${card}-${totalPrescriptions}`, 
        diagnostic: consultation.diagnostic,
        custom:prescriptionPersonalizeData?.personalize === 'SI' ? true : false
      },
    };

    const result = await db.collection("prescriptions").insertOne({
      ...formulae,
      creation: {
        utc: getDate(),
        by: token.user._id || token.user.id,
      },
    });
    res.status(200).json({ _id: result.insertedId, ...formulae });
  } else if (req.method == "GET") {
    const result = await db.collection("prescriptions").findOne({
      _id: ObjectId(req.query._id),
    });
    formulae = result;

    const str = await ejs.renderFile(templatePath, formulae, {});
    // function(err, str) {
    // if (err) return console.log(err);
    // str now contains your rendered html
    // pdf.create(str).toFile("report.pdf", function (err, data) {});
    //
    //  const workBookB64 = new Buffer( result, 'base64' );
    //
    //   res.setHeader( 'Content-Disposition', 'attachment; filename=' + fileName );
    //   res.setHeader( 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64' );
    //   res.end( workBookB64 );
    //     if (err) {
    //       console.log("error");
    //     }
    //     // return res.send(err);
    //     // res.send("File created successfully");
    //   });
    // });
    //
    var options = {
      height: "420mm",
      width: "297mm",
      childProcessOptions: {
        env: {
          OPENSSL_CONF: "/dev/null",
        },
      },
      format: "A4",
      border: { top: "30px", bottom: "30px", left: "10px" },
    };
    // try {
    const streamResult = await new Promise((resolve, reject) =>
      pdf.create(str, options).toStream(function (err, stream) {
        if (err) {
          console.log("error");
          reject(err);
        }
        resolve(stream);
      })
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=prescripcion.pdf"
    );
    res.setHeader("Content-Type", "application/pdf");
    streamResult.pipe(res);
  }
}
// } catch (e) {
//
//
// }
// });
// const data = utils.sheet_to_json(prescription_sheet);
// console.log(data);
// let prescription_sheet = register_sheet;
//   const data = utils.sheet_to_json(register_sheet);
//   // Writing to our file
//   //
//   // let prescription_sheet = file.Sheets["Prescripcion"];
//   // let prescription_sheet = register_sheet;
//   const data = utils.sheet_to_json(register_sheet);
//
//   var vbablob = file.vbaraw;
//   //     fs.writeFileSync(
//   //       path.join(
//   //         process.cwd(),
//   //         // `/${process.env.FORMULA_FOLDER}`,
//   //         "formula/vba.bin"
//   //       ),
//   //       vbablob
//   //     );
//   // wb.vbaraw = fs.readFileSync("vba.bin");
//   console.log(data);
//   console.log(reader.version);
//   const book = utils.book_new();
//   file.Sheets.map((ws, i) => {
//     reader.utils.book_append_sheet(book, ws, file.SheetNames[i]);
//   });
//
//   book.vbaraw = vbablob;
//   //
//   //bookType
//   reader.writeFile(file, inputPath2, {
//     bookType: "xlsm",
//   });
//   true &&
//     setTimeout(async () => {
//       // reader.writeFile(file, {
//       //   type: "buffer",
//       //   bookType: "xlsm",
//       // });
//       const file2 = reader.readFile(inputPath2, {
//         cellFormula: true,
//         bookVBA: true,
//         bookDeps: true,
//       });
//       let prescription_sheet = file2.Sheets["Prescripcion"];
//       // let prescription_sheet = register_sheet;
//       const data = utils.sheet_to_json(prescription_sheet);
//       console.log(data);
//       // reader.writeFile(newFile, outputPathXlsx);
//       console.log("done");
//     }, 5000);
//   // Read file
//   //   const docxBuf = fs.readFileSync(inputPath);
//   //   // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
//   //   let pdfBuf;
//   //   try {
//   //     pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
//   //   } catch (e) {
//   //     console.log("fuck");
//   //   }
//   //   // Here in done you have pdf file which you can save or transfer in another stream
//   //   fs.writeFileSync(outputPath, pdfBuf);
//   //   console.log("done");
//   // } catch (err) {
//   //   console.log(`Error converting file: ${err}`);
//   // }
// } catch (e) {
//   console.log(e);
// }
// res.status(200).json(formulae);
//
//
//
//
