import React from "react";
import MainGameReports from "../../../Helpers/Reports/GameReports/MainReport";
import PagesIndex from "../../PagesIndex";
import { Api } from "../../../Config/Api";
import { abc, today } from "../../../Utils/Common_Date";
import { toast, ToastContainer } from "react-toastify";

const AllReports = () => {
  const token = localStorage.getItem("token");

  const [GetBankDetails, setGetBankDetails] = PagesIndex.useState([]);
  const [GetAdminDetails, setGetAdminsDetails] = PagesIndex.useState([]);
  const [first, setfirst] = PagesIndex.useState([]);

  const [Refresh, setRefresh] = PagesIndex.useState(false);

  const [UserPagenateData, setUserPagenateData] = PagesIndex.useState({
    pageno: 1,
    limit: 10,
  });

  const [TotalPages, setTotalPages] = PagesIndex.useState(1);

  const getReportDetails = async () => {
    const res = await PagesIndex.report_service.GET_REPORT_DETAILS_API(
      Api.GET_FUND_REPORT_DETAILS,
      token
    );
    setGetBankDetails(res.data);
    setGetAdminsDetails(res.adminName);
  };

  PagesIndex.useEffect(() => {
    getReportDetails();
  }, []);

  const FIELDS = [
    {
      title: "Fund Report",
      fields: [
        { name: "sdate", label: "Start Date", type: "date", col_size: 3 },
        { name: "edate", label: "End Date", type: "date", col_size: 3 },
        {
          name: "reqType",
          label: "Credit/Debit",
          type: "select",
          options: [
            {
              label: "Credit",
              value: "Credit",
            },
            {
              label: "Debit",
              value: "Debit",
            },
          ],
          col_size: 2,
        },
        {
          name: "bankName",
          label: "Perticular",
          type: "select",
          options:
            (GetBankDetails &&
              GetBankDetails?.map((item) => ({
                label: item.bankName,
                value: item._id,
              }))) ||
            [],
          col_size: 2,
        },
        {
          name: "admin_id",
          label: "Select Admin",
          type: "select",
          options:
            (GetAdminDetails &&
              GetAdminDetails?.map((item) => ({
                label: item.username,
                value: item._id,
              }))) ||
            [],
          col_size: 2,
        },
      ],
      visibleFields: [
        {
          name: "User Name",
          value: "username",
          sortable: true,
        },
        {
          name: "Mobile",
          value: "mobile",
          sortable: false,
        },
        {
          name: "Time",
          value: "reqUpdatedAt",
          sortable: true,
          transform: (item) => {
            return item || "-";
          },
        },
        {
          name: "Particuler",
          value: "withdrawalMode",
          sortable: true,
          transform: (item) => {
            return item || "-";
          },
        },

        {
          name: "Amount",
          value: "reqAmount",
          sortable: true,
          transform: (item) => {
            return item || "-";
          },
        },
        {
          name: "Added/By",
          value: "UpdatedBy",
          sortable: true,
          transform: (item) => {
            return item || "null";
          },
        },
      ],
      fetchReportData: async (value) => {
        // await abdced(value);

        // console.log("value.bankName", value);

        // if (!value.reqType) {
        //   toast.error("Please select a Credit/Debit.");
        //   return;
        // }
        // if (value.reqType === "Credit" && !value.bankName) {
        //   toast.error("Please select Particuler Also.");
        //   return;
        // }
        // if (value.reqType === "Debit" && !value.bankName && !value.admin_id) {
        //   toast.error("Please select Particuler and admin also.");
        //   return;
        // }

        // if (!value.bankName) {
        //   toast.error("Please select Perticular.");
        //   return;
        // }

        const payload = {
          sdate: today(value.sdate),
          edate: today(value.edate),
          bankName: value.bankName || "1",
          reqType: value.reqType || "Credit",
          admin_id: value.admin_id || "1",
          page: UserPagenateData.pageno,
          limit: UserPagenateData.limit,
          // sdate: "12/11/2024",
          // edate: "12/11/2024",
          // bankName: "1",
          // reqType: "Debit",
          // admin_id: "1",
        };
        try {
          // return await abdced(value);
          const res = await PagesIndex.report_service.GET_FUND_REPORT_API(
            Api.GET_FUND_REPORT,
            payload,
            token
          );

          console.log("res", res);

          if (res.status) {
            setTotalPages(res.totalRecords);
            setfirst(res.data);

            setRefresh(!Refresh);
            // toast.success(res.message);
          } else {
            toast.error(res.response.data.message);
          }
          return res;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            "Something went wrong. Please try again.";
          toast.error(errorMessage);
        }
      },

      show_additional: true,
    },
  ];

  return (
    <div>
      {FIELDS.map((config, idx) => (
        <MainGameReports
          key={idx}
          title={config.title}
          config={config}
          fetchReportData={config.fetchReportData}
          setUserPagenateData={setUserPagenateData}
          UserPagenateData={UserPagenateData}
          TotalPagesCount={(TotalPages && TotalPages) || []}
          Refresh={Refresh}
        />
      ))}
      <PagesIndex.Toast />
    </div>
  );
};

export default AllReports;
