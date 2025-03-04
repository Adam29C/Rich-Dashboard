import React, { useEffect, useState } from "react";
import Split_Main_Containt from "../../../Layout/Main/Split_Main_Content";
import PagesIndex from "../../../Pages/PagesIndex";
import { abc, today } from "../../../Utils/Common_Date";
import "react-datepicker/dist/react-datepicker.css";
import { Games_Provider_List } from "../../../Redux/slice/CommonSlice";
import { Api } from "../../../Config/Api";
import { useMemo } from "react";

const MainGameReports = ({
  gameType,
  report_api,
  starandjackProvider,
  title,
}) => {
  //get token in local storage
  const token = localStorage.getItem("token");
  //set actual date
  const actual_date_formet = abc(new Date());
  //dispatch
  const dispatch = PagesIndex.useDispatch();

  //navigate
  const navigate = PagesIndex.useNavigate();
  //all state
  const [SearchInTable, setSearchInTable] = PagesIndex.useState("");
  const [tableData, setTableData] = useState([]);
  const [ProviderList, setProviderList] = useState([]);
  const [first, setfirst] = useState(0);
  const { gameProviders } = PagesIndex.useSelector(
    (state) => state.CommonSlice
  );

  //get game provider data
  const getGameProvidersList = async () => {
    let ApiRoute = `${Api.WITHDRAWLIST}?status=All&start_date=${abc(
      new Date()
    )}&end_date=${abc(new Date())}`;

    setfirst(1);

    const res = await PagesIndex.report_service.GET_REPORT_DETAILS_API(
      ApiRoute,
      token
    );

    setTableData(res.data);
  };

  PagesIndex.useEffect(() => {
    getGameProvidersList();
  }, []);

  const formik = PagesIndex.useFormik({
    initialValues: {
      status: "All",
      HistoryType: "Deposite",
      start_date: today(new Date()),
      end_date: today(new Date()),
    },

    validate: (values) => {
      const errors = {};

      return errors;
    },

    onSubmit: async (values) => {
      let status = values.status;
      let startdate = abc(values.start_date);
      let enddate = abc(values.end_date);

      try {
        let ApiRoute;

        if (formik.values.HistoryType === "Deposite") {
          setfirst(1);
          ApiRoute = `${Api.WITHDRAWLIST}?status=${status}&start_date=${startdate}&end_date=${enddate}`;

          console.log("ApiRoute", ApiRoute);
        } else if (formik.values.HistoryType === "Withdraw") {
          setfirst(2);

          ApiRoute = `${Api.GATWAYPAYMENTLIST}?status=${status}&start_date=${startdate}&end_date=${enddate}`;
        }

        const res = await PagesIndex.report_service.GET_REPORT_DETAILS_API(
          ApiRoute,
          token
        );

        if (res.status) {
          setTableData(res.data);
        }
      } catch (error) {
        console.log(error);
        const errorMessage =
          error.response?.data?.message ||
          "Something went wrong. Please try again.";
        PagesIndex.toast.error(errorMessage);
      }
    },
  });

  const fields = [
    {
      name: "start_date",
      label: "Start Date",
      type: "date",
      label_size: 12,
      col_size: 3,
      max: { actual_date_formet },
    },
    {
      name: "end_date",
      label: "End Date",
      type: "date",
      label_size: 12,
      col_size: 3,
      max: { actual_date_formet },
    },
    {
      name: "HistoryType",
      label: "History Type",
      type: "select",
      default: "0",
      options: [
        {
          label: "Deposite",
          value: "Deposite",
        },
        {
          label: "Withdraw",
          value: "Withdraw",
        },
      ],
      label_size: 12,
      col_size: 3,
    },
    {
      name: "status",
      label: "Type",
      type: "select",
      default: "0",
      options:
        formik.values.HistoryType === "Deposite"
          ? [
              {
                label: "All",
                value: "All",
              },

              {
                label: "SUCCESS",
                value: "SUCCESS",
              },
              {
                label: "FAILED",
                value: "FAILED",
              },
            ]
          : [
              {
                label: "All",
                value: "All",
              },
              {
                label: "PENDING",
                value: "PENDING",
              },
              {
                label: "APPROVED",
                value: "APPROVED",
              },
              {
                label: "REJECTED",
                value: "REJECTED",
              },
            ],
      label_size: 12,
      col_size: 3,
    },
  ];

  const visibleFields = [
    {
      name: "User Name",
      value: "username",
      sortable: true,
    },
    {
      name: "Contact No.",
      value: "mobile",
      sortable: false,
    },
    {
      name: "Bank Name",
      value: "bank_name",
      sortable: true,
      style: (row) => ({
        display: first == 1 ? "none" : "",
      }),
    },
    {
      name: "IFSC Code",
      value: "ifsc_code",
      sortable: true,
      style: (row) => ({
        display: first == 1 ? "none" : "",
        // display: "none",
      }),
    },
    {
      name: "Wallet Balance",
      value: "wallet_balance",
      sortable: true,
      style: (row) => ({
        display: first == 1 ? "none" : "",
        // display: "none",
      }),
    },
    {
      name: "Request Amount",
      value: "amount",
      sortable: true,
      notheader: true,
    },
    {
      name: "Transaction Id",
      value: "order_id",
      sortable: true,
      transform: (value, row) => {
        // console.log("row", row);
        return row.transaction_id || row.order_id || "null";
      },
    },

    {
      name: "Date",
      value: "created_at",
      sortable: true,
      transform: (value) => {
        let dateObj = new Date(value);
        return dateObj.toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true, // 12-hour format with AM/PM
        });
      },
    },
    {
      name: "Type",
      value: "status",
      sortable: true,
    },
  ];

  // console.log("formik.values.HistoryType", formik.values.HistoryType);

  const totalAmount = useMemo(
    () =>
      tableData.reduce((acc, item) => acc + (parseFloat(item?.amount) || 0), 0),
    [tableData]
  );

  const cardLayouts = [
    {
      size: 12,
      body: (
        <div>
          <PagesIndex.Formikform
            fieldtype={fields.filter((field) => !field.showWhen)}
            show_submit={true}
            formik={formik}
            btn_name="Submit"
          />
        </div>
      ),
    },

    {
      size: 12,
      body: (
        <div>
          <PagesIndex.TableWithCustomPeginationNew123
            data={tableData}
            initialRowsPerPage={25}
            SearchInTable={SearchInTable}
            visibleFields={visibleFields}
            showIndex={true}
            searchInput={
              <input
                type="text"
                placeholder="Search..."
                value={SearchInTable}
                onChange={(e) => setSearchInTable(e.target.value)}
                className="form-control ms-auto"
              />
            }
          />

          <h3 className="ml-3 mb-3 fw-bold responsive-total-amount">
            Total Amount {totalAmount}/-
          </h3>
        </div>
      ),
    },
  ];

  return (
    <>
      <Split_Main_Containt
        title={"Gatway Report"}
        add_button={false}
        btnTitle="Add"
        route="/add"
        cardLayouts={cardLayouts}
      />
    </>
  );
};

export default MainGameReports;
