import styles from "styles/Formula.module.scss";
import { useProxy } from "valtio";
import { useEffect, useState } from "react";
import { useMain, setPersonalizePrescription} from "../vStore/main";
import Switch from "./helpers/Switch";
export default function FormulaForm({
  categoryKey,
  category,
  data,
  disabled,
  handleInput,
  isPersonalize,
  handleSwitch
}) {
  const { prescriptionPersonalizeData } = useMain();
  const [Week1Local, setWeek1] = useState("");
  const [Week2Local, setWeek2] = useState("");
  const [Week3Local, setWeek3] = useState("");
  const [Week4Local, setWeek4] = useState("");
  useEffect(() => {
    setWeek1(prescriptionPersonalizeData.week1)
    setWeek2(prescriptionPersonalizeData.week2)
    setWeek3(prescriptionPersonalizeData.week3)
    setWeek4(prescriptionPersonalizeData.week4)
  }, [prescriptionPersonalizeData]);
  return (
    <div key={categoryKey} className={styles.vetForm}>
      <div
        style={{
          borderBottom: "2px solid silver",
          paddingBottom: "10px",
          flex: "1",
          position: "sticky",
          pointerEvents: disabled ? "none" : "all",
        }}
      >
        <div
          style={{
            borderBottom: "2px solid ",
            marginBottom: "20px",
            paddingBottom: "20px",
          }}
        >
          <h4 style={{color:'black'}}>{category.label}</h4>
          {/* <label>{`[${categoryKey}]`}</label> */}
        </div>

        {Object.entries(category.inputs).map(([inputKey, input]) => {
          const isValid = data && data[inputKey];
          const inputStyle = {

            resize: "none",
            width: "100%",
            border:"none",
            ...(!isValid
              ? {
                   background: "white",
                  outline:"none"

                }
              : {
                   background: "white",
                  outline:"none"
                }),
            color:'black'
          };
          return (
            <div key={inputKey}>
              <label style={{color:'black',fontWeight:'bold'}}>{`${input?.label}`}</label>
              {/* <label style={{ float: "right" }}>{` [${inputKey}]`}</label> */}
              <br />
              {inputKey == "notes" ? (
                <textarea
                  defaultValue={data[inputKey]}
                  rows="5"
                  cols="50"
                  style={inputStyle}
                  name="notes"
                ></textarea>
              ) : input.options ? (
                <select
                  defaultValue={data[inputKey]}
                  {...input.props}
                  onChange={(e) => {
                    // console.log(e.target.value);
                    // console.log("HEY MOVIENMDO LA OPCION");
                    // console.log(e, categoryKey, inputKey);
                    handleInput(e, categoryKey, inputKey)
                    if(categoryKey==='consultapersonalizada'){
                      setPersonalizePrescription({...prescriptionPersonalizeData,['personalize']: e.target.value})
                    }
                  }}


                  style={inputStyle}
                >
                  <option value={""}>{"--SELECT-->"}</option>
                  {input.options.map((option) => (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : categoryKey !=='consultapersonalizada' && ( <input
                 defaultValue={data[inputKey]}
                 {...input.props}
                 style={inputStyle}
                 onChange={(e) => handleInput(e, categoryKey, inputKey)}
               />)}
              {
                categoryKey==='consultapersonalizada' && (
                  <>
                  <div>
                    <Switch onChange={handleSwitch}/>
                    {/* {JSON.stringify(prescriptionPersonalizeData.personalize)} */}
                    <p className="personalize_form-text">
                      {"La posología recomedada por Klean-Vet® semanal es la siguiente, a continuación podrás personalizarla si lo deseas:"}
                    </p>
                  <label className="inputs-labels">
                      <h4>Semana 1</h4>
                      
                      <textarea
                        className={styles.text_area}
                        rows="3"
                        cols="50"
                        disabled={!isPersonalize}
                        // defaultValue={
                        //   // "Prescribir x mgs al día. Durante la primera semana administrar x mL x veces al dia."
                        //   prescriptionPersonalizeData.week1 ? prescriptionPersonalizeData.week1:''

                        // }
                        value={Week1Local}
                        style={inputStyle}
                        onChange={(e) => {
                          handleInput(e, categoryKey, inputKey);
                          setPersonalizePrescription({
                            ...prescriptionPersonalizeData,
                            ["week1"]: e.target.value,
                          });
                          setWeek1(e.target.value)
                        }}
                      />
                    </label>
                    
                    <label className="inputs-labels">
                    <h4>Semana 2</h4>
                     
                      <textarea
                      className={styles.text_area}
                        rows="3"
                        cols="50"
                        disabled={!isPersonalize}
                        //  defaultValue={
                        //    // "Prescribir x mgs al día. Durante la primera semana administrar x mL x veces al dia."
                        //   //  prescriptionPersonalizeData.week2 ? prescriptionPersonalizeData.week2:''
                        //   "welco0me"
                        //  }
                        value={Week2Local}
                        style={inputStyle}
                        onChange={(e) => {
                          handleInput(e, categoryKey, inputKey);
                          // console.log("DOS",e.target.value);
                          setPersonalizePrescription({
                            ...prescriptionPersonalizeData,
                            ["week2"]: e.target.value,
                          });
                          setWeek2(e.target.value)
                        }}
                      />
                    </label>
                    <label className="inputs-labels">
                    <h4>Semana 3</h4>
               
                      <textarea
                      className={styles.text_area}
                        rows="3"
                        cols="50"
                        disabled={!isPersonalize}
                        // defaultValue={
                        //   // "Prescribir x mgs al día. Durante la primera semana administrar x mL x veces al dia."
                        //   prescriptionPersonalizeData.week3 ? prescriptionPersonalizeData.week3:''
                        // }
                        value={Week3Local}

                        style={inputStyle}
                        onChange={(e) => {
                          handleInput(e, categoryKey, inputKey);

                          // console.log("TRES",e.target.value);
                          setPersonalizePrescription({
                            ...prescriptionPersonalizeData,
                            ["week3"]: e.target.value,
                          });
                          setWeek3(e.target.value)
                        }}
                      />
                    </label>
                    <label className="inputs-labels">
                    <h4>Semana 4</h4>
               
                      <textarea
                      className={styles.text_area}
                        rows="3"
                        cols="50"
                        disabled={!isPersonalize}
                        // defaultValue={
                        //   // "Prescribir x mgs al día. Durante la primera semana administrar x mL x veces al dia."
                        //   prescriptionPersonalizeData.week4 ? prescriptionPersonalizeData.week4:''

                        // }
                        value={Week4Local}

                        style={inputStyle}
                        onChange={(e) => {
                          handleInput(e, categoryKey, inputKey);

                          // console.log("CUATRO",e.target.value);
                          setPersonalizePrescription({
                            ...prescriptionPersonalizeData,
                            ["week4"]: e.target.value,
                          });
                          setWeek4(e.target.value)
                        }}
                      />
                    </label>
                  
                  </div>
                </>
                )
              }
              
            </div>
          );
        })}
      </div>
    </div>
  );
}


{/* <input
                  defaultValue={data[inputKey]}
                  {...input.props}
                  style={inputStyle}
                  onChange={(e) => handleInput(e, categoryKey, inputKey)}
                /> */}