import React from "react";
import Split_Main_Containt from "../../Layout/Main/Split_Main_Content";
import { useFormik } from "formik";
import PagesIndex from "../../Pages/PagesIndex";
import { Games_Provider_List } from "../../Redux/slice/CommonSlice";
import { Api } from "../../Config/Api";
import { today } from "../../Utils/Common_Date";
import ReusableModal from "../Modal/ModalComponent_main";

const SplitForm = () => {
  const token = localStorage.getItem("token");
  const dispatch = PagesIndex.useDispatch();

  const [TableOne, setTableOne] = PagesIndex.useState([]);
  const [TableTwo, setTableTwo] = PagesIndex.useState([]);
  const [TableThree, setTableThree] = PagesIndex.useState([]);
  const [SearchInTable, setSearchInTable] = PagesIndex.useState("");
  const [ShowBidInfoModal, setShowBidInfoModal] = PagesIndex.useState(false);
  const [ShowBidInfoList, setShowBidInfoList] = PagesIndex.useState([]);

  const { gameProviders } = PagesIndex.useSelector(
    (state) => state.CommonSlice
  );

  PagesIndex.useEffect(() => {
    dispatch(Games_Provider_List(token));
  }, []);

  const calculatePL = (sumDigit, gamePrice, threshold) => {
    const pl = sumDigit * gamePrice;
    const profit = pl > threshold ? 0 : threshold - pl;
    const loss = pl > threshold ? pl - threshold : 0;

    return { amountToPay: pl, profit, loss };
  };

  const formik = useFormik({
    initialValues: {
      gameDate: "",
      gameSession: "",
      providerId: "",
    },

    validate: (values) => {
      const errors = {};

      // if (!values.gameSession) {
      //   errors.gameSession = "Please Select Game Session";
      // }

      // if (!values.providerId) {
      //   errors.providerId = "Please Select Provider";
      // }

      return errors;
    },
    onSubmit: async (values) => {
      const payload = {
        // gameDate: values.gameDate || today(new Date()),
        // gameSession: values.gameSession,
        // providerId: values.providerId,s

        gameDate: "12/04/2024",
        gameSession: "Jodi Digit",
        providerId: "668d4228211a65d88600f6f0",
      };

      if (values.gameSession === "Open" || values.gameSession === "Close") {
        const response1 = await PagesIndex.report_service.ALL_GAME_REPORT_API(
          Api.CUTTING_GROUP_OC_LIST,
          payload,
          token
        );

        // ----------------------

        // Reduce logic for grouping
        const result = response1.data.data1.reduce(
          (acc, item) => {
            if (item.bidDigit.length === 3) {
              // Combine all "Pana" type
              acc.pana.totalBids += item.countBid;
              acc.pana.totalSumDigit += item.sumdigit;
            } else if (item.bidDigit.length === 1) {
              // Combine all "Single Digit" type
              acc.singleDigit.totalBids += item.countBid;
              acc.singleDigit.totalSumDigit += item.sumdigit;
            }
            return acc;
          },
          {
            pana: { gameType: "Pana", totalBids: 0, totalSumDigit: 0 },
            singleDigit: {
              gameType: "Single Digit",
              totalBids: 0,
              totalSumDigit: 0,
            },
          }
        );
        const totalArray = Object.values(result);

        // Calculate grand total
        const grandTotal = {
          gameType: "Grand Total",
          totalBids: totalArray.reduce((sum, item) => sum + item.totalBids, 0),
          totalSumDigit: totalArray.reduce(
            (sum, item) => sum + item.totalSumDigit,
            0
          ),
        };

        const Finalresult = {
          originalData: totalArray,
          totals: grandTotal,
        };

        setTableOne(Finalresult);

        const pannaArr = [];
        const singleArr = [];

        let singleDigit = result.singleDigit.totalSumDigit;
        let pana = result.pana.totalSumDigit;

        response1.data.data2.map((e) => {
          const {
            _id,
            countBid = 0,
            sumdigit = 0,
            gameSession,
            gamePrice,
          } = e || {}; // Default values
          const isSingleDigit = _id && _id.length === 1;
          const threshold = isSingleDigit ? singleDigit : pana;

          const {
            amountToPay = 0,
            profit = 0,
            loss = 0,
          } = _id
            ? calculatePL(sumdigit, gamePrice, threshold)
            : { amountToPay: 0, profit: 0, loss: 0 };

          const result = {
            _id: _id,
            countBid: countBid,
            totalBidAmm: sumdigit,
            session: gameSession,
            Amounttopay: amountToPay,
            Profit: profit,
            Loss: loss,
          };

          if (isSingleDigit) {
            singleArr[_id] = result;
          } else {
            pannaArr[_id] = result;
          }
        });

        let id_array = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

        let finalResult = id_array.map((item) => {
          if (singleArr[item]) {
            return singleArr[item];
          } else {
            return {
              _id: item,
              countBid: 0,
              totalBidAmm: 0,
              session: "Nill",
              Amounttopay: 0,
              Profit: singleDigit,
              Loss: 0,
            };
          }
        });

        setTableTwo(finalResult);

        let array3 = [];

        response1.data.pana.map((panaItem) => {
          const match = pannaArr.find((item) => {
            if (item !== undefined) {
              return parseInt(item._id) === parseInt(panaItem.Digit);
            }
            return;
          });

          if (match) {
            array3.push({
              ...match,
              digit_id: panaItem.Digit + "-" + panaItem.DigitFamily,
            });
          } else {
            // If no match is found, push a default object to array3
            array3.push({
              digit_id: panaItem.Digit + "-" + panaItem.DigitFamily,
              countBid: 0,
              totalBidAmm: 0,
              session: "Nill",
              Amounttopay: 0,
              SumDigit: 0,
              Profit: pana,
              Loss: 0,
            });
          }
        });

        array3.sort((a, b) => {
          const idA = a.digit_id.split("-")[0];
          const idB = b.digit_id.split("-")[0];
          return idA - idB;
        });

        setTableThree(array3);
      } else {
        const response = await PagesIndex.report_service.ALL_GAME_REPORT_API(
          Api.CUTTING_GROUP_LIST,
          payload,
          token
        );

        setTableTwo(response.data.data2);

        const total = response.data.data1.reduce(
          (acc, { sumdigit, countBid }) => {
            acc.totalSumDigit += sumdigit;
            acc.totalBids += countBid;
            return acc;
          },
          { totalSumDigit: 0, totalBids: 0 }
        );

        const result = {
          originalData: response.data.data1,
          totals: {
            totalSumDigit: total.totalSumDigit,
            totalBids: total.totalBids,
          },
        };

        setTableOne(result);

        let jodiArray = [];

        let totalSum = result.totals.totalSumDigit;
        let Profit = 0;
        let Loss = 0;
        response.data.data2.map((items) => {
          let totalamm = items.sumdigit * items.gamePrice;

          if (totalamm > totalSum) {
            Loss = totalamm - totalSum;
            Profit = 0;
          } else {
            Loss = 0;
            Profit = totalSum - totalamm;
          }

          jodiArray.push({
            _id: items._id,
            countBid: items.countBid,
            totalBidAmm: items.sumdigit,
            Amounttopay: totalamm,
            Profit: Profit,
            Loss: Loss,
          });

          jodiArray.sort((a, b) => a._id.localeCompare(b._id));
        });

        console.log("jodiArray", jodiArray);

        setTableTwo(jodiArray);
      }
    },
  });

  const fields = [
    {
      name: "gameDate",
      label: "Start Date",
      type: "date",
      label_size: 12,
      col_size: 4,
    },
    {
      name: "providerId",
      label: "Provider",
      type: "select",
      label_size: 12,

      col_size: 4,
      options:
        (gameProviders &&
          gameProviders.map((item) => ({
            label: item.providerName,
            value: item._id,
          }))) ||
        [],
    },
    {
      name: "gameSession",
      label: "Session",
      type: "select",
      label_size: 12,

      col_size: 4,
      options: [
        {
          label: "Open",
          value: "Open",
        },
        {
          label: "Close",
          value: "Close",
        },
        {
          label: "Jodi",
          value: "Jodi Digit",
        },
        {
          label: "Half Sangam",
          value: "Half Sangam Digits",
        },
        {
          label: "Full Sangam",
          value: "Full Sangam Digits",
        },
      ],
    },
  ];

  const visibleFields = [
    {
      name: "Digit",
      value: "_id",
      sortable: true,
    },
    {
      name: "Session",
      value: "session",
      sortable: true,
      style: (row) => ({
        display: "none",
        color: "white",
      }),
    },
    {
      name: "Bid Count",
      value: "countBid",
      sortable: false,
      transform: (item, row) => {
        return `View Bids Info (${item})`;
      },
      onClick: (row) => {
        showBidInfor(row);

        console.log(row);
      },
    },
    {
      name: "Total Bid Count",
      value: "totalBidAmm",
      sortable: true,
    },
    {
      name: "Amount To Pay",
      value: "Amounttopay",
      sortable: true,
    },
    {
      name: "Profit",
      value: "Profit",
      sortable: true,
      style: (row) => ({
        color: "green",
        fontWeight: "bold",
      }),
    },
    {
      name: "Loss",
      value: "Loss",
      sortable: true,
      notheader: true,
      style: (row) => ({
        color: "red",
        fontWeight: "bold",
      }),
    },
  ];
  const visibleFields1 = [
    {
      name: "Digit",
      value: "digit_id",
      sortable: true,
    },
    {
      name: "Session",
      value: "session",
      sortable: true,
    },
    {
      name: "Bid Count",
      value: "countBid",
      sortable: false,
      transform: (item, row) => {
        return `View Bids Info (${item})`;
      },
    },
    {
      name: "Total Bid Count",
      value: "totalBidAmm",
      sortable: true,
    },
    {
      name: "Amount To Pay",
      value: "Amounttopay",
      sortable: true,
    },
    {
      name: "Profit",
      value: "Profit",
      sortable: true,
      style: (row) => ({
        color: "green",
        fontWeight: "bold",
      }),
    },
    {
      name: "Loss",
      value: "Loss",
      sortable: true,
      style: (row) => ({
        color: "red",
        fontWeight: "bold",
      }),
    },
  ];

  const visibleFields2 = [
    {
      name: "User Name",
      value: "userName",
      sortable: true,
    },
    {
      name: "Bracket",
      value: "bidDigit",
      sortable: true,
    },
    {
      name: "Amount",
      value: "biddingPoints",
      sortable: false,
    },
    {
      name: "win Status",
      value: "winStatus",
      sortable: true,
      transform: (item, row) => {
        return item === 1 ? "Win" : item === 2 ? "Loss" : "Pending";
      },
    },
    {
      name: "Played Time",
      value: "createdAt",
      sortable: true,
    },
  ];

  const showBidInfor = async () => {
    setShowBidInfoModal(!ShowBidInfoModal);

    // const response1 = await PagesIndex.report_service.ALL_GAME_REPORT_API(
    //   Api.GET_BID_DATA,
    //   payload,
    //   token
    // );

    const response = [
      {
        isPaymentDone: false,
        _id: "674fec8cc169043ce44bb6cb",
        userId: "672f382f6ac4cd90feda4e46",
        providerId: "668d41bc211a65d88600f65f",
        gameTypeId: "6690701918732c8c3c427b09",
        providerName: "SRIDEVI",
        gameTypeName: "Single Digit",
        gameTypePrice: 10,
        userName: "ratilal",
        mobileNumber: "+917567448732",
        bidDigit: "1",
        biddingPoints: 20,
        gameSession: "Open",
        winStatus: 2,
        gameWinPoints: 0,
        gameDate: "12/04/2024",
        updatedAt: "12/04/2024 11:41:36 AM",
        createdAt: "12/04/2024 11:15:48",
        dateStamp: 1733250600,
        createTime: "2024-12-04T05:45:48.440Z",
        updatedTime: "2024-12-04T06:11:47.854Z",
      },
      {
        isPaymentDone: false,
        _id: "674fed10c169043ce44bc558",
        userId: "674fdefbc169043ce44a9108",
        providerId: "668d41bc211a65d88600f65f",
        gameTypeId: "6690701918732c8c3c427b09",
        providerName: "SRIDEVI",
        gameTypeName: "Single Digit",
        gameTypePrice: 10,
        userName: "hemasingh",
        mobileNumber: "+918225832474",
        bidDigit: "1",
        biddingPoints: 100,
        gameSession: "Open",
        winStatus: 2,
        gameWinPoints: 0,
        gameDate: "12/04/2024",
        updatedAt: "12/04/2024 11:41:36 AM",
        createdAt: "12/04/2024 11:17:58",
        dateStamp: 1733250600,
        createTime: "2024-12-04T05:48:00.425Z",
        updatedTime: "2024-12-04T06:11:47.854Z",
      },
      {
        isPaymentDone: false,
        _id: "674fc74fc169043ce44985c9",
        userId: "6729537578467eabf75102eb",
        providerId: "668d41bc211a65d88600f65f",
        gameTypeId: "6690701918732c8c3c427b09",
        providerName: "SRIDEVI",
        gameTypeName: "Single Digit",
        gameTypePrice: 10,
        userName: "kavita",
        mobileNumber: "+918770959824",
        bidDigit: "1",
        biddingPoints: 8,
        gameSession: "Open",
        winStatus: 2,
        gameWinPoints: 0,
        gameDate: "12/04/2024",
        updatedAt: "12/04/2024 11:41:36 AM",
        createdAt: "12/04/2024 08:36:54",
        dateStamp: 1733250600,
        createTime: "2024-12-04T03:06:55.058Z",
        updatedTime: "2024-12-04T06:11:47.854Z",
      },
      {
        isPaymentDone: false,
        _id: "674fd10cc169043ce449ce4b",
        userId: "66e8185fdac5e59a8286638e",
        providerId: "668d41bc211a65d88600f65f",
        gameTypeId: "6690701918732c8c3c427b09",
        providerName: "SRIDEVI",
        gameTypeName: "Single Digit",
        gameTypePrice: 10,
        userName: "nayabrao",
        mobileNumber: "+919834110962",
        bidDigit: "1",
        biddingPoints: 50,
        gameSession: "Open",
        winStatus: 2,
        gameWinPoints: 0,
        gameDate: "12/04/2024",
        updatedAt: "12/04/2024 11:41:36 AM",
        createdAt: "12/04/2024 09:18:27",
        dateStamp: 1733250600,
        createTime: "2024-12-04T03:48:28.520Z",
        updatedTime: "2024-12-04T06:11:47.854Z",
      },
      {
        isPaymentDone: false,
        _id: "674fd63bc169043ce44a0c55",
        userId: "66df28e35d7410e478cda42b",
        providerId: "668d41bc211a65d88600f65f",
        gameTypeId: "6690701918732c8c3c427b09",
        providerName: "SRIDEVI",
        gameTypeName: "Single Digit",
        gameTypePrice: 10,
        userName: "kundanbhili81",
        mobileNumber: "+917030376074",
        bidDigit: "1",
        biddingPoints: 100,
        gameSession: "Open",
        winStatus: 2,
        gameWinPoints: 0,
        gameDate: "12/04/2024",
        updatedAt: "12/04/2024 11:41:36 AM",
        createdAt: "12/04/2024 09:41:19",
        dateStamp: 1733250600,
        createTime: "2024-12-04T04:10:35.353Z",
        updatedTime: "2024-12-04T06:11:47.854Z",
      },
      {
        isPaymentDone: false,
        _id: "674fd86bc169043ce44a24fd",
        userId: "6720748278467eabf7de535b",
        providerId: "668d41bc211a65d88600f65f",
        gameTypeId: "6690701918732c8c3c427b09",
        providerName: "SRIDEVI",
        gameTypeName: "Single Digit",
        gameTypePrice: 10,
        userName: "deepakkharade",
        mobileNumber: "+918767192311",
        bidDigit: "1",
        biddingPoints: 5,
        gameSession: "Open",
        winStatus: 2,
        gameWinPoints: 0,
        gameDate: "12/04/2024",
        updatedAt: "12/04/2024 11:41:36 AM",
        createdAt: "12/04/2024 09:49:54",
        dateStamp: 1733250600,
        createTime: "2024-12-04T04:19:55.291Z",
        updatedTime: "2024-12-04T06:11:47.854Z",
      },
      {
        isPaymentDone: false,
        _id: "674fddd3c169043ce44a7e49",
        userId: "6720785278467eabf7df8db1",
        providerId: "668d41bc211a65d88600f65f",
        gameTypeId: "6690701918732c8c3c427b09",
        providerName: "SRIDEVI",
        gameTypeName: "Single Digit",
        gameTypePrice: 10,
        userName: "akashbhil2290@gmail.comn",
        mobileNumber: "+918956648089",
        bidDigit: "1",
        biddingPoints: 1000,
        gameSession: "Open",
        winStatus: 2,
        gameWinPoints: 0,
        gameDate: "12/04/2024",
        updatedAt: "12/04/2024 11:41:36 AM",
        createdAt: "12/04/2024 10:12:57",
        dateStamp: 1733250600,
        createTime: "2024-12-04T04:42:59.227Z",
        updatedTime: "2024-12-04T06:11:47.854Z",
      },
      {
        isPaymentDone: false,
        _id: "674fdf2dc169043ce44a9615",
        userId: "674977b755453dc08db43910",
        providerId: "668d41bc211a65d88600f65f",
        gameTypeId: "6690701918732c8c3c427b09",
        providerName: "SRIDEVI",
        gameTypeName: "Single Digit",
        gameTypePrice: 10,
        userName: "manojb",
        mobileNumber: "+917558279729",
        bidDigit: "1",
        biddingPoints: 40,
        gameSession: "Open",
        winStatus: 2,
        gameWinPoints: 0,
        gameDate: "12/04/2024",
        updatedAt: "12/04/2024 11:41:36 AM",
        createdAt: "12/04/2024 10:18:44",
        dateStamp: 1733250600,
        createTime: "2024-12-04T04:48:45.497Z",
        updatedTime: "2024-12-04T06:11:47.854Z",
      },
      {
        isPaymentDone: false,
        _id: "674fdf8ac169043ce44a9cd4",
        userId: "6717646889a0170929e1e00f",
        providerId: "668d41bc211a65d88600f65f",
        gameTypeId: "6690701918732c8c3c427b09",
        providerName: "SRIDEVI",
        gameTypeName: "Single Digit",
        gameTypePrice: 10,
        userName: "ved,kumar",
        mobileNumber: "+919926043264",
        bidDigit: "1",
        biddingPoints: 100,
        gameSession: "Open",
        winStatus: 2,
        gameWinPoints: 0,
        gameDate: "12/04/2024",
        updatedAt: "12/04/2024 11:41:36 AM",
        createdAt: "12/04/2024 10:20:19",
        dateStamp: 1733250600,
        createTime: "2024-12-04T04:50:18.495Z",
        updatedTime: "2024-12-04T06:11:47.854Z",
      },
      {
        isPaymentDone: false,
        _id: "674fdf08c169043ce44a922c",
        userId: "66d7e2fdf700aa4f56e4057c",
        providerId: "668d41bc211a65d88600f65f",
        gameTypeId: "6690701918732c8c3c427b09",
        providerName: "SRIDEVI",
        gameTypeName: "Single Digit",
        gameTypePrice: 10,
        userName: "abstyle",
        mobileNumber: "+916353772656",
        bidDigit: "1",
        biddingPoints: 10,
        gameSession: "Open",
        winStatus: 2,
        gameWinPoints: 0,
        gameDate: "12/04/2024",
        updatedAt: "12/04/2024 11:41:36 AM",
        createdAt: "12/04/2024 10:18:07",
        dateStamp: 1733250600,
        createTime: "2024-12-04T04:48:08.033Z",
        updatedTime: "2024-12-04T06:11:47.854Z",
      },
    ];

    setShowBidInfoList(response);
  };

  const cardLayouts = [
    {
      size: 7,
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
      size: 5,
      body: (
        <div>
          <div className="table-responsive ">
            <table className="table  ">
              <thead className="primary-color">
                <tr>
                  <th>Type</th>
                  <th>Bids</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody id="groupData">
                {TableOne.originalData &&
                  TableOne.originalData.map((item) => {
                    return (
                      <>
                        <tr>
                          <td className="fw-bold">
                            {item.gameTypeName || item.gameType}
                          </td>
                          <td>{item.countBid || item.totalBids}</td>
                          <td>{item.sumdigit || item.totalSumDigit}</td>
                        </tr>
                      </>
                    );
                  })}
              </tbody>
              <tfoot className="primary-color">
                <tr>
                  <th>Grand Total</th>
                  <th>{TableOne.totals && TableOne.totals.totalBids}</th>
                  <th>{TableOne.totals && TableOne.totals.totalSumDigit}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ),
    },
    {
      size: 12,
      body: (
        <div>
          <PagesIndex.TableWithCustomPeginationNew
            data={TableTwo && TableTwo}
            initialRowsPerPage={10}
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
    {
      size: 12,
      // visiblity:
      //   formik.values.gameSession === "Open" ||
      //   formik.values.gameSession === "Close",

      body:
        formik.values.gameSession === "Open" ||
        formik.values.gameSession === "Close" ? (
          <div>
            <PagesIndex.TableWithCustomPeginationNew
              data={(TableThree && TableThree) || []}
              initialRowsPerPage={10}
              SearchInTable={SearchInTable}
              visibleFields={visibleFields1}
            />
          </div>
        ) : null,
    },
  ];

  return (
    <div>
      <Split_Main_Containt
        title="Cutting Group"
        add_button={false}
        btnTitle="Add"
        route="/add"
        cardLayouts={cardLayouts}
      />

      <ReusableModal
        show={ShowBidInfoModal}
        onClose={setShowBidInfoModal}
        title={"Bid History"}
        size={"lg"}
        body={
          <>
            <PagesIndex.TableWithCustomPeginationNew
              data={(ShowBidInfoList && ShowBidInfoList) || []}
              initialRowsPerPage={10}
              SearchInTable={SearchInTable}
              visibleFields={visibleFields2}
              showIndex={true}
            />
          </>
        }
        primaryButtonText="Save Changes"
        secondaryButtonText="Close"
        showFooter={false}
      />
    </div>
  );
};

export default SplitForm;
