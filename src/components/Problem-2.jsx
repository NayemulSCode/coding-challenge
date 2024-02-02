import axios from "axios";
import React, { useEffect, useState } from "react";

const Problem2 = () => {
  const [modalOpenA, setModalOpenA] = useState(false);
  const [modalOpenB, setModalOpenB] = useState(false);
  const [modalOpenC, setModalOpenC] = useState(false);
  const [contactsA, setContactsA] = useState([]);
  const [contactsB, setContactsB] = useState([]);
  const [searchTermA, setSearchTermA] = useState("");
  const [searchTermB, setSearchTermB] = useState("");
  const [onlyEven, setOnlyEven] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // initial list based on modal state
  useEffect(() => {
    fetchContactList();
  }, [modalOpenA, modalOpenB]);
  // search debounce
  useEffect(() => {
    let delayDebounceFn;
    if (searchTermA !== "" || searchTermB !== "") {
      delayDebounceFn = setTimeout(() => {
        fetchContactList();
        setPage(1);
      }, 2000);
    } else {
      fetchContactList();
      setPage(page);
    }
    return () => clearTimeout(delayDebounceFn);
  }, [searchTermA, searchTermB, page]);
  // filter only event id's
  useEffect(() => {
    if (onlyEven && modalOpenA) {
      setContactsA(contactsA.filter((contact) => contact.id % 2 === 0));
    }
    if (onlyEven && modalOpenB) {
      setContactsB(contactsB.filter((contact) => contact.id % 2 === 0));
    }
  }, [onlyEven]);
  // search handler
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTermA(value);
    setSearchTermB(value);
  };
  // press enter and immediatly search
  const handleSearchAKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchContactList();
    }
  };
  // auto scroller
  const handleInfiniteScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    if (scrollHeight - scrollTop === clientHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  // fetch function
  const fetchContactList = async () => {
    try {
      setIsLoading(true);
      let response;
      if (modalOpenA) {
        response = await axios.get(
          `https://contact.mediusware.com/api/contacts/?page=${page}&search=${searchTermA}`
        );
        let filteredContacts = response?.data?.results;
        if (onlyEven) {
          filteredContacts = filteredContacts.filter(
            (contact) => contact.id % 2 === 0
          );
        }
        if (page === 1) {
          setContactsA(filteredContacts);
        } else {
          setContactsA((prevContacts) => [
            ...prevContacts,
            ...filteredContacts,
          ]);
        }
      }
      if (modalOpenB) {
        response = await axios.get(
          `https://contact.mediusware.com/api/country-contacts/United States/?page=${page}&search=${searchTermB}`
        );
        let filteredContacts = response?.data?.results;
        if (onlyEven) {
          filteredContacts = filteredContacts.filter(
            (contact) => contact.id % 2 === 0
          );
        }
        if (page === 1) {
          setContactsB(filteredContacts);
        } else {
          setContactsB((prevContacts) => [
            ...prevContacts,
            ...filteredContacts,
          ]);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  // Modal A related state handler
  const openModalA = () => {
    setModalOpenA(true);
    setModalOpenB(false);
    setModalOpenC(false);
    setSearchTermA("");
    setSearchTermB("");
    setPage(1);
    setContactsB([]);
    setContactsA([]);
  };
  // Modal B related state handler
  const openModalB = () => {
    setModalOpenA(false);
    setModalOpenB(true);
    setModalOpenC(false);
    setSearchTermA("");
    setSearchTermB("");
    setPage(1);
    setContactsB([]);
    setContactsA([]);
  };
  // Modal C related state handler
  const openModalC = (contact) => {
    setSelectedContact(contact);
    setModalOpenC(true);
    setSearchTermA("");
    setSearchTermB("");
    setContactsB([]);
    setContactsA([]);
  };

  const closeModal = () => {
    setModalOpenA(false);
    setModalOpenB(false);
    setModalOpenC(false);
    setSearchTermA("");
    setSearchTermB("");
    setContactsB([]);
    setContactsA([]);
    setOnlyEven(false);
  };

  const handleCheckboxChange = (e) => {
    setOnlyEven(e.target.checked);
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-2</h4>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-lg btn-a"
            type="button"
            onClick={openModalA}
          >
            All Contacts
          </button>
          <button
            className="btn btn-lg btn-b"
            type="button"
            onClick={openModalB}
          >
            US Contacts
          </button>
        </div>
        {/* Modal A */}
        <div
          className={`modal ${modalOpenA ? "show" : ""}`}
          style={{ display: modalOpenA ? "block" : "none" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modal A</h5>
                <button
                  type="button"
                  className="btn-close btn-c"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* search input */}
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Search contacts"
                  value={searchTermA}
                  onChange={handleSearch}
                  onKeyDown={handleSearchAKeyPress}
                />
                {/* Contact list */}
                <div
                  onScroll={handleInfiniteScroll}
                  className="contact-list"
                  style={{ maxHeight: "350px", overflowY: "auto" }}
                >
                  {!!contactsA?.length ? (
                    contactsA.map((contact, index) => (
                      <div
                        style={{ cursor: "pointer" }}
                        key={index}
                        className="contact-item"
                        onClick={() => openModalC(contact)}
                      >
                        {contact.phone}
                      </div>
                    ))
                  ) : (
                    <div>Contacts not found!</div>
                  )}
                </div>
                {isLoading && <div>Loading more contacts...</div>}
              </div>
              <div className="modal-footer">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="onlyEvenCheckbox"
                    checked={onlyEven}
                    onChange={handleCheckboxChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="onlyEvenCheckbox"
                  >
                    Only Even
                  </label>
                </div>
                <button
                  type="button"
                  className="btn btn-a"
                  onClick={openModalA}
                >
                  All Contacts
                </button>
                <button
                  type="button"
                  className="btn btn-b"
                  onClick={openModalB}
                >
                  US Contacts
                </button>
                <button
                  type="button"
                  className="btn btn-c"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal B */}
        <div
          className={`modal ${modalOpenB ? "show" : ""}`}
          style={{ display: modalOpenB ? "block" : "none" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modal B</h5>
                <button
                  type="button"
                  className="btn-close btn-c"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* search input */}
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Search contacts"
                  value={searchTermB}
                  onChange={handleSearch}
                  onKeyDown={handleSearchAKeyPress}
                />
                {/* Contact list*/}
                <div
                  onScroll={handleInfiniteScroll}
                  className="contact-list"
                  style={{ maxHeight: "350px", overflowY: "auto" }}
                >
                  {!!contactsB?.length ? (
                    contactsB.map((contact, index) => (
                      <div
                        style={{ cursor: "pointer" }}
                        key={index}
                        className="contact-item"
                        onClick={() => openModalC(contact)}
                      >
                        {contact.phone}
                      </div>
                    ))
                  ) : (
                    <div>Contacts not found!</div>
                  )}
                </div>
                {isLoading && <div>Loading more contacts...</div>}
              </div>
              <div className="modal-footer">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="onlyEvenCheckbox"
                    checked={onlyEven}
                    onChange={handleCheckboxChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="onlyEvenCheckbox"
                  >
                    Only Even
                  </label>
                </div>
                <button
                  type="button"
                  className="btn btn-a"
                  onClick={openModalA}
                >
                  All Contacts
                </button>
                <button
                  type="button"
                  className="btn btn-b"
                  onClick={openModalB}
                >
                  US Contacts
                </button>
                <button
                  type="button"
                  className="btn btn-c"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal C */}
        <div
          className={`modal ${modalOpenC ? "show" : ""}`}
          style={{ display: modalOpenC ? "block" : "none" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Contact Details</h5>
                <button
                  type="button"
                  className="btn-close btn-c"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <h6>Contact Details</h6>
                {selectedContact && (
                  <div>
                    <p>id: {selectedContact.id}</p>
                    <p>Phone: {selectedContact.phone}</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-c"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem2;
