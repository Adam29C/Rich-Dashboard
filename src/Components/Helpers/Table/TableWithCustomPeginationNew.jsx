import React, { useState, useEffect } from "react";

const CustomTable = ({
  fetchData,
  columns,
  showIndex,
  Refresh,
  setUserPagenateData = () => {},
  TotalPagesCount,
  tableData,
  show_additional,
  additional,
}) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [TotalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [isResponsive, setIsResponsive] = useState(window.innerWidth < 768);
  const [Refresh1, setRefresh1] = useState(false);


  console.log("isResponsive", isResponsive);
  console.log("window.innerWidth", window.innerWidth);

  const fetchTableData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchData(page, rowsPerPage);
      setRefresh1(!Refresh1);
      setData(result.mainRes || []);
      setFilteredData(result.mainRes || []);
      setTotalPages(result.totalRows);
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [Refresh, page, rowsPerPage]);

  let abc = () => {
    if (tableData && tableData != undefined) {
      setData(tableData && tableData);
      setUserPagenateData((prev) => ({
        ...prev,
        pageno: page,
        limit: rowsPerPage,
      }));
      setLoading(false);
      setError(null);
      setTotalPages(TotalPagesCount);
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    abc();
  }, [tableData, page, rowsPerPage]);

  // const handleFetchData = () => {};

  // useEffect(() => {
  //   handleFetchData();
  // }, []);

  const sordata = () => {
    let sortedData = [...data];

    // Apply sorting
    if (sortConfig.key) {
      sortedData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    // Apply search filtering
    const searchResults = sortedData.filter((row) =>
      columns.some(
        (field) =>
          !field.isButton &&
          row[field.value]
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    );

    setFilteredData(searchResults);
  };
  useEffect(() => {
    sordata();
  }, [data, sortConfig, searchQuery]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const totalPages = Math.ceil(TotalPages && TotalPages / rowsPerPage);

  const renderButton = (field, row) => {
    const buttonText =
      typeof field.value === "function" ? field.value(row) : field.value;

    return (
      <button
        key={field.name}
        // className={`btn btn-${field.buttonColor} btn-sm`}
        onClick={() => field.Conditions(row)}
        className={`btn ${
          typeof field.buttonColor === "function"
            ? `btn-${field.buttonColor(row)} ${field.className}`
            : field.buttonColor
            ? `btn-${field.buttonColor} ${field.className}`
            : `unblock-btn ${field.className}`
        } btn-sm me-2 ${field.className}`}
      >
        {buttonText}
      </button>
    );
  };

  const handleResize = () => {
    setIsResponsive(window.innerWidth < 768);
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth]);

  return (
    <div className="container">
      <div className="row d-flex">
        <div className=" align-items-center col-md-4">
          <label htmlFor="rowsPerPage" className="form-label me-2">
            Show:
          </label>
          <select
            id="rowsPerPage"
            className="form-select w-auto"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            {[5, 10, 25, 50].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className=" ms-auto col-md-3">
          <label htmlFor="rowsPerPage" className="form-label me-2">
            Search
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
        </div>
      </div>
      {/* {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : ( */}
      <table
        id="myTable"
        className={`table table-striped table-bordered custom-table-container ${
          isResponsive ? "table-responsive" : ""
        }`}
      >
        <thead className="primary-color text-center table-header-backeground">
          <tr>
            {showIndex && <th>#</th>}
            {columns?.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.value)}
                style={{ cursor: col.sortable ? "pointer" : "default" }}
              >
                {col.name}
                {sortConfig.key === col.value && (
                  <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredData &&
            filteredData.map((row, index) => (
              <tr key={index}>
                {showIndex && <td>{(page - 1) * rowsPerPage + index + 1}</td>}
                {columns.map((field) => (
                  <td
                    className={` ${field.className}`}
                    key={field.value}
                    style={field.style ? field.style(row) : {}}
                    onClick={() => {
                      if (field.onClick) {
                        field.onClick(row);
                      }
                    }}
                  >
                    {field.render
                      ? field.render(row)
                      : field.transform
                      ? field.transform(row[field.value], row)
                      : field.isButton
                      ? renderButton(field, row)
                      : row[field.value]}
                  </td>
                ))}
              </tr>
            ))}
          {!show_additional && (
            <tr>
              <td colSpan={columns.length + 1}>{additional}</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* )} */}

      <nav>
        <ul className="pagination justify-content-end">
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              First
            </button>
          </li>
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
          </li>
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </li>
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              Last
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default CustomTable;
