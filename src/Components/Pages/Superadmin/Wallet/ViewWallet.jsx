import React from "react";
import PagesIndex from "../../PagesIndex";
import ReusableModal from "../../../Helpers/Modal/ModalComponent_main";
import { useFormik } from "formik";
import Toast from "../../../Helpers/Toast";
import { toast } from "react-toastify";

const ViewWallet = () => {
  const token = localStorage.getItem("token");
  let { user_id, role } = JSON.parse(localStorage.getItem("userdetails"));

  const [SearchInTable, setSearchInTable] = PagesIndex.useState("");
  const [TableData, setTableData] = PagesIndex.useState([]);

  const [ModalStateHistory, setModalStateHistory] = PagesIndex.useState(false);
  const [ModalStateHistoryTable, setModalStateHistoryTable] =
    PagesIndex.useState([]);
  const [ModalStateHistoryUserDetails, setModalStateHistoryUserDetails] =
    PagesIndex.useState("");
  const [rowStatus, setRowStatus] = PagesIndex.useState(0);
  const [UserDetails, setUserDetails] = PagesIndex.useState({
    userData1: {},
    userData2: {},
  });

  const [Refresh, setRefresh] = PagesIndex.useState(false);

  const [UserPagenateData, setUserPagenateData] = PagesIndex.useState({
    pageno: 1,
    limit: 10,
  });

  const [TotalPages, setTotalPages] = PagesIndex.useState(1);

  const visibleFields1 = [
    { name: "Previous Amount", value: "Previous_Amount", sortable: true },
    {
      name: "Transaction Amount",
      value: "Transaction_Amount",
      sortable: false,
    },
    { name: "Current Amount", value: "Current_Amount", sortable: true },
    { name: "Description ", value: "Description", sortable: true },
    { name: "Transaction Date", value: "Transaction_Date", sortable: true },
    { name: "Added by", value: "Added_by", sortable: true },
  ];

  const getHistory = async (row, number) => {
    setRowStatus(number);
    setModalStateHistoryUserDetails(row);

    if (number === 1) {
      const payload = {
        id: row._id,
        page: UserPagenateData.pageno,
        limit: UserPagenateData.limit,
        search: SearchInTable,
      };
      const res = await PagesIndex.admin_services.WALLET_LIST_CREDIT_API(
        payload,
        token
      );
      if (res) {
        setModalStateHistory(true);
        setModalStateHistoryTable(res.data);
        setTotalPages(res.recordsTotal);
      } else {
        setModalStateHistoryTable([]);
      }
    } else if (number === 2) {
      const payload = {
        id: row._id,
        page: UserPagenateData.pageno,
        limit: UserPagenateData.limit,
        search: SearchInTable,
      };

      const res = await PagesIndex.admin_services.WALLET_LIST_HISTORY_API(
        payload,
        token
      );

      if (res) {
        setModalStateHistory(true);
        setTotalPages(res.recordsTotal);
        setModalStateHistoryTable(res.data);
      } else {
        setModalStateHistoryTable([]);
      }
    } else if (number === 3) {
      const res = await PagesIndex.admin_services.WALLET_LIST_USER_PROFILE_API(
        row._id,
        token
      );

      if (res.status) {
        setUserDetails(res.data);
        setModalStateHistory(true);
      } else {
        // alert(res.response.data.message)
        toast.error(res.response.data.message);
      }
    } else if (number === 4) {
      setModalStateHistory(true);
    }
  };

  var formik = useFormik({
    initialValues: {
      amount: "",
      type: 1,
      particular: "",
    },

    validate: (values) => {
      const errors = {};
      if (!values.type) {
        errors.type = "Please Select Type";
      }
      if (!values.amount) {
        errors.amount = "Please Enter Amount";
      }
      if (parseInt(values.amount) > 510000) {
        errors.amount = "Max amount is 510000";
      }

      if (!values.particular) {
        errors.particular = "Please Select particular";
      }

      return errors;
    },

    onSubmit: async (values) => {
      const payload = {
        id: ModalStateHistoryUserDetails._id,
        amount: values.amount,
        type: values.type,
        particular: values.particular,
        admin_id: user_id,
      };

      const res = await PagesIndex.admin_services.WALLET_LIST_UPDATE_WALLET_API(
        payload,
        token
      );

      if (res.status) {
        toast.success("update sucessfully");
        setModalStateHistory(false);
      }
    },
  });

  const fields = [
    {
      name: "type",
      label: "Type",
      type: "select",
      Visiblity: true,
      title_size: 12,
      col_size: 12,
      options: [
        {
          label: "Credit(Deposit)",
          value: 1,
        },
        {
          label: "Debit(Withdrawal)",
          value: 2,
        },
      ],
    },
    {
      name: "amount",
      label: "Amount",
      type: "number",
      label_size: 12,
      col_size: 12,
      Visiblity: true,
    },

    {
      name: "particular",
      label: "Particular",
      type: "select",
      Visiblity: true,
      title_size: 12,
      col_size: 12,
      options: [
        {
          label: "Manual",
          value: "manual",
        },
        {
          label: "ManualPayment",
          value: "paymentManual",
        },
        {
          label: "UPI",
          value: "UPI",
        },
      ],
    },
  ];

  const UserFullButtonList = [
    {
      id: 0,
      buttonName: "C/D Histoy",
      buttonColor: "info",
      route: "",
      Conditions: (row) => {
        //setGetBannedData(row.banned);
        getHistory(row, 1);
      },
      Visiblity: true,
      type: "button",
    },
    {
      id: 1,
      buttonName: "Update Wallet",
      buttonColor: "info",
      route: "test",
      Conditions: (row) => {
        // getProfile(row);
        getHistory(row, 4);
      },
      Visiblity: false,
      type: "button",
    },
    {
      id: 2,
      buttonName: "History",
      buttonColor: "info",
      Conditions: (row) => {
        getHistory(row, 2);
      },

      Visiblity: false,
      type: "button",
    },
    {
      id: 2,
      buttonName: "profile",
      buttonColor: "info",
      Conditions: (row) => {
        getHistory(row, 3);
      },

      Visiblity: false,
      type: "button",
    },
  ];

  const { userData1, userData2 } = UserDetails && UserDetails;

  const fetchData = async (page, rowsPerPage, searchQuery) => {


    const payload = {
      page: page,
      limit: rowsPerPage || 25,
      search :searchQuery,
    };

    try {
      const response = await PagesIndex.admin_services.GET_WALLET_LIST(
        payload,
        token
      );

      const totalRows = response?.totalRecords ;
      let mainRes = response.records;

      console.log("mainResmainRes", mainRes);

      return { mainRes, totalRows };
    } catch {}
  };
  PagesIndex.useEffect(() => {
    fetchData();
  }, []);

  // const visibleFields = [
  //   "id",
  //   "username",
  //   "name",
  //   "mobile",
  //   "wallet_balance",
  //   "wallet_bal_updated_at",
  // ];

  const visibleFields = [
    {
      name: "User Name",
      value: "username",
      sortable: true,
    },
    {
      name: "Name",
      value: "name",
      sortable: false,
    },
    {
      name: "mobile",
      value: "mobile",
      sortable: false,
    },
    {
      name: "wallet balance",
      value: "wallet_balance",
      sortable: false,
    },
    {
      name: "wallet Balence Updated At",
      value: "wallet_bal_updated_at",
      sortable: false,
    },
    // {
    //   // name: "Profile",
    //   name: "View Chnage History",
    //   isButton: true,
    //   // className : 'color-primary' ,
    //   value: (row) => "View Chnage History",
    //   buttonColor: "primary",
    //   Conditions: (row) => {
    //     handleViewHistory(row);
    //   },
    // },

    {
   
      name: "C/D Histoy",
      isButton: true,
      buttonColor: "dark",
      value: (row) => "Histoy",
      Conditions: (row) => {
        //setGetBannedData(row.banned);
        getHistory(row, 1);
      },
      // Visiblity: true,
      // type: "button",
    },
    {
     
      name: "Edit",
      isButton: true,
      buttonColor: "info",
      value: (row) => "Edit",
      Conditions: (row) => {
        // getProfile(row);
        getHistory(row, 4);
      },
      // Visiblity: false,
      // type: "button",
    },
  ];

  return (
    <PagesIndex.Main_Containt
      add_button={false}
      // route="/admin/user/add"
      title="View Wallet"
    >
      <PagesIndex.TableWithCustomPeginationNew
        fetchData={fetchData}
        columns={visibleFields}
        showIndex={true}
        Refresh={Refresh}
        data={TableData}
        // columns={columns}
        initialRowsPerPage={5}
        SearchInTable={SearchInTable}
        visibleFields={visibleFields}
        UserFullButtonList={UserFullButtonList}
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

      <ReusableModal
        show={ModalStateHistory}
        onClose={setModalStateHistory}
        title={
          rowStatus === 1 || rowStatus === 2
            ? `Transaction History of : ${ModalStateHistoryUserDetails.username} `
            : rowStatus === 4
            ? "Update Wallet Balance "
            : "User Profile"
        }
        size={rowStatus === 4 ? "sm" : "lg"}
        body={
          <>
            {rowStatus === 1 || rowStatus === 2 ? (
              <PagesIndex.TableWithCustomPeginationNew
                tableData={ModalStateHistoryTable && ModalStateHistoryTable}
                TotalPagesCount={(TotalPages && TotalPages) || []}
                columns={visibleFields1}
                showIndex={true}
                Refresh={Refresh}
                setUserPagenateData={setUserPagenateData}
                // data={ModalStateHistoryTable}
                // // columns={columns}
                // initialRowsPerPage={5}
                // SearchInTable={SearchInTable}
                // visibleFields={visibleFields1}
                // searchInput={
                //   <input
                //     type="text"
                //     placeholder="Search..."
                //     value={SearchInTable}
                //     onChange={(e) => setSearchInTable(e.target.value)}
                //     className="form-control ms-auto"
                //   />
                // }
              />
            ) : rowStatus === 3 ? (
              <div className="main">
                <div className="profile-content">
                  <div className="container">
                    <div className="row">
                      <div className="col-md-6 ml-auto mr-auto">
                        <div className="profile">
                          <div className="name">
                            <h3 className="title" id="username">
                              User Name : {userData1.username}
                            </h3>
                            <p className="walletbalance" id="balance">
                              Wallet Balance : {userData1.wallet_balance}/-
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="user-data">
                  <div className="container">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>Bank Name</td>
                          <td id="bankName">{userData2.bank_name}</td>
                        </tr>
                        <tr>
                          <td>Account Number</td>
                          <td id="accNo"> {userData2.account_no}</td>
                        </tr>
                        <tr>
                          <td>IFSC Code</td>
                          <td id="ifsc">{userData2.ifsc_code}</td>
                        </tr>
                        <tr>
                          <td>Account Holder Name</td>
                          <td id="accHolder">
                            {userData2.account_holder_name}
                          </td>
                        </tr>
                        <tr>
                          <td>Paytm Number</td>
                          <td>
                            {userData2.paytm_number
                              ? userData2.paytm_number
                              : "-"}
                          </td>
                        </tr>
                        <tr>
                          <td>Personal Number</td>
                          <td id="regular">{userData1.mobile}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : rowStatus === 4 ? (
              <>
                <PagesIndex.Formikform
                  fieldtype={fields.filter((field) => !field.showWhen)}
                  formik={formik}
                  btn_name={"Submit"}
                  button_Size={"w-100"}
                  show_submit={true}
                />
              </>
            ) : (
              ""
            )}
          </>
        }
        primaryButtonText="Save Changes"
        secondaryButtonText="Close"
        showFooter={false}
        // onPrimaryAction={handleSave}
      />
      <PagesIndex.Toast />
    </PagesIndex.Main_Containt>
  );
};

export default ViewWallet;
