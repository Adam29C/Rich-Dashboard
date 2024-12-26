import React from "react";
import PagesIndex from "../../PagesIndex";
import Cards from "../../../Layout/Cards/Cards";
import ReusableModal from "../../../Helpers/Modal/ReusableModal";
import TableWitCustomPegination from "../../../Helpers/Table/TableWithCustomPegination";

const Dashboard_Component = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [DashboardData, setDashboardData] = PagesIndex.useState([]);
  const [TodayDesposite, setTodayDesposite] = PagesIndex.useState([]);
  const [ModalState, setModalState] = PagesIndex.useState(false);
  const [SearchInTable, setSearchInTable] = PagesIndex.useState("");
  const [userFundArr, setuserFundArr] = PagesIndex.useState({});
  const [Request, setRequest] = PagesIndex.useState("");

  const [TableData, setTableData] = PagesIndex.useState([]);

  const { countDlt, data, yesTerday } = (DashboardData && DashboardData) || [];

  const getDashboardCount = async () => {
    const res = await PagesIndex.admin_services.GET_DASHBOARD_COUNT_API(
      userId,
      token
    );

    const res1 =
      await PagesIndex.admin_services.GET_DASHBOARD_COUNT_UPI_PAYMENT_API(
        userId,
        token
      );

    setTodayDesposite(res1.data);
    setDashboardData(res.data);
  };

  PagesIndex.useEffect(() => {
    getDashboardCount();
  }, []);

  var totalManualAmount = 0;
  const getMnaualTotal = (items) => {
    totalManualAmount += items.totalAmount - data.total_deposit_amount;
  };

  const GetTableData = async (request) => {
    const payload = {
      reqType: request,
      page: 1,
      limit: 10,
      search: SearchInTable,
    };

    try {
      const res1 =
        await PagesIndex.common_services.GET_DASHBOARD_REGISTRED_USERS(
          payload,
          token
        );

      setRequest(request);

      if (request === 1) {
        setTableData(res1.data.todayRegistered || []);
      } else if (request === 2) {
        setuserFundArr(res1.data.userFundArr || []);
      }
      setTableData(res1.data.todayRegistered || []);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  const TodayRegistedUserBalancefun = () => {
    let totalBalance = 0;

    if (Request === 1 && userFundArr) {
      totalBalance = Object.values(userFundArr).reduce(
        (sum, item) => sum + item.wallet_balance,
        // (sum, value) => sum + (value || 0),

        0
      );
    } else if (Request === 2 && TableData) {
      TableData.forEach((item) => {
        totalBalance += item.wallet_balance || 0;
      });
    }


    return totalBalance;
  };

  const visibleFields = ["Sr.", "name", "mobile", "wallet_balance"];

  return (
    <div>
      <div className="content-body">
        <div className="container-fluid mt-3">
          <div className="row">
            <Cards
              icon="fas fa-user-clock"
              tillnow="Till Now"
              counts={data?.Active_users}
              Title="Active Users"
              IconBGcolor="#71b6f9"
              ResponsiveClass="col-xl-3 col-md-6"
            />
            <Cards
              icon="fas fa-user-clock"
              tillnow="Till Now"
              counts={data?.total_user}
              Title="All Users"
              IconBGcolor="#71b6f9"
              ResponsiveClass="col-xl-3 col-md-6"
            />
            <Cards
              icon="mdi mdi-trending-up"
              tillnow="Till Now"
              counts={data?.totol_bids}
              Title="Total Bids Amount"
              IconBGcolor="#71b6f9"
              ResponsiveClass="col-xl-3 col-md-6"
            />
            <Cards
              icon="mdi mdi-trending-up"
              tillnow="Till Now"
              counts={data?.total_wallet_balance}
              Title="Wallet Amount"
              IconBGcolor="#323a46"
              ResponsiveClass="col-xl-3 col-md-6"
            />
            <Cards
              icon="mdi mdi-trending-up"
              tillnow="Till Now"
              counts={data?.total_paid_today}
              Title="Amount Paid"
              IconBGcolor="#ff5b5b"
              ResponsiveClass="col-xl-3 col-md-6"
            />
            <Cards
              icon="fas fa-user-alt-slash"
              tillnow="Till Now"
              counts={data?.Active_users}
              Title="LoggedIn Users"
              IconBGcolor="#5b69bc"
              ResponsiveClass="col-xl-3 col-md-6"
            />
            <Cards
              icon="fas fa-user-alt-slash"
              tillnow="Till Now"
              counts={data?.total_zero_bal_users}
              Title="Total Zero Balance User"
              IconBGcolor="#5b69bc"
              ResponsiveClass="col-xl-3 col-md-6"
            />
            <Cards
              icon="fas fa-user-clock"
              tillnow="Till Now"
              counts={data?.today_total_zero_bal_users}
              Title="Today Zero Balance"
              IconBGcolor="#5b69bc"
              ResponsiveClass="col-xl-3 col-md-6"
            />
            <Cards
              icon=" fas fa-user-alt-slash"
              tillnow="Till Now"
              counts={data?.banned_Users}
              Title="Banned Users"
              IconBGcolor="#5b69bc"
              ResponsiveClass="col-xl-3 col-md-6"
            />
            <Cards
              icon=" fas fa-user-alt-slash"
              tillnow="Till Now"
              counts={data?.total_deposit_amount}
              Title="Total Deposits"
              IconBGcolor="#5b69bc"
              ResponsiveClass="col-xl-3 col-md-6"
            />
            <Cards
              icon=" fas fa-user-alt-slash"
              tillnow="Till Now"
              counts={data?.total_withdraw_amount}
              Title="Total Withdraw"
              IconBGcolor="#5b69bc"
              ResponsiveClass="col-xl-3 col-md-6"
            />
            <Cards
              icon="mdi mdi-trending-up"
              tillnow={yesTerday?.createdAt}
              counts={yesTerday?.walletBal_12oClock}
              Title="Yesterday Wallet Balance"
              IconBGcolor="#71b6f9"
              ResponsiveClass="col-xl-3 col-md-6"
            />
          </div>

          <div className="row">
            <div className="col-xl-3 col-md-6">
              <div className="card-box">
                <button
                  type="button"
                  className="btn  btn-block btn-xs btn-warning waves-effect waves-light"
                  data-toggle="modal"
                  data-target="#market-ratio"
                  onClick={() => {
                    setModalState(true);
                    GetTableData(2);
                  }}
                >
                  <h5 className="btn-title-ee">Today Register With Balance</h5>
                </button>
                <button
                  type="button"
                  className="btn   btn-block  btn-xs btn-purple waves-effect waves-light"
                  data-toggle="modal"
                  data-target="#market-ratio"
                  onClick={() => {
                    setModalState(true);
                    GetTableData(1);
                  }}
                >
                  <h5 className="btn-title-ee">
                    Today Register With Zero Balance
                  </h5>
                </button>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-6 col-md-12">
              <div className="card-box">
                <div className="table-responsive">
                  <table className="table mb-0 text-center">
                    <thead>
                      <tr>
                        <th colSpan={2} className="primary-color">
                          Registered User Log{" "}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Today Registered</th>
                        <th>{data?.todayRegistered}</th>
                      </tr>
                      <tr className="bg-dark text-white">
                        <td>Yesterday Registered</td>
                        <th>{data?.yesterdayRegistered}</th>
                      </tr>
                      <tr>
                        <td>This Week</td>
                        <th>{data?.current_Week_regis_user}</th>
                      </tr>
                      <tr className="bg-success text-white">
                        <td>Last Week</td>
                        <th>{data?.lastweekRegistered}</th>
                      </tr>
                      <tr>
                        <td>This Month</td>
                        <th>{data?.current_month_Registered}</th>
                      </tr>
                      <tr className="bg-info text-white">
                        <td>Last Month</td>
                        <th>{data?.current_Week_regis_user}</th>
                      </tr>
                      <tr>
                        <td>Deleted Users</td>
                        {/* <th>{countDlt && countDlt}</th> */}
                      </tr>
                      <tr className="bg-warning text-white">
                        <td>Total Active Users</td>
                        <th>{data?.Active_users}</th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-md-12">
              <div className="card-box">
                <div className="table-responsive">
                  <table className="table mb-0 table-bordered text-center">
                    <thead></thead>
                    <tbody id="depositBriefReport">
                      <tr>
                        <th colSpan={2} className="primary-color">
                          Today Deposit Log{" "}
                        </th>
                      </tr>
                      {TodayDesposite &&
                        TodayDesposite.map((items) => {
                          return (
                            <>
                              <tr>
                                {getMnaualTotal(items)}
                                <td>{items.upiName}</td>
                                <td>{items.totalAmount}/-</td>
                              </tr>
                            </>
                          );
                        })}
                      <tr>
                        <td>MANUAL ADD AMOUNT</td>
                        <td>{totalManualAmount}</td>
                      </tr>
                      <tr>
                        <td>GRAND TOTAL</td>
                        <td>{data?.total_deposit_amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <ReusableModal
              ModalTitle={"User Registered Today"}
              ModalBody={
                <div>
                  <TableWitCustomPegination
                    data={TableData}
                    // columns={columns}
                    showIndex={true}
                    initialRowsPerPage={5}
                    SearchInTable={SearchInTable}
                    visibleFields={visibleFields}
                    additional={`Total Registered Balance : ${TodayRegistedUserBalancefun()}`}
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
                </div>
              }
              setModalState={setModalState}
              ModalState={ModalState}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard_Component;
