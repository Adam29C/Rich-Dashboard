import React, { useEffect, useMemo } from "react";
import PagesIndex from "../../PagesIndex";
import {
  get_Time_From_Unix_Dete_string,
  Get_Year_With_Time_With_Column_Saprate,
  show,
} from "../../../Utils/Common_Date";

const ManualRequest = () => {
  //get token in localstorage
  const token = localStorage.getItem("token");

  //all state
  const [activeTabIndex, setActiveTabIndex] = PagesIndex.useState(0);
  const [GetIds, setGetIds] = PagesIndex.useState([]);

  const [data, setData] = PagesIndex.useState([]);

  // Log the corresponding tab name
  const tabTitles = ["pending", "approved", "rejected"];
  const status = tabTitles[activeTabIndex];
  //get fund requestdata
  const getFundRequestList = async () => {
    const res = await PagesIndex.admin_services.GATWAY_PAYMENT_LIST(
      status,
      token
    );

    if (res?.status) {
      setData(res?.data);
    }
  };

  useEffect(() => {
    getFundRequestList();
  }, [activeTabIndex]);

  //handle status change

  const handleStatusChange = async (id, value) => {
    const apidata = {
      request_id: id,
      action: value,
    };

    const res =
      await PagesIndex.admin_services.GATWAY_PAYMENT_DEPOSITE_OR_DECLINED(
        apidata,
        token
      );

    if (res.status) {
      PagesIndex.toast.success(res.message);
      getFundRequestList();
    }
    console.log("dfdffsfsfds", res);
  };

  const totalAmount = useMemo(
    () => data.reduce((acc, item) => acc + (parseFloat(item?.amount) || 0), 0),
    [data]
  );

  const columns = [
    {
      name: "User Name",
      selector: (row) => row.username,
    },
    {
      name: "Contact No",
      selector: (row) => row.mobile,
    },

    {
      name: "Account No.",
      selector: (row) => row.account_no,
    },
    {
      name: "IFSC",
      selector: (row) => row.ifsc_code,
    },
    {
      name: "Wallet Amount",
      selector: (row) => row.wallet_balance,
    },
    {
      name: "Request Amount",
      selector: (row) => row.amount,
    },
    {
      name: "Type",
      selector: (row) => (
        <div>
          {status === "pending" ? (
          <select
            className="p-1"
            aria-label="Default select example"
            // value={row.status}
            onChange={(e) => {
              handleStatusChange(row?.request_id, e.target.value);
            }}
          >
            <option disabled selected value="">
              please select 
            </option>
            <option value="APPROVE">Approve</option>
            <option value="REJECT">Decline</option>
          </select>
           ) : (
            row.status
          )} 
        </div>
      ),
    },
    {
      name: "Date & Time",
      selector: (row) => Get_Year_With_Time_With_Column_Saprate(row.created_at),
    },
  ];

  const handleChange = ({ selectedRows }) => {
    let aaa = selectedRows.map((items) => {
      return items.request_id;
    });

    setGetIds({ request_id: aaa, action: "APPROVE_ALL" });
  };

  const ApprovedAll = () => {};

  // console.log("GetIds", GetIds);

  const tabs = [
    {
      title: "Pending Request",
      content: (
        <>
          <div className="mt-4">
            <PagesIndex.Data_Table
              columns={columns}
              data={data}
              // selectableRows
              onSelectedRowsChange={handleChange}
            />
            <h3 className="ml-3 mb-3 fw-bold responsive-total-amount">
              Total Amount {totalAmount}/-
            </h3>
          </div>
        </>
      ),
    },
    {
      title: "Approved Request",
      content: (
        <div className="mt-4">
          <PagesIndex.Data_Table columns={columns} data={data} />{" "}
          {/* <h3 className="ml-3 mb-3 fw-bold responsive-total-amount">
            Total Amount {totalAmount}/-
          </h3> */}
        </div>
      ),
    },
    {
      title: "Declined Request",
      content: (
        <div className="mt-4">
          <PagesIndex.Data_Table columns={columns} data={data} />{" "}
          {/* <h3 className="ml-3 mb-3 fw-bold responsive-total-amount">
            Total Amount {totalAmount}/-
          </h3> */}
        </div>
      ),
    },
  ];
  return (
    <PagesIndex.Main_Containt title="Gatway Payment List">
      {/* {status === "pending" && (
        <button className="submitBtn btn" onClick={() => ApprovedAll()}>
          Approve All
        </button>
      )} */}
      <PagesIndex.MultiTabs
        tabs={tabs}
        activeTabIndex={activeTabIndex}
        onTabSelect={(index) => {
          setActiveTabIndex(index); // Update active tab index
        }}
      />
      <PagesIndex.Toast />
    </PagesIndex.Main_Containt>
  );
};

export default ManualRequest;
