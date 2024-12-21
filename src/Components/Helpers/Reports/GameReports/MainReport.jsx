// // import React, { useState, useEffect } from "react";
// // import { Link } from "react-router-dom";
// // import { Icon } from "@iconify/react";
// // import PagesIndex from "../../../Pages/PagesIndex";
// // import { getActualDateFormate, abc } from "../../../Utils/Common_Date";
// // const DynamicReport = ({
// //   config,
// //   fetchReportData,
// //   title,
// //   add_button,
// //   btnTitle,
// //   route,
// // }) => {
// //   const [formData, setFormData] = useState({});
// //   const [tableData, setTableData] = useState([]);
// //   const [GetTotal, setGetTotal] = useState(0);

// //   useEffect(() => {
// //     // Set default values
// //     const defaultData = {};
// //     config.fields.forEach((field) => {
// //       defaultData[field.name] = field.default || "";
// //     });
// //     setFormData(defaultData);
// //   }, [config.fields, tableData]);

// //   const handleInputChange = (e, field) => {
// //     setFormData({ ...formData, [field.name]: e.target.value });
// //   };

// //   const handleSubmit = async () => {
// //     const data = await fetchReportData(formData);
// //     let mainData = data.data || data || [];
// //     if (data.status) {
// //       setTableData(data.data || data || []);
// //     } else {
// //       setTableData([]);
// //     }

// //     let total = 0;

// //     mainData &&
// //       mainData.map((item) => {
// //         total += item.reqAmount || item.sumdigit;
// //       });

// //     setGetTotal(total);
// //   };

// //   return (
// //     <div className="content-body">
// //       <div className="container-fluid mt-3">
// //         <div className="card">
// //           <div className="d-flex align-items-center justify-content-between">
// //             <h4 className="m-0 p-3">{config.title}</h4>
// //             {add_button && (
// //               <Link className="submitBtn btn btn-primary" to={route}>
// //                 {btnTitle === "Add" ? (
// //                   <>
// //                     <Icon
// //                       icon="line-md:plus"
// //                       className="fw-bold"
// //                       style={{ fontSize: "20px" }}
// //                     />
// //                     &nbsp; Add
// //                   </>
// //                 ) : (
// //                   <>
// //                     <Icon
// //                       icon="line-md:arrow-left"
// //                       style={{ fontSize: "20px" }}
// //                     />
// //                     &nbsp; Back
// //                   </>
// //                 )}
// //               </Link>
// //             )}
// //           </div>
// //         </div>

// //         {/* Form for Filters */}
// //         <div className="row mt-3">
// //           <div className="col-12">
// //             <div className="card">
// //               <div className="card-body">
// //                 <form onSubmit={(e) => e.preventDefault()}>
// //                   <div className="row">
// //                     {config.fields.map((field, index) => (
// //                       <div
// //                         className={`col-md-${field.col_size || 3}`}
// //                         key={index}
// //                       >
// //                         {field.type === "text" && (
// //                           <>
// //                             <label
// //                               className={`custom-label col-12 col-form-label `}
// //                               htmlFor={field.name}
// //                             >
// //                               {field.label}
// //                               <span className="text-danger">*</span>
// //                             </label>
// //                             <input
// //                               type="text"
// //                               name={field.name}
// //                               placeholder={field.label}
// //                               value={formData[field.name]}
// //                               onChange={(e) => handleInputChange(e, field)}
// //                               className="form-control"
// //                             />
// //                           </>
// //                         )}
// //                         {field.type === "date" && (
// //                           <>
// //                             <label
// //                               className={`custom-label col-12 col-form-label `}
// //                               htmlFor={field.name}
// //                             >
// //                               {field.label}
// //                               <span className="text-danger">*</span>
// //                             </label>
// //                             <input
// //                               type="date"
// //                               name={field.name}
// //                               value={formData[field.name] || abc(new Date())}
// //                               onChange={(e) => handleInputChange(e, field)}
// //                               className="form-control"
// //                               max={abc(new Date())}
// //                             />
// //                           </>
// //                         )}
// //                         {field.type === "select" && (
// //                           <>
// //                             <label
// //                               className={`custom-label col-12 col-form-label `}
// //                               htmlFor={field.name}
// //                             >
// //                               {field.label}
// //                               <span className="text-danger">*</span>
// //                             </label>
// //                             <select
// //                               name={field.name}
// //                               value={formData[field.name]}
// //                               onChange={(e) => handleInputChange(e, field)}
// //                               className="form-control"
// //                             >
// //                               <option value="">{field.label}</option>
// //                               {field.options.map((option, idx) => (
// //                                 <option value={option.value} key={idx}>
// //                                   {option.label}
// //                                 </option>
// //                               ))}
// //                             </select>
// //                           </>
// //                         )}
// //                       </div>
// //                     ))}
// //                   </div>
// //                   <button
// //                     onClick={handleSubmit}
// //                     className="btn btn-primary primary-color mt-3"
// //                   >
// //                     Submit
// //                   </button>
// //                 </form>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Table with Pagination */}
// //         <div className="row mt-3">
// //           <div className="col-12">
// //             <div className="card">
// //               <div className="card-body">
// //                 <PagesIndex.TableWithCustomPeginationNew
// //                   data={tableData}
// //                   // SearchInTable={searchTerm}
// //                   visibleFields={config.visibleFields}
// //                   additional={
// //                     config.show_additional === true && (
// //                       <td className="fw-bold h4" colSpan={7}>
// //                         Total Amount : {GetTotal && GetTotal}/-
// //                       </td>
// //                     )
// //                   }
// //                   showIndex={true}
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DynamicReport;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Icon } from "@iconify/react";
// import PagesIndex from "../../../Pages/PagesIndex";
// import { getActualDateFormate, abc } from "../../../Utils/Common_Date";

// const DynamicReport = ({
//   config,
//   fetchReportData,
//   title,
//   add_button,
//   btnTitle,
//   route,
//   onloadData,
// }) => {
//   const [formData, setFormData] = useState({});
//   const [errors, setErrors] = useState({});
//   const [tableData, setTableData] = useState(onloadData || []);
//   const [GetTotal, setGetTotal] = useState(0);

//   useEffect(() => {
//     // Set default values
//     const defaultData = {};
//     config.fields.forEach((field) => {
//       defaultData[field.name] = field.default || "";
//     });
//     setFormData(defaultData);
//   }, [config.fields]);

//   const handleInputChange = (e, field) => {
//     setFormData({ ...formData, [field.name]: e.target.value });
//     if (errors[field.name]) {
//       setErrors({ ...errors, [field.name]: "" }); // Clear error when input changes
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     config.fields.forEach((field) => {
//       if (field.required && !formData[field.name]) {
//         newErrors[field.name] = `${field.label} is required`;
//       }
//       if (
//         field.type === "text" &&
//         field.minLength &&
//         formData[field.name]?.length < field.minLength
//       ) {
//         newErrors[
//           field.name
//         ] = `${field.label} must be at least ${field.minLength} characters`;
//       }
//       if (
//         field.type === "date" &&
//         field.maxDate &&
//         new Date(formData[field.name]) > new Date(field.maxDate)
//       ) {
//         newErrors[
//           field.name
//         ] = `${field.label} must be before ${field.maxDate}`;
//       }
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0; // Return true if no errors
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return; // Stop submission if validation fails

//     const data = await fetchReportData(formData);
//     let mainData = data.data || data || [];

//     console.log("mainDatamainData", mainData);

//       setTableData(mainData);

//     let total = 0;

//     if (mainData.length > 0) {
//       mainData &&
//         mainData.map((item) => {
//           total += item.reqAmount || item.sumdigit;
//         });
//     }

//     setGetTotal(total);
//   };

//   useEffect(() => {
//     setTableData(onloadData || []);
//   }, [onloadData]);

//   return (
//     <div className="content-body">
//       <div className="container-fluid mt-3">
//         <div className="card">
//           <div className="d-flex align-items-center justify-content-between">
//             <h4 className="m-0 p-3">{config.title}</h4>
//             {add_button && (
//               <Link className="submitBtn btn btn-primary" to={route}>
//                 {btnTitle === "Add" ? (
//                   <>
//                     <Icon
//                       icon="line-md:plus"
//                       className="fw-bold"
//                       style={{ fontSize: "20px" }}
//                     />
//                     &nbsp; Add
//                   </>
//                 ) : (
//                   <>
//                     <Icon
//                       icon="line-md:arrow-left"
//                       style={{ fontSize: "20px" }}
//                     />
//                     &nbsp; Back
//                   </>
//                 )}
//               </Link>
//             )}
//           </div>
//         </div>

//         {/* Form for Filters */}
//         <div className="row mt-3">
//           <div className="col-12">
//             <div className="card">
//               <div className="card-body">
//                 <form onSubmit={(e) => e.preventDefault()}>
//                   <div className="row">
//                     {config.fields.map((field, index) => (
//                       <div
//                         className={`col-md-${field.col_size || 3}`}
//                         key={index}
//                       >
//                         {field.type === "text" && (
//                           <>
//                             <label
//                               className={`custom-label col-12 col-form-label `}
//                               htmlFor={field.name}
//                             >
//                               {field.label}
//                               {field.required && (
//                                 <span className="text-danger">*</span>
//                               )}
//                             </label>
//                             <input
//                               type="text"
//                               name={field.name}
//                               placeholder={field.label}
//                               value={formData[field.name]}
//                               onChange={(e) => handleInputChange(e, field)}
//                               className="form-control"
//                             />
//                             {errors[field.name] && (
//                               <small className="text-danger">
//                                 {errors[field.name]}
//                               </small>
//                             )}
//                           </>
//                         )}
//                         {field.type === "date" && (
//                           <>
//                             <label
//                               className={`custom-label col-12 col-form-label `}
//                               htmlFor={field.name}
//                             >
//                               {field.label}
//                               {field.required && (
//                                 <span className="text-danger">*</span>
//                               )}
//                             </label>
//                             <input
//                               type="date"
//                               name={field.name}
//                               value={formData[field.name] || abc(new Date())}
//                               onChange={(e) => handleInputChange(e, field)}
//                               className="form-control"
//                               max={abc(new Date())}
//                             />
//                             {errors[field.name] && (
//                               <small className="text-danger">
//                                 {errors[field.name]}
//                               </small>
//                             )}
//                           </>
//                         )}
//                         {field.type === "select" && (
//                           <>
//                             <label
//                               className={`custom-label col-12 col-form-label `}
//                               htmlFor={field.name}
//                             >
//                               {field.label}
//                               {field.required && (
//                                 <span className="text-danger">*</span>
//                               )}
//                             </label>
//                             <select
//                               name={field.name}
//                               value={formData[field.name]}
//                               onChange={(e) => handleInputChange(e, field)}
//                               className="form-control"
//                             >
//                               <option value="">{field.label}</option>
//                               {field.options.map((option, idx) => (
//                                 <option value={option.value} key={idx}>
//                                   {option.label}
//                                 </option>
//                               ))}
//                             </select>
//                             {errors[field.name] && (
//                               <small className="text-danger">
//                                 {errors[field.name]}
//                               </small>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                   <button
//                     onClick={handleSubmit}
//                     className="btn btn-primary primary-color mt-3"
//                   >
//                     Submit
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Table with Pagination */}
//         <div className="row mt-3">
//           <div className="col-12">
//             <div className="card">
//               <div className="card-body">
//                 <PagesIndex.TableWithCustomPeginationNew
//                   data={tableData}
//                   initialRowsPerPage={5}
//                   visibleFields={config.visibleFields}
//                   additional={
//                     config.show_additional === true && (
//                       <td className="fw-bold h4" colSpan={7}>
//                         Total Amount : {GetTotal && GetTotal}/-
//                       </td>
//                     )
//                   }
//                   showIndex={true}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DynamicReport;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Icon } from "@iconify/react";
// import PagesIndex from "../../../Pages/PagesIndex";
// import { getActualDateFormate, abc } from "../../../Utils/Common_Date";

// const DynamicReport = ({
//   config,
//   fetchReportData,
//   title,
//   add_button,
//   btnTitle,
//   route,
//   onloadData,
//   setUserPagenateData,
//   TotalPagesCount,
//   Refresh,
// }) => {
//   const [formData, setFormData] = useState({});
//   const [errors, setErrors] = useState({});
//   const [tableData, setTableData] = useState(onloadData || []);
//   const [GetTotal, setGetTotal] = useState(0);

//   // Initialize form data with default values
//   useEffect(() => {
//     const defaultData = {};
//     config.fields.forEach((field) => {
//       defaultData[field.name] = field.default || "";
//     });
//     setFormData(defaultData);
//   }, [config.fields]);

//   // Update form data on input change
//   const handleInputChange = (e, field) => {
//     setFormData({ ...formData, [field.name]: e.target.value });
//     if (errors[field.name]) {
//       setErrors({ ...errors, [field.name]: "" });
//     }
//   };

//   // Form validation logic
//   const validateForm = () => {
//     const newErrors = {};
//     config.fields.forEach((field) => {
//       if (field.required && !formData[field.name]) {
//         newErrors[field.name] = `${field.label} is required`;
//       }
//       if (
//         field.type === "text" &&
//         field.minLength &&
//         formData[field.name]?.length < field.minLength
//       ) {
//         newErrors[
//           field.name
//         ] = `${field.label} must be at least ${field.minLength} characters`;
//       }
//       if (
//         field.type === "date" &&
//         field.maxDate &&
//         new Date(formData[field.name]) > new Date(field.maxDate)
//       ) {
//         newErrors[
//           field.name
//         ] = `${field.label} must be before ${field.maxDate}`;
//       }
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     const data = await fetchReportData(formData);
//     let mainData = data.data || data || [];

//     console.log("datadata", data);

//     if (mainData.length > 0) {
//       setTableData(mainData);

//       let total = 0;
//       mainData.forEach((item) => {
//         total += item.reqAmount || item.sumdigit;
//       });

//       setGetTotal(total);
//     } else {
//       setTableData([]);
//       setGetTotal(0);
//     }
//   };

//   useEffect(() => {
//     setTableData(onloadData || []);
//   }, [onloadData]);

//   return (
//     <div className="content-body">
//       <div className="container-fluid mt-3">
//         {/* Title and Add Button */}
//         <div className="card">
//           <div className="d-flex align-items-center justify-content-between">
//             <h4 className="m-0 p-3">{config.title}</h4>
//             {add_button && (
//               <Link className="submitBtn btn btn-primary" to={route}>
//                 {btnTitle === "Add" ? (
//                   <>
//                     <Icon
//                       icon="line-md:plus"
//                       className="fw-bold"
//                       style={{ fontSize: "20px" }}
//                     />
//                     &nbsp; Add
//                   </>
//                 ) : (
//                   <>
//                     <Icon
//                       icon="line-md:arrow-left"
//                       style={{ fontSize: "20px" }}
//                     />
//                     &nbsp; Back
//                   </>
//                 )}
//               </Link>
//             )}
//           </div>
//         </div>

//         {/* Form for Filters */}
//         <div className="row mt-3">
//           <div className="col-12">
//             <div className="card">
//               <div className="card-body">
//                 <form onSubmit={(e) => e.preventDefault()}>
//                   <div className="row">
//                     {config.fields.map((field, index) => (
//                       <div
//                         className={`col-md-${field.col_size || 3}`}
//                         key={index}
//                       >
//                         <label
//                           className="custom-label col-12 col-form-label"
//                           htmlFor={field.name}
//                         >
//                           {field.label}
//                           {field.required && (
//                             <span className="text-danger">*</span>
//                           )}
//                         </label>
//                         {field.type === "text" && (
//                           <input
//                             type="text"
//                             name={field.name}
//                             placeholder={field.label}
//                             value={formData[field.name]}
//                             onChange={(e) => handleInputChange(e, field)}
//                             className="form-control"
//                           />
//                         )}
//                         {field.type === "date" && (
//                           <input
//                             type="date"
//                             name={field.name}
//                             value={formData[field.name] || abc(new Date())}
//                             onChange={(e) => handleInputChange(e, field)}
//                             className="form-control"
//                             max={abc(new Date())}
//                           />
//                         )}
//                         {field.type === "select" && (
//                           <select
//                             name={field.name}
//                             value={formData[field.name]}
//                             onChange={(e) => handleInputChange(e, field)}
//                             className="form-control"
//                           >
//                             <option value="" selected disabled>
//                               {field.label}
//                             </option>
//                             {field.options.map((option, idx) => (
//                               <option value={option.value} key={idx}>
//                                 {option.label}
//                               </option>
//                             ))}
//                           </select>
//                         )}
//                         {errors[field.name] && (
//                           <span className="text-danger">
//                             {errors[field.name]}
//                           </span>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                   <button
//                     onClick={handleSubmit}
//                     className="btn btn-primary primary-color mt-3"
//                   >
//                     Submit
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Table with Pagination */}
//         <div className="row mt-3">
//           <div className="col-12">
//             <div className="card">
//               <div className="card-body">
//                 <PagesIndex.TableWithCustomPeginationNew
//                   tableData={tableData && tableData}
//                   TotalPagesCount={(TotalPagesCount && TotalPagesCount) || []}
//                   showIndex={true}
//                   Refresh={Refresh}
//                   setUserPagenateData={setUserPagenateData}
//                   columns={config.visibleFields}
//                   additional={
//                     config.show_additional && (
//                       <td className="fw-bold h4" colSpan={7}>
//                         Total Amount: {GetTotal}/-
//                       </td>
//                     )
//                   }
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DynamicReport;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import PagesIndex from "../../../Pages/PagesIndex";
import { getActualDateFormate, abc } from "../../../Utils/Common_Date";

const DynamicReport = ({
  config,
  fetchReportData,
  title,
  add_button,
  btnTitle,
  route,
  onloadData,
  setUserPagenateData,
  TotalPagesCount,
  UserPagenateData,
  Refresh,
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [GetTotal, setGetTotal] = useState(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Initialize form data with default values
  // useEffect(() => {
  //   const defaultData = {};
  //   config.fields.forEach((field) => {
  //     defaultData[field.name] = field.default || "";
  //   });
  //   setFormData(defaultData);
  // }, [config.fields]);


  useEffect(() => {
    const defaultData = {};
    config.fields.forEach((field) => {
      defaultData[field.name] = field.default || "";
    });
    
    // Only initialize if formData is empty (on component mount)
    if (Object.keys(formData).length === 0) {
      setFormData(defaultData);
    }
  }, [config.fields]);

  // Update form data on input change
  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field.name]: e.target.value });
    if (errors[field.name]) {
      setErrors({ ...errors, [field.name]: "" });
    }
  };

  // Form validation logic
  const validateForm = () => {
    const newErrors = {};
    config.fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      if (
        field.type === "text" &&
        field.minLength &&
        formData[field.name]?.length < field.minLength
      ) {
        newErrors[
          field.name
        ] = `${field.label} must be at least ${field.minLength} characters`;
      }
      if (
        field.type === "date" &&
        field.maxDate &&
        new Date(formData[field.name]) > new Date(field.maxDate)
      ) {
        newErrors[
          field.name
        ] = `${field.label} must be before ${field.maxDate}`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsFormSubmitted(true);

    const data = await fetchReportData(formData);

    console.log("datadata" ,data);
    

    let mainData = data.data || data || [];

    if (mainData.length > 0) {
      setTableData(mainData);

      let total = 0;
      mainData.forEach((item) => {
        total += item.reqAmount || item.sumdigit;
      });

      setGetTotal(total);
    } else {
      setTableData([]);
      setGetTotal(0);
    }
  };

  const testt = async () => {
    if (!isFormSubmitted) return;

    const data = await fetchReportData(formData);

    let mainData = data.data || data || [];

    if (mainData.length > 0) {
      setTableData(mainData);

      let total = 0;
      mainData.forEach((item) => {
        total += item.reqAmount || item.sumdigit;
      });

      setGetTotal(total);
    } else {
      setTableData([]);
      setGetTotal(0);
    }
  };

  useEffect(() => {
    testt();
  }, [UserPagenateData.pageno, UserPagenateData.limit]);

  return (
    <div className="content-body">
      <div className="container-fluid mt-3">
        {/* Title and Add Button */}
        <div className="card">
          <div className="d-flex align-items-center justify-content-between">
            <h4 className="m-0 p-3">{config.title}</h4>
            {add_button && (
              <Link className="submitBtn btn btn-primary" to={route}>
                {btnTitle === "Add" ? (
                  <>
                    <Icon
                      icon="line-md:plus"
                      className="fw-bold"
                      style={{ fontSize: "20px" }}
                    />
                    &nbsp; Add
                  </>
                ) : (
                  <>
                    <Icon
                      icon="line-md:arrow-left"
                      style={{ fontSize: "20px" }}
                    />
                    &nbsp; Back
                  </>
                )}
              </Link>
            )}
          </div>
        </div>

        {/* Form for Filters */}
        <div className="row mt-3">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="row">
                    {config.fields.map((field, index) => (
                      <div
                        className={`col-md-${field.col_size || 3}`}
                        key={index}
                      >
                        <label
                          className="custom-label col-12 col-form-label"
                          htmlFor={field.name}
                        >
                          {field.label}
                          {field.required && (
                            <span className="text-danger">*</span>
                          )}
                        </label>
                        {field.type === "text" && (
                          <input
                            type="text"
                            name={field.name}
                            placeholder={field.label}
                            value={formData[field.name]}
                            onChange={(e) => handleInputChange(e, field)}
                            className="form-control"
                          />
                        )}
                        {field.type === "date" && (
                          <input
                            type="date"
                            name={field.name}
                            value={formData[field.name] || abc(new Date())}
                            onChange={(e) => handleInputChange(e, field)}
                            className="form-control"
                            max={abc(new Date())}
                          />
                        )}
                        {field.type === "select" && (
                          <select
                            name={field.name}
                            value={formData[field.name]}
                            onChange={(e) => handleInputChange(e, field)}
                            className="form-control"
                          >
                            <option value="" selected disabled>
                              {field.label}
                            </option>
                            {field.options.map((option, idx) => (
                              <option value={option.value} key={idx}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}
                        {errors[field.name] && (
                          <span className="text-danger">
                            {errors[field.name]}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary primary-color mt-3"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Table with Pagination */}
        <div className="row mt-3">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <PagesIndex.TableWithCustomPeginationNew
                  tableData={tableData && tableData}
                  TotalPagesCount={(TotalPagesCount && TotalPagesCount) || []}
                  showIndex={true}
                  Refresh={Refresh}
                  setUserPagenateData={setUserPagenateData}
                  columns={config.visibleFields}
                  additional={
                    config.show_additional && (
                      <td className="fw-bold h4" colSpan={7}>
                        Total Amount: {GetTotal}/-
                      </td>
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicReport;
