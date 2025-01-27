import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import API from "../api";
import Tent from "../assets/images/Tent.svg";
import Groupimg from "../assets/images/Group.svg";
import Doublebed from "../assets/images/Doublebed.svg";
import tents from "../assets/images/tents.png";
import bookyour1 from "../assets/images/bookyour1.png";
import available from "../assets/images/Cottage.svg";
import Adultimg from "../assets/images/group-3-line.svg";
import ReviewSlider from "./ReviewSlider";
import ContactSection from "./ContactSection";
import MainFooter from "./MainFooter";

const BookYourStayPage = () => {
  const [value, setValue] = useState(1);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [isCheckInPickerOpen, setIsCheckInPickerOpen] = useState(false);
  const [isCheckOutPickerOpen, setIsCheckOutPickerOpen] = useState(false);
  const [roomData, setRoomData] = useState([]);
  const [packagesData, setPackagesData] = useState([]);
  const [connectedPackages, setConnectedPackages] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [selectedCottages, setSelectedCottages] = useState(1);
  const [animatingCottages, setAnimatingCottages] = useState([]);
  const [isModelOpen, setIsmodelOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", description: "" });


  const handleModelOpen = (title, description) => {
    setModalContent({ title, description });
    setIsmodelOpen(true); // Ensure modal is visible
  };

  const handleCloseModal = () => {
    setIsmodelOpen(false); // Close the modal
  };

  const navigate = useNavigate();
  const options = [
    {
      id: 1,
      name: "Single Occupancy",
      priceKey: "single_base_price",
      cottages: 1,
    },
    {
      id: 2,
      name: "Double Occupancy",
      priceKey: "double_base_price",
      cottages: 2,
    },
  ];

  const clearSelections = () => {
    setSelectedOption(null);
    setSelectedPackage(null);
    setSelectedRoom(null);
    setTotalPrice(0);
    setSelectedCottages(1);
  };

  const handleSelect = (roomId, id, price) => {
    if (roomId !== selectedRoomId) {
      clearSelections();
    }
    setSelectedRoomId(roomId);
    setSelectedOption(id);
    setSelectedRoom(price);
    setActiveRoomId(roomId);
    calculatePrice(roomId, id, price, selectedPackage, selectedCottages);
  };

  const handlePackageSelect = (roomId, pkg) => {
    if (roomId !== selectedRoomId) {
      clearSelections();
    }
    setSelectedRoomId(roomId);
    setSelectedPackage(pkg);
    setActiveRoomId(roomId);
    calculatePrice(roomId, selectedOption, selectedRoom, pkg, selectedCottages);
  };

  const handleCottageChange = (roomId, index) => {
    const room = connectedPackages.find(r => r.id === roomId);
    const availableCottages = JSON.parse(room.status).available;
    const numCottages = index + 1;

    if (numCottages <= availableCottages) {
      // Create array of indices to animate
      const animateIndices = [];
      for (let i = 0; i < numCottages; i++) {
        animateIndices.push(i);
      }
      setAnimatingCottages(animateIndices);

      // Clear animation after delay
      setTimeout(() => {
        setAnimatingCottages([]);
      }, 500);

      if (roomId !== selectedRoomId) {
        clearSelections();
      }
      setSelectedRoomId(roomId);
      setSelectedCottages(numCottages);
      calculatePrice(roomId, selectedOption, selectedRoom, selectedPackage, numCottages);
    }
  };

  const calculatePrice = (roomId, option, roomPrice, pkg, cottages) => {
    if (roomId === selectedRoomId) {
      const packagePrice = pkg?.package_price || 0;
      const selectedRoomPrice = roomPrice || 0;
      const total = (packagePrice + selectedRoomPrice) * cottages;
      setTotalPrice(total);
    }
  };

  useEffect(() => {
    if (selectedRoomId && selectedOption && selectedRoom && selectedPackage) {
      calculatePrice(selectedRoomId, selectedOption, selectedRoom, selectedPackage, selectedCottages);
    }
  }, [selectedRoomId, selectedOption, selectedRoom, selectedPackage, selectedCottages]);

  const filteredRooms = selectedRoomType
    ? connectedPackages.filter((room) => room.id === selectedRoomType)
    : connectedPackages;

  const getRecentDates = (startDate) => {
    const dates = [];
    const today = startDate || new Date();
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });
      dates.push({ date, formattedDate });
    }
    return dates;
  };

  const getNextFiveDays = (startDate) => {
    const dates = [];
    const today = new Date(startDate);
    for (let i = 1; i <= 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });
      dates.push({ date, formattedDate });
    }
    return dates;
  };

  const checkInDates = getRecentDates();
  const checkOutDates = getNextFiveDays(checkInDate);

  const fetchRoomData = async () => {
    try {
      const response = await API.get("/rooms/room");
      setRoomData(response.data);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  const fetchAllPackages = async () => {
    try {
      const response = await API.get("/packages/package");
      setPackagesData(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const connectPackagesToRoom = (roomData) => {
    if (!roomData || !packagesData) return [];

    return roomData.map((room) => {
      const roomPackages = JSON.parse(room.package_ids).map((packageId) => {
        return packagesData.find((pkg) => pkg.id === packageId);
      });
      return {
        ...room,
        packages: roomPackages,
      };
    });
  };

  useEffect(() => {
    fetchAllPackages();
    fetchRoomData();
  }, []);

  useEffect(() => {
    if (roomData.length > 0 && packagesData.length > 0) {
      const roomsWithPackages = connectPackagesToRoom(roomData);
      setConnectedPackages(roomsWithPackages);
    }
  }, [roomData, packagesData]);

  const validateBooking = (roomId) => {
    const errors = {};

    if (!checkInDate) {
      errors.checkInDate = "Please select a check-in date";
    }
    if (!checkOutDate) {
      errors.checkOutDate = "Please select a check-out date";
      document.querySelector(".daterange:nth-child(2)")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    if (!selectedRoom || selectedRoomId !== roomId) {
      errors.selectedRoom = "Please select a room";
    }
    if (!selectedOption || selectedRoomId !== roomId) {
      errors.selectedOption = "Please select occupancy type";
    }
    if (!selectedPackage || selectedRoomId !== roomId) {
      errors.selectedPackage = "Please select a package";
    }
    if (!totalPrice || selectedRoomId !== roomId) {
      errors.totalPrice = "Total price calculation is missing";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookStay = (roomId) => {
    setActiveRoomId(roomId);
    if (validateBooking(roomId)) {
      const selectedRoomData = connectedPackages.find(room => room.id === roomId);

      navigate("/review-booking", {
        state: {
          checkInDate,
          checkOutDate,
          selectedRoom: selectedRoomData,
          selectedOption,
          selectedPackage,
          totalPrice,
          selectedCottages
        },
      });
    }
  };

  if (!roomData.length || !packagesData.length) {
    return <div>Loading room and package details...</div>;
  }

  const getRoomImage = (roomData) => {
    switch (roomData) {
      case "Mud block cottages":
        return Groupimg;
      case "Median Tents":
        return tents;
      case "Colossal Tents":
        return Tent;
      case "Twin Cottage":
        return Tent;
      default:
        return Doublebed;
    }
  };

  return (
    <>
      <div className="container-fluid mt-3">
        <div className="bookstay">
          <h6>Book your Stay</h6>
          <h6 className="text-dark">
            View Rooms availability & prices for your travel dates
          </h6>
          <div className="row">
            {/* Check-In Date Section */}
            <div className="col-md-6 mb-3">
              <div className="daterange">
                <p>
                  Select your Check In date:{" "}
                  <span>
                    {checkInDate
                      ? checkInDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                      })
                      : "Not Selected"}
                  </span>
                </p>
                {validationErrors.checkInDate && (
                  <p className="text-danger">{validationErrors.checkInDate}</p>
                )}
                <div className="rangebox">
                  <div className="me-1" style={{ position: "relative" }}>
                    <i
                      className="bi bi-calendar-event"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setIsCheckInPickerOpen(!isCheckInPickerOpen)
                      }
                    ></i>
                    {isCheckInPickerOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          zIndex: 1000,
                          background: "white",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <DatePicker
                          selected={checkInDate}
                          onChange={(date) => {
                            setCheckInDate(date);
                            setCheckOutDate(null);
                            setIsCheckInPickerOpen(false);
                          }}
                          minDate={new Date()}
                          inline
                        />
                      </div>
                    )}
                  </div>
                  <div className="autoscroll">
                    {checkInDates.map((dateObj, index) => {
                      const checkInDateWithoutTime = new Date(checkInDate);
                      checkInDateWithoutTime.setHours(0, 0, 0, 0);

                      const dateObjWithoutTime = new Date(dateObj.date);
                      dateObjWithoutTime.setHours(0, 0, 0, 0);

                      const isSelected =
                        dateObjWithoutTime.getTime() ===
                        checkInDateWithoutTime.getTime();

                      return (
                        <div
                          className={`libox ${isSelected ? "selected-date" : ""
                            }`}
                          key={index}
                          onClick={() => {
                            setCheckInDate(dateObj.date);
                            setIsCheckInPickerOpen(false);
                            setCheckOutDate(null);
                          }}
                        >
                          {dateObj.formattedDate}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            {/* Check-Out Date Section */}
            <div className="col-md-6 mb-3">
              <div className="daterange">
                <p>
                  Select your Check Out date:{" "}
                  <span>
                    {checkOutDate
                      ? checkOutDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                      })
                      : "Not Selected"}
                  </span>
                </p>
                {validationErrors.checkOutDate && (
                  <p className="text-danger">{validationErrors.checkOutDate}</p>
                )}
                <div className="rangebox">
                  <div className="me-1" style={{ position: "relative" }}>
                    <i
                      className="bi bi-calendar-event"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setIsCheckOutPickerOpen(!isCheckOutPickerOpen)
                      }
                    ></i>
                    {isCheckOutPickerOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          zIndex: 1000,
                          background: "white",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <DatePicker
                          selected={checkOutDate}
                          onChange={(date) => {
                            setCheckOutDate(date);
                            setIsCheckOutPickerOpen(false);
                          }}
                          minDate={
                            checkInDate
                              ? new Date(checkInDate.getTime() + 86400000)
                              : new Date()
                          }
                          inline
                        />
                      </div>
                    )}
                  </div>
                  <div className="autoscroll">
                    {checkOutDates.map((dateObj, index) => (
                      <div
                        className={`libox ${dateObj.date.getTime() === checkOutDate?.getTime()
                          ? "selected-date"
                          : ""
                          }`}
                        key={index}
                        onClick={() => setCheckOutDate(dateObj.date)}
                      >
                        {dateObj.formattedDate}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="roomtype mt-5 mb-2">
          <div className="roomtype-container">
            {/* Left Side: Room Count */}
            <div className="roomtype-container">
              {/* Room Type Header */}
              <div className="roomtype-header">
                {new Set(connectedPackages.map((room) => room.id)).size} Room Types:
              </div>

              {/* Show All Types */}
              <div
                className={`roombox ${!selectedRoomType ? "active" : ""}`}
                onClick={() => setSelectedRoomType(null)}
              >
                <img src={Doublebed} alt="" className="room-icon" />
                Show All Types
              </div>
            </div>

            {/* Right Side: Connected Packages */}
            <div className="room-grid">
              {connectedPackages.map((room, index) => (
                <div
                  key={index}
                  className={`roombox ${selectedRoomType === room.type ? "active" : ""}`}
                  onClick={() => setSelectedRoomType(room.id)}
                >
                  <img src={getRoomImage(room.room_name)} alt={room.name} className="room-icon" />
                  {room.room_name}
                  <span className="room-type">{room.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredRooms.map((room, index) => (
          <div
            className="bookstayboxMain"
            key={index}
            style={{
              backgroundColor: index % 2 === 0 ? '#f1f1e7' : '#fff',
            }}
          >
            <div className="row g-0">
              <div className="col-md-4 border-right">
                <div className="leftBookstaybox border-0">
                  <img src={bookyour1} alt="" />
                  <h4 className="model-title">{room.room_name}</h4>

                  <ul>
                    {JSON.parse(room.amenities).map((a, idx) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>

                  <div
                    onClick={() => handleModelOpen(room.room_name, room.description)}
                    className="viewallbtn"
                  >
                    View all Room Amenities</div>
                </div>
              </div>

              {isModelOpen && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <button className="close-btn" onClick={handleCloseModal}>
                      &times;
                    </button>
                    <h3 className="model-title">{modalContent.title}</h3>
                    <p>{modalContent.description}</p>
                  </div>
                </div>
              )}

              <div className="col-md-8">
                <div className="rightBookstaybox ">
                  <div className="firstrightBook">
                    <div className="mb-2">
                      <span className="numberselect">
                        1. Number of cottage(s) Available
                      </span>{" "}
                      <span className="tickbg">
                        Available: <em>{JSON.parse(room.status).available}</em>
                      </span>
                      <span className="tickbg">
                        Booked: <em>{JSON.parse(room.status).booked}</em>
                      </span>
                    </div>

                    <p className="text-muted"></p>
                    <div className="availablebox">
                      <div className="autoscroll">
                        <div className="availablebox">
                          <div className="autoscroll">
                            {Array.from({
                              length: JSON.parse(room.status).available,
                            }).map((_, index) => (
                              <div
                                className={`bookdiv available ${index < selectedCottages && selectedRoomId === room.id ? 'selected_cottage' : ''
                                  } ${animatingCottages.includes(index) ? 'animate-select' : ''}`}
                                onClick={() => handleCottageChange(room.id, index)}
                                key={`available-${index}`}
                                style={{
                                  transition: 'all 0.3s ease',
                                  transform: animatingCottages.includes(index) ? 'scale(.9)' : 'scale(1)',
                                        backgroundColor: index < selectedCottages && selectedRoomId === room.id ? '#f7f7ca29' : '', 
                                }}
                              >
                                <img src={available} alt="Available" />
                                <p>Available</p>
                              </div>
                            ))}

                            {Array.from({
                              length: JSON.parse(room.status).booked,
                            }).map((_, index) => (
                              <div className="bookdiv" key={`booked-${index}`}>
                                <img src={Groupimg} alt="Booked" />
                                <p>Booked</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="SecoundrightBook">
                    <div className="mb-2">
                      <span className="numberselect">
                        2. Select any type of package
                      </span>
                    </div>
                    {validationErrors.selectedPackage && activeRoomId === room.id && (
                      <p className="text-danger">
                        {validationErrors.selectedPackage}
                      </p>
                    )}
                    <p className="text-muted">Click on "Package" to select</p>
                    <div className="packagebox">
                      <div className="autoscroll">
                        {room.packages.map((pkg, i) => (
                          <div
                            key={pkg.id}
                            className={`packageboxdiv ${selectedPackage?.id === pkg.id && selectedRoomId === room.id
                              ? "selected"
                              : ""
                              }`}
                            onClick={() => handlePackageSelect(room.id, pkg)}
                            style={{
                              cursor: "pointer",
                              backgroundColor:
                                selectedPackage?.id === pkg.id && selectedRoomId === room.id
                                  ? "#F4F4F4"
                                  : "#fff",
                              border:
                                selectedPackage?.id === pkg.id && selectedRoomId === room.id
                                  ? "2px solid #806a50"
                                  : "1px solid #ccc",
                              padding: "10px",
                              borderRadius: "8px",
                              marginBottom: "10px",
                            }}
                          >
                            <h5>
                              Package {i + 1}: {pkg.name}
                            </h5>
                            <ul>
                              {pkg.long_description &&
                                pkg.long_description.split(",").map((b, index) => (
                                  <li key={index}>{b.trim()}</li>
                                ))}
                            </ul>
                            <h6
                              style={{
                                color:
                                  selectedPackage?.id === pkg.id && selectedRoomId === room.id
                                    ? "#806a50"
                                    : "#000",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents the parent div's onClick from firing
                                handleModelOpen(pkg.name, pkg.long_description);
                              }}
                            >
                              {selectedPackage?.id === pkg.id && selectedRoomId === room.id
                                ? "Selected"
                                : "View More Details"}
                            </h6>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="thirdrightBook">
                    <div className="mb-2">
                      <span className="numberselect">
                        3. Select type of occupancy
                      </span>
                    </div>
                    {validationErrors.selectedOption && activeRoomId === room.id && (
                      <p className="text-danger">
                        {validationErrors.selectedOption}
                      </p>
                    )}
                    <p className="text-muted">
                      The {room.room_name} Cost for Single Occupancy ₹{" "}
                      {room.single_base_price} and for Double Occupancy ₹{" "}
                      {room.double_base_price} . Kids upto 6 years complimentary
                      sharing bed with parents. 6 Years and Above: INR 2000+18%
                      GST.
                    </p>
                    <div className="row">
                      <div className="col-md-4 mb-1">
                        <div className="d-flex justify-content-start align-items-center gap-3">
                          {options.map((option) => (
                            <div
                              key={option.id}
                              className={`d-flex align-items-center px-3 py-2 ${selectedOption === option.id &&
                                selectedRoomId === room.id
                                ? "selected"
                                : ""
                                }`}
                              onClick={() =>
                                handleSelect(
                                  room.id,
                                  option.id,
                                  option.priceKey === "single_base_price"
                                    ? room.single_base_price
                                    : room.double_base_price
                                )
                              }
                              style={{
                                cursor: "pointer",
                                backgroundColor:
                                  selectedOption === option.id &&
                                    selectedRoomId === room.id
                                    ? "#F4F4F4"
                                    : "#fff",
                                border:
                                  selectedOption === option.id &&
                                    selectedRoomId === room.id
                                    ? "2px solid #806a50"
                                    : "1px solid #ccc",
                                borderRadius: "8px",
                                marginBottom: "0",
                                color:
                                  selectedOption === option.id &&
                                    selectedRoomId === room.id
                                    ? "#806a50"
                                    : "#000000",
                              }}
                            >
                              <img
                                src={Adultimg}
                                alt=""
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  marginRight: "8px",
                                  color:
                                    selectedOption === option.id &&
                                      selectedRoomId === room.id
                                      ? "#000000"
                                      : "#ffffff",
                                }}
                              />
                              <span>{option.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="FourthdrightBook border-0">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-2">
                          <span className="numberselect">
                            4. Your booking price estimate is:{" "}
                            <span className="text-color">
                              ₹ {selectedRoomId === room.id ? totalPrice : 0}
                            </span>
                          </span>
                        </div>
                        <p className="text-muted">
                          Check In Time is 1300 hrs and Check Out Time is 1100
                          hrs. Swimming costume is mandatory while using the
                          pool.
                        </p>
                      </div>
                      <div className="col-md-6">
                        <button
                          className="bookcombtn booknowbtn w-100"
                          onClick={() => handleBookStay(room.id)}
                        >
                          <span>Looks good, book stay </span>
                          <i className="bi bi-arrow-right ms-2 "></i>
                        </button>
                        {validationErrors.checkOutDate && activeRoomId === room.id && (
                          <p className="text-danger text-center mt-2">
                            {validationErrors.checkOutDate}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <ReviewSlider />
      </div>
      <ContactSection />
      <MainFooter />
    </>
  );
};
export default BookYourStayPage;
