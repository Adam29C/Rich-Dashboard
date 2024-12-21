import React from "react";
import PagesIndex from "../../PagesIndex";
import { getActualDateWithFormat } from "../../../Utils/Common_Date";
import CreditDeclinedRequest from "../../../Helpers/CreditDeclinedRequest/CreditDeclinedRequest";

const DeclinedRequest = () => {
  //get token in local storage
  const token = localStorage.getItem("token");

  //set actual date
  const actual_date_formet = getActualDateWithFormat(new Date());

  //all state
  const [SearchInTable, setSearchInTable] = PagesIndex.useState("");
  const [tableData, setTableData] = PagesIndex.useState([]);

  const title = "Declined Report"
  const subtitle = "Declined Debit Requests"

  // get api decline request 

  const getDeclinedRequest = async (date = actual_date_formet) => {
    const payload = {
      date_cust: date,
      page: 1,
      limit: 10,
      search: SearchInTable,
    };
    const res = await PagesIndex.admin_services.GET_DECLINED_REQUEST_API(
      payload,
      token
    );

    if (res?.status) {
      setTableData(res?.data);
    }
  };

  PagesIndex.useEffect(() => {
    getDeclinedRequest();
  }, []);

  const formik = PagesIndex.useFormik({
    initialValues: {
      date: actual_date_formet || null,
    },
    validate: (values) => {},

    onSubmit: async (values) => {
        getDeclinedRequest(values.date);
    },
  });

  

  const fields = [
    {
      name: "date",
      label: "Search By Approve Date",
      type: "date",
      label_size: 12,
      col_size: 12,
    },
  ];

  const visibleFields = [
    "id",
    "username",
    "fullname",
    "mobile",
    "reqDate",
    "reqTime",
    "withdrawalMode",
    "reqAmount",
  ];


  return (
    <>
      <CreditDeclinedRequest fields={fields} formik={formik} tableData={tableData} SearchInTable={SearchInTable} setSearchInTable={setSearchInTable} visibleFields={visibleFields} title={title} subtitle={subtitle}/>
    </>
  );
};

export default DeclinedRequest;
