import "./App.css";
import { useCallback, useEffect, useState } from "react";

import BasicModal from "./components/BasicModel";
import Button from "@mui/material/Button";
import StickyHeadTable from "./components/StickyHeadTable";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageNotFound, setPageNotFound] = useState(false);
  const [entryUpdate, setEntryUpdate] = useState(false);

  const fetchData = useCallback(
    async function fetchData() {
      console.log("useCallback is called---------------->", page);
      try {
        const res = await fetch(
          `http://localhost:8000/api?limit=${limit}&page=${page}`
        );
        const data = await res.json();

        if (data.status === "fail") {
          setPageNotFound(true);
          return;
        }
        setEntries(data.data.data);
        setPageNotFound(false);
      } catch (error) {
        console.log(error);
      }
    },
    [page, limit, entryUpdate]
  );

  const handleDeleteApp = useCallback(async (id) => {
    const res = await fetch(`http://localhost:8000/api/${id}`, {
      method: "DELETE",
    });

    setEntryUpdate(!entryUpdate);
  }, []);

  useEffect(() => {
    console.log(
      "useeffect called-------------------->",
      page,
      limit,
      entryUpdate
    );
    fetchData();
  }, [page, limit, fetchData, handleDeleteApp, entryUpdate]);

  return (
    <div>
      <BasicModal
        handleClose={handleModalClose}
        open={openModal}
        setOpen={setOpenModal}
        entryUpdate={entryUpdate}
        setEntryUpdate={setEntryUpdate}
      />
      <Button
        className="green-button"
        onClick={handleModalOpen}
        style={{
          backgroundColor: "green",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: "pointer",
          width: "15%",

          marginLeft: "40%",
          marginTop: "8%",
        }}
      >
        Add Data
      </Button>

      <StickyHeadTable
        entries={entries}
        setPage={setPage}
        page={page}
        pageNotFound={pageNotFound}
        limit={limit}
        setLimit={setLimit}
        handleDeleteApp={handleDeleteApp}
        handleModalOpen={handleModalOpen}
      />

      {/* {pageNotFound && alert("page not found")} */}
    </div>
  );
}

export default App;
