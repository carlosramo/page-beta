// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// "use strict";
// const path = require('path');
// const fs = require('fs').promises;
/* import ExcelJS from "exceljs";
import XlsxPopulate  from 'xlsx-populate' */
import path from "path";
import fs from "fs";
// import libre from "libreoffice-convert";
// libre.convertAsync = require("util").promisify(libre.convert);
import ejs from "ejs";
import pdf from "html-pdf";
// Requiring the module
/*  import reader, { utils } from "xlsx"; */ // Reading our test file
import reader, { utils } from "xlsx";
import { connectToDatabase } from "lib/mongodb";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";
import moment from "moment";
/* import xlsx from "node-xlsx"; */
import { spawn, exec } from "child_process";
import axios from "axios";

export default async function handler2(req, res) {
    // console.log('backend next js')
   /*  const result1 = await axios.post("https://kleanxslm.herokuapp.com/file_process", { hello: 'world',formulae:{n:1} },{
                  headers: {
                    // 'application/json' is the modern content-type for JSON, but some
                    // older servers may use 'text/json'.
                    // See: http://bit.ly/text-json
                    'content-type': 'application/json'
                  }
                }); */
  
 
  res.status(200).json({ text: "epa la arepa from the server" });
}
