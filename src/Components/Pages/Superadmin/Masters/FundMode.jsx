import Main_Containt from "../../../Layout/Main/Main_Containt";
import ModalComponent from "../../../Helpers/Modal/ModalComponent";
import PagesIndex from "../../PagesIndex";

const FundMode = () => {
  //get token in localstorage
  const token = localStorage.getItem("token");

  //all state
  const [loading, setLoading] = PagesIndex.useState(false);
  const [data, setData] = PagesIndex.useState([]);
  const [visible, setVisible] = PagesIndex.useState(false);

  const getList = async () => {
    setLoading(true);
    try {
      const res = await PagesIndex.admin_services.GET_FUND_MODE_API(token);
      setData(res?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  PagesIndex.useEffect(() => {
    getList();
  }, []);

  //handle block and unblock status function
  const handleStatusUpdate = async (row) => {
    try {
      let apidata = {
        id: row._id,
        status: !row.disabled,
      };

      const response =
        await PagesIndex.admin_services.CHANGE_STATUS_FUND_MODE_API(
          apidata,
          token
        );

      if (response?.status) {
        PagesIndex.toast.success(response.message);
        getList();
      }
    } catch (error) {
      PagesIndex.toast.error(error);
    }
  };

  //delete fund mode list start
  const handleDelete = async (row) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Fund Mode?"
    );
    if (!confirmDelete) return;

    try {
      const apidata = {
        id: row?._id,
      };

      const res = await PagesIndex.admin_services.DELETE_FUND_MODE_API(
        apidata,
        token
      );

      if (res.status) {
        getList();
        alert(res?.message);
      }
    } catch (error) {}
  };

  const columns = [
    {
      name: "Mode",
      selector: (row) => row?.mode,
    },
    {
      name: "Redirect Url",
      selector: (row) => row?.redirectURL,
    },
    {
      name: "Status",
      selector: (row) => (row?.disabled ? "Disabled" : "Active"),
    },
    {
      name: "Edit",
      selector: (row) => (
        <span>
          <button
            onClick={() => handleStatusUpdate(row)}
            class={`btn ${
              row.disabled ? "btn-success" : "btn-danger"
            } btn-sm me-2`}
          >
         {/* <i className="fa-solid fa-user-slash mr-1 icon-fs"></i>
         <i className="fa-solid fa-user mr-1 icon-fs"></i>
            {row.disabled ? "Unblock" : "Block"} */}
            {
              row?.disabled ? (<><i className="fa-solid fa-user mr-1 icon-fs"></i>Unblock</>):(<> <i className="fa-solid fa-user-slash mr-1 icon-fs"></i>Block</>)
            }
          </button>
        </span>
      ),
    },

    {
      name: "Actions",
      selector: (cell, row) => (
        <div style={{ width: "120px" }}>
          <div>
            <span>
              <button
                onClick={() => handleDelete(cell)}
                class="btn btn-danger btn-sm me-2"
              >  <i class="fa fa-trash mr-1 icon-fs" aria-hidden="true"></i>
                Delete Mode
              </button>
            </span>
          </div>
        </div>
      ),
    },
  ];

  //handle add formik form
  const formik = PagesIndex.useFormik({
    initialValues: {
      mode: "",
      status: "",
      urlWeb: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.mode) {
        errors.mode = PagesIndex.valid_err.REQUIRE_MODE;
      }
      if (!values.urlWeb) {
        errors.urlWeb = PagesIndex.valid_err.URLWEB_MODE;
      }
      if (!values.status) {
        errors.status = PagesIndex.valid_err.STATUS_ERROR;
      }
      return errors;
    },

    onSubmit: async (values) => {
      try {
        let apidata = {
          mode: values.mode,
          status: values.status === "true",
          urlWeb: values.urlWeb,
        };

        const res = await PagesIndex.admin_services.ADD_FUND_MODE_API(
          apidata,
          token
        );

        if (res?.status) {
          PagesIndex.toast.success(res?.message);
          getList();
          setVisible(false);
          formik.setFieldValue("mode", "");
          formik.setFieldValue("status", "");
          formik.setFieldValue("urlWeb", "");
        } else {
          PagesIndex.toast.error(res.response.data.message);
        }
      } catch (error) {
        PagesIndex.toast.error(error);
      }
    },
  });

  const fields = [
    {
      name: "mode",
      label: "Payment Mode",
      type: "text",
      label_size: 12,
      col_size: 12,
    },
    {
      name: "urlWeb",
      label: "Redirect URL(Only For WEB Payment)",
      type: "text",
      label_size: 12,
      col_size: 12,
    },

    {
      name: "status",
      label: "Status",
      type: "select",
      title_size: 6,
      col_size: 12,
      options: [
        {
          label: "Active",
          value: true,
        },
        {
          label: "In-Active",
          value: false,
        },
      ],
    },
  ];

  // Handle Add Button
  const handleAdd = () => {
    setVisible(true);
  };

  return (
    <Main_Containt
      setVisible={setVisible}
      add_button={false}
      btn_modal={true}
      title="Payment Mode List"
      handleAdd={handleAdd}
    >
      <PagesIndex.Data_Table
        isLoading={loading}
        columns={columns}
        data={data}
      />
      <ModalComponent
        visible={visible}
        setVisible={setVisible}
        fields={fields}
        form_title="Add New Mode"
        formik={formik}
      />
      <PagesIndex.Toast />
    </Main_Containt>
  );
};

export default FundMode;
