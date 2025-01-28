import React, { useContext, useState, useEffect } from "react";
import MainFooter from "./MainFooter";
import { Button, Nav, Form, Table, Row, Col } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import userimg from "../assets/images/dummy-user.png";
import API from "../api";

const UserDashboard = () => {
  const { logout } = useContext(AuthContext);
  const userType = localStorage.getItem("type");

  const [selectedTab, setSelectedTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    u_id: "", // Initialize with u_id
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [message, setMessage] = useState("");

  const handleLogout = () => {
    logout();
  };

  // Fetch data based on the selected tab
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       // Assuming your API route expects a `u_id` to fetch user data;
  //       const endPoint = userType === "agent" ? "/auth/agent/agent-data" : "/auth/user/user-data"
  //       const response = await API.post(endPoint); // Fetch based on u_id
  //       setProfileData(response.data);
  //       console.log(response)
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   const fetchPaymentHistory = async () => {
  //     try {
  //       const response = await API.get("/payments/payment");
  //       setPaymentHistory(Array.isArray(response.data) ? response.data : []);
  //     } catch (error) {
  //       console.error("Error fetching payment history:", error);
  //       setPaymentHistory([]);
  //     }
  //   };

  //   if (selectedTab === "profile") fetchUserData();
  //   if (selectedTab === "upcomingBookings") fetchUpcomingBookings();
  //   if (selectedTab === "pastBookings") fetchPastBookings();
  //   if (selectedTab === "paymentHistory") fetchPaymentHistory();
  //   fetchPaymentHistory();
  // }, [selectedTab, profileData.u_id]); // Add profileData.u_id as a dependency to trigger on change

  // const fetchUpcomingBookings = async () => {
  //   try {
  //     const response = await API.get("/bookings/booking-details");
  //     setUpcomingBookings(response.data);
  //   } catch (error) {
  //     console.error("Error fetching upcoming bookings:", error);
  //   }
  // };

  // const fetchPastBookings = async () => {
  //   try {
  //     const response = await API.get("/bookings/booking-details");
  //     setPastBookings(response.data);
  //   } catch (error) {
  //     console.error("Error fetching past bookings:", error);
  //   }
  // };

  useEffect(() => {
    if (selectedTab === "profile") fetchUserData();
    if (selectedTab === "upcomingBookings") fetchUpcomingBookings();
    if (selectedTab === "pastBookings") fetchPastBookings();
    if (selectedTab === "paymentHistory") fetchPaymentHistory();
    fetchPaymentHistory();
  }, [selectedTab, profileData.u_id]); // Add profileData.u_id as a dependency to trigger on change

  const fetchBookings = async () => {
    try {
      const response = await API.get("/bookings/booking-details");
      const bookings = response.data;

      // Filter bookings into upcoming and past based on status
      const upcoming = bookings.filter((booking) => booking.status === "pending");
      const past = bookings.filter((booking) => booking.status !== "pending");

      setUpcomingBookings(upcoming);
      setPastBookings(past);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await API.get("/payments/payment");
      setPaymentHistory(Array.isArray(response.data.payments) ? response.data.payments : []);
      console.log("respnse.data checking", response.data.payments)
    } catch (error) {
      console.error("Error fetching payment history:", error);
      setPaymentHistory([]);
    }
  };

  const fetchUpcomingBookings = async () => {
    try {
      const response = await API.get("/bookings/booking-details");
      const upcoming = response.data.filter((booking) => booking.status === "pending");
      setUpcomingBookings(upcoming);
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error);
    }
  };

  const fetchPastBookings = async () => {
    try {
      const response = await API.get("/bookings/booking-details");
      const past = response.data.filter((booking) => booking.status !== "pending");
      setPastBookings(past);
    } catch (error) {
      console.error("Error fetching past bookings:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      // Assuming your API route expects a `u_id` to fetch user data;
      const endPoint = userType === "agent" ? "/auth/agent/agent-data" : "/auth/user/user-data"
      const response = await API.post(endPoint); // Fetch based on u_id
      setProfileData(response.data);
      console.log(response)
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };


  const handleProfileUpdate = (e) => {
    e.preventDefault();

    // API request to update profile
    const endpoint = userType === "agent" ? "/agents/agent" : "/users/user";
    API.put(endpoint, profileData)
      .then(() => {
        setMessage("Profile updated successfully!");
      })
      .catch((error) => {
        setMessage("Error updating profile. Please try again.");
        console.error("Error updating profile:", error);
      });
  };

  const tabContent = {
    profile: (
      <Form onSubmit={handleProfileUpdate}>
        <span
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            display: "block",
            color: "#806a50",
          }}
        >
          {userType === "agent" ? "Agent Profile" : "User Profile"}
        </span>

        <Row className="mb-3">
          <Col md={6}>
            <Row className="mb-2">
              <Col>
                <Form.Group
                  controlId="formUId"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <Form.Label
                    style={{
                      width: "50%",
                      alignContent: "start",
                      justifyContent: "start",
                    }}
                  >
                    User ID:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.u_id}
                    readOnly
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <Form.Group
                  controlId="formName"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <Form.Label style={{ width: "50%", alignContent: "end" }}>
                    Name:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.name}
                    placeholder="Enter Your Name"
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <Form.Group
                  controlId="formPhone"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <Form.Label style={{ width: "50%", alignContent: "end" }}>
                    Phone:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    readOnly
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <Form.Group
                  controlId="formAddress"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <Form.Label style={{ width: "50%", alignContent: "end" }}>
                    Address:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.address}
                    placeholder="Ener Your Address"
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col>
                <Form.Group
                  controlId="formEmail"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <Form.Label
                    style={{ width: "50%", alignContent: "flex-end" }}
                  >
                    Email:
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={profileData.email}
                    placeholder="Enter Your Email"
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>

          <Col md={6}>
            <Row className="mb-2">
              <Col>
                <Form.Group
                  controlId="formCity"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <Form.Label style={{ width: "50%", alignContent: "end" }}>
                    City:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.city}
                    placeholder="Enter Your City"
                    onChange={(e) =>
                      setProfileData({ ...profileData, city: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <Form.Group
                  controlId="formState"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <Form.Label style={{ width: "50%", alignContent: "end" }}>
                    State:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.state}
                    placeholder="Enter Your State"
                    onChange={(e) =>
                      setProfileData({ ...profileData, state: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <Form.Group
                  controlId="formCountry"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <Form.Label style={{ width: "50%", alignContent: "end" }}>
                    Country:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.country}
                    placeholder="Enter Your Country"
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        country: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <Form.Group
                  controlId="formPincode"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <Form.Label style={{ width: "50%", alignContent: "end" }}>
                    Pincode:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.pincode}
                    placeholder="Enter Your Pincode"
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        pincode: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>
        </Row>
        {message && (
          <div style={{ marginBottom: "20px", color: "green" }}>{message}</div>
        )}
        <Button variant="primary" type="submit" className="update-btn">
          Update Profile
        </Button>
      </Form>
    ),
    upcomingBookings: (
      <>
        <span
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            display: "block",
            color: "#806a50",
            justifyContent: "center",
          }}
        >
          Upcoming Bookings
        </span>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Booking Id</th>
              <th>Check IN</th>
              <th>Check-Out </th>
              <th>Status</th>
              <th>Phone</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {upcomingBookings.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No data found
                </td>
              </tr>
            ) : (
              upcomingBookings.map((booking, index) => (
                <tr key={booking.id}>
                  <td>{index + 1}</td>
                  <td>{booking.customerName}</td>
                  <td>{booking.booking_id}</td>
                  <td>{booking.checkInDate}</td>
                  <td>{booking.checkOutDate}</td>
                  <td>{booking.status}</td>
                  <td>{booking.customerPhone}</td>
                  <td>{booking.amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </>
    ),
    pastBookings: (
      <>
        <span
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            display: "block",
            color: "#806a50",
            justifyContent: "center",
          }}
        >
          Past Bookings
        </span>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Booking Id</th>
              <th>Check IN</th>
              <th>Check-Out </th>
              <th>Status</th>
              <th>Phone</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {pastBookings.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No data found
                </td>
              </tr>
            ) : (
              pastBookings.map((booking, index) => (
                <tr key={booking.id}>
                  <td>{index + 1}</td>
                  <td>{booking.customerName}</td>
                  <td>{booking.booking_id}</td>
                  <td>{booking.checkInDate}</td>
                  <td>{booking.checkOutDate}</td>
                  <td>{booking.status}</td>
                  <td>{booking.customerPhone}</td>
                  <td>{booking.amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </>
    ),
    paymentHistory: (
      <>
        <span
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            display: "block",
            color: "#806a50",
            justifyContent: "center",
          }}
        >
          Payment History
        </span>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No data found
                </td>
              </tr>
            ) : (
              paymentHistory.map((payment, index) => (
                <tr key={payment.id}>
                  <td>{index + 1}</td>
                  <td>{payment.transactionId}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.paymentDate}</td>
                  <td>{payment.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </>
    ),
  };

  return (
    <>
      <section className="userpanel">
        <div className="container-fluid mt-5 mb-4">

          <div className="logout-btn-container">
            {
              userType === "agent" ? <div className="agent-title">
                Agent Login
              </div> : <div></div>
            }
            <Nav.Link
              to="/login"
              onClick={handleLogout}
              className="logout-btn popbg"
            >
              Logout
            </Nav.Link>
          </div>
          <div className="row mt-2">
            <div className="col-lg-3 mt-4">
              <div className="bookcomfortbox popbg user-details">
                <div className="user-info text-center mb-4">
                  <img
                    src={userimg}
                    alt="User"
                    className="user-image mb-3"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                    }}
                  />
                  <h5 className="user-name">{profileData.name}</h5>
                </div>
                <ul className="user-menu list-unstyled">
                  <li>
                    <Button
                      className="user-menu-btn w-100 text-start"
                      onClick={() => setSelectedTab("profile")}
                    >
                      Profile
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="user-menu-btn w-100 text-start"
                      onClick={() => setSelectedTab("upcomingBookings")}
                    >
                      Upcoming Bookings
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="user-menu-btn w-100 text-start"
                      onClick={() => setSelectedTab("pastBookings")}
                    >
                      Past Bookings
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="user-menu-btn w-100 text-start"
                      onClick={() => setSelectedTab("paymentHistory")}
                    >
                      Payment History
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-9 mt-4">
              <div className="bookcomfortbox">{tabContent[selectedTab]}</div>
            </div>
          </div>
        </div>
      </section>
      <MainFooter />
    </>
  );
};

export default UserDashboard;
