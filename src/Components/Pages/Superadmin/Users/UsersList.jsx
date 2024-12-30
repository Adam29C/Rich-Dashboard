import React from "react";
import PagesIndex from "../../PagesIndex";
import ReusableModal from "../../../Helpers/Modal/ReusableModal";
import { useFormik } from "formik";

const App = () => {
  const token = localStorage.getItem("token");

  let { user_id, role } = JSON.parse(localStorage.getItem("userdetails"));

  const [ModalStateUserProfile, setModalStateUserProfile] =
    PagesIndex.useState(false);
  const [GetRowData, setGetRowData] = PagesIndex.useState("");
  const [Refresh, setRefresh] = PagesIndex.useState(false);

  const [ModalStateForRemoveAndBlock, setModalStateForRemoveAndBlock] =
    PagesIndex.useState(false);

  const [ManageModalStatus, setManageModalStatus] = PagesIndex.useState(false);
  const [GetUserProfile, seGetUserProfile] = PagesIndex.useState([]);

  const fetchData = async (page, rowsPerPage, searchQuery) => {
    const payload = {
      page: page,
      limit: rowsPerPage,
      search: searchQuery,
    };

    try {
      const response = await PagesIndex.admin_services.USERS_LIST_API(
        payload,
        token
      );

      const totalRows = response?.recordsTotal || 25;
      let mainRes = response.data;

      return { mainRes, totalRows };
    } catch {}
  };
  PagesIndex.useEffect(() => {
    fetchData();
  }, []);

  const visibleFields = [
    {
      name: "Name",
      value: "name",
      sortable: true,
    },
    {
      name: "User Name",
      value: "username",
      sortable: false,
    },
    {
      name: "Mobile",
      value: "mobile",
      sortable: true,
    },
    {
      name: "Device Name",
      value: "deviceName",
      sortable: true,
    },
    {
      name: "Device-Id",
      value: "deviceId",
      sortable: true,
    },
    {
      name: "Created At",
      value: "CreatedAt",
      sortable: true,
    },

    {
      // name: "Profile",
      name: "Block",
      isButton: true,
      value: (row) => (row.banned ? "Unblock" : "Block"),
      buttonColor: (row) => (row.banned ? "success" : "danger"),
      Conditions: (row) => {
        BlockUserAndRemoveUser(row, 1);
      },
    },
    {
      name: "Profile",
      value: "Profile",
      isButton: true,
      buttonColor: "purple",
      Conditions: (row) => {
        getProfile(row);
      },
    },
    {
      name: "Delete",
      value: "Delete",
      buttonColor: "danger",
      isButton: true,
      sortable: true,
      Conditions: (row) => {
        BlockUserAndRemoveUser(row, 2);
      },
    },
  ];

  const getProfile = async (row) => {
    const res = await PagesIndex.common_services.PROFILE_GET_API(row.id, token);
    if (res.status) {
      setModalStateUserProfile(true);
      seGetUserProfile(res.userData);
    } else {
      setModalStateUserProfile(false);
      PagesIndex.toast.error(res.response.data.message);
    }
  };

  const BlockUserAndRemoveUser = async (row, buttonStatus) => {
    setGetRowData(row);

    if (buttonStatus === 1) {
      setManageModalStatus(buttonStatus);
      setModalStateForRemoveAndBlock(!ModalStateForRemoveAndBlock);
    } else if (buttonStatus === 2) {
      setManageModalStatus(buttonStatus);
      setModalStateForRemoveAndBlock(!ModalStateForRemoveAndBlock);
    } else {
      return "";
    }
  };

  const formik = useFormik({
    initialValues: {
      blockReason: "",
    },

    validate: (values) => {
      const errors = {};
      return errors;
    },
    onSubmit: async (values) => {
      let res;
      if (ManageModalStatus === 1) {
        if (!values.blockReason) {
          PagesIndex.toast.error("Please Enter Reason For Block ");
          return;
        }

        const req = {
          id: GetRowData.id,
          blockStatus: GetRowData.banned ? false : true,
          blockReason: values.blockReason,
        };

        res = await PagesIndex.common_services.BLOCK_USER_API(req, token);

        if (res.status) {
          setRefresh(!Refresh);
          formik.setFieldValue("blockReason", "");
          PagesIndex.toast.success(res.message);
          setModalStateForRemoveAndBlock(!ModalStateForRemoveAndBlock);
        } else {
          setModalStateForRemoveAndBlock(!ModalStateForRemoveAndBlock);
          // setRefresh(!Refresh);
          PagesIndex.toast.error(res.response.data.message);
        }
      } else if (ManageModalStatus === 2) {
        if (!values.blockReason) {
          PagesIndex.toast.error("Please Enter Reason For Delete User ");
          return;
        }
        const req = {
          id: GetRowData.id,
          ression: values.blockReason,
        };

        res = await PagesIndex.common_services.DELETED_USERS_API(req, token);

        if (res.status) {
          setRefresh(!Refresh);
          PagesIndex.toast.success(res.message);
          setModalStateForRemoveAndBlock(!ModalStateForRemoveAndBlock);
        } else {
          setModalStateForRemoveAndBlock(!ModalStateForRemoveAndBlock);
          setRefresh(!Refresh);
          PagesIndex.toast.error(res.response.data.message);
        }
      } else {
        return "";
      }
    },
  });

  const fields = [
    {
      name: "blockReason",
      label: "Enter  Message",
      type: "msgbox",
      label_size: 12,
      col_size: 12,
      row_size: 6,
    },
  ];

  return (
    <PagesIndex.Main_Containt
      add_button={false}
      route="/admin/user/add"
      title="All Users"
    >
      <PagesIndex.TableWithCustomPeginationNew
        fetchData={fetchData}
        columns={visibleFields}
        showIndex={true}
        Refresh={Refresh}
      />

      <ReusableModal
        ModalTitle={`User Profile : ${
          GetUserProfile && GetUserProfile.username
        }`}
        ModalBody={
          <div>
            <table class="table table-bordered table-responsive">
              <tbody>
                <tr>
                  <td scope="col">Address</td>
                  <td scope="col">
                    {GetUserProfile && GetUserProfile.address
                      ? GetUserProfile && GetUserProfile.address
                      : "--"}
                  </td>
                </tr>
                <tr>
                  <td scope="col">City</td>
                  <td scope="col">
                    {GetUserProfile && GetUserProfile.city
                      ? GetUserProfile && GetUserProfile.city
                      : "--"}
                  </td>
                </tr>
                <tr>
                  <td scope="col">Acc Holder Name</td>
                  <td scope="col">
                    {GetUserProfile && GetUserProfile.account_holder_name
                      ? GetUserProfile && GetUserProfile.account_holder_name
                      : "--"}
                  </td>
                </tr>
                <tr>
                  <td scope="col">Bank Name</td>
                  <td scope="col">
                    {GetUserProfile && GetUserProfile.bank_name
                      ? GetUserProfile && GetUserProfile.bank_name
                      : "--"}
                  </td>
                </tr>
                <tr>
                  <td scope="col">Pincode</td>
                  <td scope="col">
                    {GetUserProfile && GetUserProfile.pincode
                      ? GetUserProfile && GetUserProfile.pincode
                      : "--"}
                  </td>
                </tr>
                <tr>
                  <td scope="col">IFSC</td>
                  <td scope="col">
                    {GetUserProfile && GetUserProfile.ifsc_code
                      ? GetUserProfile && GetUserProfile.ifsc_code
                      : "--"}
                  </td>
                </tr>
                <tr>
                  <td scope="col">Paytm Number</td>
                  <td scope="col">
                    {GetUserProfile && GetUserProfile.paytm_number
                      ? GetUserProfile && GetUserProfile.paytm_number
                      : "--"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        }
        setModalState={setModalStateUserProfile}
        ModalState={ModalStateUserProfile}
      />

      <ReusableModal
        ModalTitle={
          <h5 class="modal-title" id="mySmallModalLabel">
            Reason For
            {ManageModalStatus && ManageModalStatus === 1 ? "Block" : "Delete"}
            The User
          </h5>
        }
        ModalBody={
          <div>
            {/* <h6> */}
            <PagesIndex.Formikform
              fieldtype={fields.filter((field) => !field.showWhen)}
              formik={formik}
              btn_name={"Submit"}
              button_Size={"w-100"}
              show_submit={true}
            />
          </div>
        }
        setModalState={setModalStateForRemoveAndBlock}
        ModalState={ModalStateForRemoveAndBlock}
      />
      <PagesIndex.Toast />
    </PagesIndex.Main_Containt>
  );
};

export default App;
