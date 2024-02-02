import React, { useState } from "react";

const Problem1 = () => {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState({ name: "", status: "" });
  const [show, setShow] = useState("all");
  const handleInputChange = (field, value) => {
    setTodo({
      ...todo,
      [field]: value,
    });
  };
  const handleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setTodos((prevItems) => [...prevItems, todo]);
    setTodo({ name: "", status: "" });
  };
  const handleClick = (val) => {
    setShow(val);
  };
  let filteredItems = todos;

  if (show === "active") {
    filteredItems = todos.filter(
      (item) => item.status.toLowerCase() === "active"
    );
  } else if (show === "completed") {
    filteredItems = todos.filter(
      (item) => item.status.toLowerCase() === "completed"
    );
  }

  filteredItems.sort((a, b) => {
    const statusA = a.status.toLowerCase();
    const statusB = b.status.toLowerCase();

    if (statusA === "active") {
      return -1;
    } else if (statusB === "active") {
      return 1;
    } else if (statusA === "completed") {
      return -1;
    } else if (statusB === "completed") {
      return 1;
    } else {
      return 0;
    }
  });
  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-1</h4>
        <div className="col-6 ">
          <form
            onSubmit={handleSubmit}
            className="row gy-2 gx-3 align-items-center mb-4"
          >
            <div className="col-auto">
              <input
                type="text"
                name="name"
                value={todo.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onKeyDown={handleKey}
                className="form-control"
                placeholder="Name"
              />
            </div>
            <div className="col-auto">
              <input
                type="text"
                status="status"
                value={todo.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                onKeyDown={handleKey}
                className="form-control"
                placeholder="Status"
              />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="col-8">
          <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link ${show === "all" && "active"}`}
                type="button"
                onClick={() => handleClick("all")}
              >
                All
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${show === "active" && "active"}`}
                type="button"
                onClick={() => handleClick("active")}
              >
                Active
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${show === "completed" && "active"}`}
                type="button"
                onClick={() => handleClick("completed")}
              >
                Completed
              </button>
            </li>
          </ul>
          <div className="tab-content"></div>
          <table className="table table-striped ">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length ? (
                filteredItems.map((item, index) => (
                  <tr key={index}>
                    <td scope="col">{item.name}</td>
                    <td scope="col">{item.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">todos not found!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Problem1;
