import React from "react";
import CreditDeclinedRequest from "../../../Helpers/CreditDeclinedRequest/CreditDeclinedRequest";
import PagesIndex from "../../PagesIndex";
import { getActualDateWithFormat } from "../../../Utils/Common_Date";

const ApproveReportBankManual = () => {
  //get token in local storage
  const token = localStorage.getItem("token");

  //set actual date
  const actual_date_formet = getActualDateWithFormat(new Date());

  //all state
  const [SearchInTable, setSearchInTable] = PagesIndex.useState("");
  const [tableData, setTableData] = PagesIndex.useState([]);

  const title = "Declined Report";
  const subtitle = "APPROVED Debit Requests : Bank Account";

  // get api decline request

  const fetchData = async (
    page,
    rowsPerPage,
    searchQuery ,
    date = actual_date_formet
  ) => {
    const payload = {
      page: page,
      limit: rowsPerPage,
      date: date,
      search :searchQuery
    };

    try {
      const response = await PagesIndex.admin_services.APPROVED_DEBIT_BANK_MANUAL_API(
        payload,
        token
      );

      const totalRows = response?.total || 5;
      let mainRes = response.data;
      setTableData(mainRes);

      return { mainRes, totalRows };
    } catch {}
  };


  const formik = PagesIndex.useFormik({
    initialValues: {
      date: actual_date_formet || null,
    },
    validate: (values) => {},

    onSubmit: async (values) => {
      getDataList(values.date);
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
    { name: "User Name", value: "username", sortable: true },
    { name: "Name", value: "fullname", sortable: false },
    { name: "Mobile", value: "mobile", sortable: true },
    { name: "Mode", value: "withdrawalMode", sortable: true },
    { name: "Amount", value: "reqAmount", sortable: true },
    { name: "Time", value: "reqDate", sortable:  true },
    // { name: "Request Time", value: "createTime", sortable: true },
    { name: "Approved On ", value: "reqUpdatedAt", sortable: true },
    // { name: "Account No", value: "account_no", sortable: true },
  ];
  return (
    <CreditDeclinedRequest
      fields={fields}
      formik={formik}
      tableData={tableData}
      SearchInTable={SearchInTable}
      setSearchInTable={setSearchInTable}
      visibleFields={visibleFields}
      title={title}
      subtitle={subtitle}
      fetchData={fetchData}
    />
  );
};

export default ApproveReportBankManual;
