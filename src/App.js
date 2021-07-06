import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Pagination from "react-js-pagination";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const API_URL = "http://localhost:4000/api";

function App() {
  const { handleSubmit, register, reset } = useForm();
  const [alarms, setAlarms] = useState([]);
  const [apiKey, setApiKey] = useState([]);
  const [nextPage, setNextPage] = useState(2);
  const [activePage, setActivePage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchParams, setSearchParams] = useState(null);
  const [limit, setLimit] = useState(25);

  const getApiKey = () => {
    fetch(`${API_URL}/api-key`).then((res) =>
      res.json().then((res) => setApiKey(res.key))
    );
  };

  const handlePageChange = () => {
    const values = Object.fromEntries(
      new Map(Object.entries(searchParams).filter((entry) => entry[1]))
    );

    fetch(
      `${API_URL}/alarms?from=${values.from}&to=${values.to}&limit=${values.limit}&key=${values.key}&outcome=${values.outcome}&page=${nextPage}`
    ).then((res) =>
      res.json().then((res) => {
        if (res.data) {
          setAlarms(res.data);
          setNextPage(res.nextPage);
          setActivePage(res.nextPage - 1);
        }
        if (res.info) {
          alert(res.info.message);
        }
      })
    );
  };

  const formSubmit = (v) => {
    // console.log(v);
    const values = Object.fromEntries(
      new Map(Object.entries(v).filter((entry) => entry[1]))
    );

    setSearchParams(values);
    values.limit && setLimit(values.limit);

    fetch(
      `${API_URL}/alarms?from=${values.from}&to=${values.to}&limit=${values.limit}&key=${values.key}&outcome=${values.outcome}`
    )
      .then((res) =>
        res.json().then((res) => {
          console.log(res);
          if (res.data) {
            setAlarms(res.data);
            setNextPage(res.nextPage);
          }
          if (res.info) {
            alert(res.info.message);
          }
        })
      )
      .finally(() => reset());
  };

  useEffect(() => {
    fetch(`${API_URL}/alarms/total-count`).then((res) =>
      res.json().then((res) => {
        if (res.count) {
          setTotalItems(res.count);
        }
        if (res.info) {
          alert(res.info.message);
        }
      })
    );
  }, []);

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <p>Get API Key:</p>
        {apiKey && <p>{apiKey}</p>}
        <button onClick={getApiKey}>Get</button>
      </div>
      <form onSubmit={handleSubmit(formSubmit)}>
        <label htmlFor="key">API key</label>
        <input type="text" id="key" name="key" {...register("key")} />
        <label htmlFor="from">From:</label>
        <input type="date" id="from" after="from" {...register("from")} />
        <label htmlFor="to">To:</label>
        <input type="date" id="to" name="to" {...register("to")} />
        <label htmlFor="outcome">Outcome</label>
        <select id="outcome" {...register("outcome")}>
          <option value="">Outcome</option>
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
        <label htmlFor="limit">Items per page</label>
        <select id="limit" {...register("limit")}>
          <option value={25} defaultValue>
            25
          </option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <input type="submit" value="Get data" />
      </form>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {alarms &&
          alarms.map((alarm, i) => (
            <div
              key={i}
              className="alarm"
              style={{
                display: "flex",
                width: "120%",
                justifyContent: "space-between",
              }}
            >
              <p>{alarm.location}</p>
              <p>{alarm.timestamp}</p>
              <p>{alarm.outcome.toString()}</p>
            </div>
          ))}
      </div>
      <div>
        <Pagination
          activePage={activePage}
          itemsCountPerPage={limit}
          totalItemsCount={totalItems}
          pageRangeDisplayed={10}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
        />
      </div>
    </div>
  );
}

export default App;
