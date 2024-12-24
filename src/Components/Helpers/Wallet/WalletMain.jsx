import React, { useMemo } from "react";
import PagesIndex from "../../Pages/PagesIndex";
import ReusableModal from "../Modal/ReusableModal";

const WalletMain = ({
  title,
  TableData,
  fields,
  formik,
  UserFullButtonList,
  visibleFields,
  setSearchInTable,
  SearchInTable,
  setModalState,
  ModalState,
  handleBtnStatus,
  btnStatus,
  todayReportData,
  UserFullButtonList1,
  visibleFields1,
  formik1,
  fields1,
  confirmPayment,
}) => {
  const totalAmount = useMemo(
    () => TableData.reduce((acc, item) => acc + (item?.reqAmount || 0), 0),
    [TableData]
  );
  const cardLayouts = [
    {
      size: 12,
      body: (
        <div>
          <PagesIndex.Formikform
            fieldtype={fields?.filter((field) => !field.showWhen)}
            formik={formik}
            btn_name={"Get Report"}
            button_Size={"w-15"}
            show_submit={true}
            after_submit_button1={
              // <div className="report-btn-main mt-3">
              <button
                onClick={() => handleBtnStatus("see-report")}
                className="approve-btn"
              >
                See Report
              </button>
              // </div>
            }
          />
          {/* <div className="report-btn-main mt-3"> */}

          {/* </div> */}
        </div>
      ),
    },

    {
      size: 12,
      body: (
        <>
          <button
            onClick={() => handleBtnStatus("approve-all")}
            className="approve-btn"
          >
            Approve All
          </button>

          <PagesIndex.TableWithCustomPeginationNew123
            data={TableData}
            initialRowsPerPage={10}
            SearchInTable={""}
            visibleFields={visibleFields}
            showIndex={true}
          />
          <h3 className="ml-3 mb-3 fw-bold responsive-total-amount">Total Amount {totalAmount}/-</h3>
        </>
      ),
    },
  ];
  return (
    <>
      <PagesIndex.Split_Main_Containt
        title={title}
        add_button={false}
        cardLayouts={cardLayouts}
      />
      <ReusableModal
        ModalTitle={
          btnStatus === "see-report"
            ? "Today Approved Report"
            : btnStatus === "approve-all"
            ? "Approve All"
            : btnStatus === "decline-report"
            ? "Decline User Request"
            : ""
        }
        ModalState={ModalState}
        setModalState={setModalState}
        ModalBody={
          <>
            {btnStatus === "approve-all" ? (
              <div className="">
                <h1 className="confirm-payment-text">
                  Are You Sure Want To Confirm Payment?
                </h1>
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-dark  mx-2"
                    onClick={() => confirmPayment()}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setModalState(false)}
                    className="btn btn-dark  mx-2"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : btnStatus === "see-report" ? (
              <PagesIndex.TableWithCustomPeginationNew123
                data={todayReportData}
                initialRowsPerPage={10}
                SearchInTable={""}
                visibleFields={visibleFields1}
                showIndex={true}
              />
            ) : // <PagesIndex.TableWitCustomPegination
            //   data={todayReportData}
            //   UserFullButtonList={UserFullButtonList1}
            //   initialRowsPerPage={5}
            //   SearchInTable={SearchInTable}
            //   visibleFields={visibleFields1}
            //   searchInput={
            //     <input
            //       type="text"
            //       placeholder="Search..."
            //       value={SearchInTable}
            //       onChange={(e) => setSearchInTable(e.target.value)}
            //       className="form-control ms-auto"
            //     />
            //   }
            // />
            btnStatus === "decline-report" ? (
              <PagesIndex.Formikform
                fieldtype={fields1.filter((field) => !field.showWhen)}
                formik={formik1}
                btn_name={"Submit"}
                button_Size={"w-15"}
                show_submit={true}
              />
            ) : (
              ""
            )}
          </>
        }
      />
    </>
  );
};

export default WalletMain;
