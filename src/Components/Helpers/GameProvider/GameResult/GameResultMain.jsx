import React, { useEffect, useState } from "react";
import Split_Main_Containt from "../../../Layout/Main/Split_Main_Content";
import PagesIndex from "../../../Pages/PagesIndex";
import { getActualDateFormate, today } from "../../../Utils/Common_Date";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Games_Provider_List } from "../../../Redux/slice/CommonSlice";

const ExamplePage = ({
  gameType,
  main_result,
  main_result_add,
  past_result,
  winner_list,
  distribute_fund,

  remove_result,
}) => {
  //get token in local storage
  const token = localStorage.getItem("token");
  //set actual date
  const actual_date_formet = getActualDateFormate(new Date());
  //dispatch
  const dispatch = PagesIndex.useDispatch();

  //navigate
  const navigate = PagesIndex.useNavigate();
  //all state
  const [SearchInTable, setSearchInTable] = PagesIndex.useState("");
  const [tableData, setTableData] = useState([]);
  console.log("tableDatatableData" ,tableData);
  
  const [GetProvider, setGetProvider] = useState([]);

  //get game result function
  const getGameResultApi = async () => {
    // const res = await PagesIndex.admin_services.GAME_RESULT(token);

    const res = await PagesIndex.game_service.ALL_GAME_RESULTS(
      main_result,
      token
    );

    console.log("res?.data?.result" ,res);
    
    // if (res.status) {
      setTableData(res?.data?.result || res?.data?.results || res.result );
      setGetProvider(res?.data?.provider || res?.data?.providers || res?.data );
    // }
  };

  //get game provider data
  const getGameProvidersList = () => {
    dispatch(Games_Provider_List(token));
  };

  //get apis functions call in useEffect
  PagesIndex.useEffect(() => {
    getGameProvidersList();
    getGameResultApi();
  }, []);

  const formik = PagesIndex.useFormik({
    initialValues: {
      winningDigit: "",
      resultDate: actual_date_formet || null,
      session: "",
      providerId: "",
      providerName: "",
    },

    validate: (values) => {
      const errors = {};
      if (!values.providerId) {
        errors.providerId = PagesIndex.valid_err.GAME_PROVIDER_ERROR;
      }
      if (!values.session) {
        errors.session = PagesIndex.valid_err.GAME_SESSION_ERROR;
      }
      if (!values.resultDate) {
        errors.resultDate = PagesIndex.valid_err.DOMAIN_ERROR;
      }
      if (!values.winningDigit) {
        errors.winningDigit = PagesIndex.valid_err.GAME_WINING_DIGIT_ERROR;
      }
      return errors;
    },

    onSubmit: async (values) => {
      const selectedProviderName =
        GetProvider &&
        GetProvider.find((item) => item._id === values.providerId)
          ?.providerName;

      const payload = {
        providerId: values.providerId,
        providerName: selectedProviderName,
        session: values.session,
        resultDate: today(values.resultDate),
        winningDigit: values.winningDigit,
      };

      try {
        const res = await PagesIndex.game_service.ALL_GAME_RESULTS_ADD_API(
          main_result_add,
          payload,
          token
        );

        if (res.status) {
          PagesIndex.toast.success(res?.data?.message || res?.message);
          getGameResultApi();
        } else {
          PagesIndex.toast.error(res.response.data.message);
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

  //formik form for only result date
  const formik1 = PagesIndex.useFormik({
    initialValues: {
      date: getActualDateFormate(new Date()),
    },

    validate: (values) => {
      const errors = {};
      return errors;
    },
    onSubmit: async (values) => {
      const apidata = values.date;
      try {

        // console.log('past_resultpast_result' ,past_result);
        
        const res = await PagesIndex.game_service.ALL_GAME_PAST_RESULTS(
          past_result,
          apidata,
          token
        );

        if (res.status) {
          PagesIndex.toast.success(res.message);
          setTableData(res.data.results || res.data.result);
        } else {
          PagesIndex.toast.error(res.message);
        }
      } catch (error) {
        PagesIndex.toast.error(error.response.data.message);
      }
    },
  });

  const fields = [
    {
      name: "providerId",
      label: "Provider Name",
      type: "select",
      options:
        (GetProvider &&
          GetProvider?.map((item) => ({
            label: item.providerName,
            value: item._id,
          }))) ||
        [],
      label_size: 12,
      col_size: 3,
    },

    {
      name: "session",
      label: "Session",
      type: "select",
      options: [
        { label: "Open", values: 1 },
        { label: "Close", values: 0 },
      ],
      label_size: 12,
      col_size: 3,
    },
    {
      name: "resultDate",
      label: "Result Date",
      type: "date",
      label_size: 12,
      col_size: 3,
      // min: { actual_date_formet },
      max: { actual_date_formet },
    },
    {
      name: "winningDigit",
      label: "Winning Digit",
      type: "text",
      label_size: 12,
      col_size: 3,
    },
  ];

  const fields1 = [
    {
      name: "date",
      label: "Result Date",
      type: "date",
      label_size: 12,
      col_size: 12,
      max: { actual_date_formet },
    },
  ];

  //game result delete
  const handleDelete = async (row) => {
    const apidata = {
      resultId: row?._id,
      providerId: row?.providerId,
      session: row?.session,
    };

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this game?"
    );
    if (!confirmDelete) return;

    try {
      let res = "";
      if (gameType === "StarLine" || gameType === "JackPot") {
        res = await PagesIndex.game_service.REMOVE_WINNER_LIST(
          remove_result,
          apidata,
          token
        );
      }
      res = await PagesIndex.admin_services.GAME_RESULT_DELETE(apidata, token);



      
      if (res.statusCode === 200 || res.status) {
        alert(res?.message);
        getGameResultApi;
      } else {
        PagesIndex.toast.error(res.response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //handle actions button function
  const handleActionBtn = (row, buttonStatus) => {
    var locationData = {
      row: row,
      route: winner_list,
      gameType: gameType,
      distribute_fund: distribute_fund,
    };
    if (buttonStatus === 1) {
      if (gameType === "StarLine") {
        navigate(`/admin/starline/winnerlist/providerId=${row.providerId}`, {
          state: locationData,
        });
      } else if (gameType === "JackPot") {
        navigate(`/admin/jackpot/winnerlist/providerId=${row.providerId}`, {
          state: locationData,
        });
      } else {
        navigate(`/admin/starline/winnerlist/providerId=${row.providerId}`, {
          state: locationData,
        });
      }
    } else if (buttonStatus === 2) {
      handleDelete(row);
    } else {
      return "";
    }
  };

  // const visibleFields = [
  //   // "id",
  //   "providerName",
  //   "session",
  //   "resultDate",
  //   "winningDigit",
  // ];

  const visibleFields = [
    {
      name: "provider Name",
      value: "providerName",
      sortable: true,
    },
    {
      name: "Session",
      value: "session",
      sortable: true,
    },
    {
      name: "Result Date",
      value: "resultDate",
      sortable: true,
    },
    // {
    //   name: "winning Digit",
    //   value: "winningDigit",
    //   sortable: true,
    // },
    {
      name: "Get Winners List",
      value: "Get Winners List",
      buttonColor: "success",
      isButton: true,
      sortable: true,
      Conditions: (row) => {
        handleActionBtn(row, 1);
      },
    },
    {
      name: "Delete Result",
      value: "Delete Result",
      buttonColor: "danger",
      isButton: true,
      sortable: true,
      Conditions: (row) => {
        handleActionBtn(row, 2);
      },
    },
  ];

  // const UserFullButtonList = [
  //   {
  //     id: 0,
  //     buttonName: "Get Winners List",
  //     buttonColor: "",
  //     route: "",
  //     Conditions: (row) => {
  //       handleActionBtn(row, 1);
  //     },
  //     Visiblity: true,
  //     type: "button",
  //   },
  //   {
  //     id: 1,
  //     buttonName: "Delete Result",
  //     buttonColor: "danger",
  //     route: "test",
  //     Conditions: (row) => {
  //       handleActionBtn(row, 2);
  //     },
  //     Visiblity: false,
  //     type: "button",
  //   },
  // ];
  const cardLayouts = [
    {
      size: 9,
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
      size: 3,
      body: (
        <div>
          <div>
            <PagesIndex.Formikform
              fieldtype={fields1.filter((field) => !field.showWhen)}
              formik={formik1}
              show_submit={true}
              btn_name="Search Result"
            />
          </div>
        </div>
      ),
    },
    {
      size: 12,
      body: (
        <div>
          <PagesIndex.TableWithCustomPeginationNew123
            data={tableData}
            initialRowsPerPage={5}
            SearchInTable={SearchInTable}
            visibleFields={visibleFields}
            // UserFullButtonList={UserFullButtonList}
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
        </div>
      ),
    },
  ];

  return (
    <>
      <Split_Main_Containt
        title="Game Results"
        add_button={false}
        btnTitle="Add"
        route="/add"
        cardLayouts={cardLayouts}
      />
    </>
  );
};

export default ExamplePage;
