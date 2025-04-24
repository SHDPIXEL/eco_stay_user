import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import API from "../api";
import Tent from "../assets/images/Tent.svg";
import Groupimg from "../assets/images/Group.svg";
import Doublebed from "../assets/images/Doublebed.svg";
import tents from "../assets/images/tents.png";
import available from "../assets/images/Cottage.svg";
import Adultimg from "../assets/images/group-3-line.svg";
import ReviewSlider from "./ReviewSlider";
import ContactSection from "./ContactSection";
import MainFooter from "./MainFooter";
import { BASE_URL } from "../api";

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
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });
  const [roomType, setRoomType] = useState("");
  const [nonAvailableDates, setNonavailability] = useState();

  const [currentIndexes, setCurrentIndexes] = useState({}); // Store indexes for each room
  // const images = JSON.parse(room.room_images);

  const handleModelOpen = (title, description) => {
    setModalContent({ title, description });
    setIsmodelOpen(true); // Ensure modal is visible
  };

  const handleCloseModal = () => {
    setIsmodelOpen(false); // Close the modal
  };

  const navigate = useNavigate();

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
    const room = connectedPackages.find((r) => r.id === roomId);
    const availableCottages = room.availability?.available || 0;
    const numCottages = index + 1;

    if (numCottages <= availableCottages) {
      // Create an array of indices to animate
      const animateIndices = Array.from({ length: numCottages }, (_, i) => i);
      setAnimatingCottages(animateIndices);

      // Clear animation after a delay
      setTimeout(() => {
        setAnimatingCottages([]);
      }, 500);

      if (roomId !== selectedRoomId) {
        clearSelections();
      }
      setSelectedRoomId(roomId);
      setSelectedCottages(numCottages);
      calculatePrice(
        roomId,
        selectedOption,
        selectedRoom,
        selectedPackage,
        numCottages
      );
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
      calculatePrice(
        selectedRoomId,
        selectedOption,
        selectedRoom,
        selectedPackage,
        selectedCottages
      );
    }
  }, [
    selectedRoomId,
    selectedOption,
    selectedRoom,
    selectedPackage,
    selectedCottages,
  ]);

  const filteredRooms = selectedRoomType
    ? connectedPackages.filter((room) => room.id === selectedRoomType)
    : connectedPackages;

  // console.log("filtered rooms", filteredRooms)

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
      console.log("Rooms data", response.data);

      if (Array.isArray(response.data) && response.data.length === 0) {
        navigate("/");
      } else {
        setRoomData(response.data);
        const twinCottage = response.data.find(
          (room) => room.room_name === "Twin Cottage"
        );
        if (twinCottage) {
          setRoomType(twinCottage.room_name);
        }
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  const fetchAllPackages = async () => {
    try {
      const response = await API.get("/packages/package");
      setPackagesData(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const connectPackagesToRoom = (roomData) => {
    if (!roomData || !packagesData) return [];

    return roomData.map((room) => {
      let packageIds = room.package_ids;

      // Parse if it's a string
      if (typeof packageIds === "string") {
        try {
          packageIds = JSON.parse(packageIds);
        } catch (e) {
          console.error("Invalid JSON in package_ids:", room.package_ids);
          packageIds = [];
        }
      }

      const roomPackages = Array.isArray(packageIds)
        ? packageIds.map((packageId) =>
            packagesData.find((pkg) => pkg.id === packageId)
          )
        : [];

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

  const ChecknonAvailableDates = async (roomId) => {
    try {
      const response = await API.post(`/availabilities/availability/${roomId}`);
      return response.data;
    } catch (e) {
      console.error("Error in fetching non-availability", e);
      return null; // Return null instead of empty array
    }
  };

  const checkRoomAvailabilityForRange = async (roomId) => {
    try {
      const formatDateLocal = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const response = await API.post("/auth/user/check-range", {
        roomId, // add this here
        checkInDate: formatDateLocal(checkInDate),
        checkOutDate: formatDateLocal(checkOutDate),
        requiredCount: selectedCottages,
      });
      console.log("available rooms:", response.data.unavailableDates);
      return response.data;
    } catch (e) {
      console.error("Error checking room availability for range", e);
      return null;
    }
  };

  const validateBooking = async (roomId) => {
    const errors = {};

    const nonAvailability = await ChecknonAvailableDates(roomId);
    const availabilityResponse = await checkRoomAvailabilityForRange(roomId);

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
    if (!totalPrice || selectedRoomId !== roomId) {
      errors.totalPrice = "Total price calculation is missing";
    }

    const room = connectedPackages.find((r) => r.id === roomId);
    const availableCottages = room?.availability?.available || 0;

    if (availableCottages === 0) {
      errors.selectedCottages = "No cottages are available for booking!";
      alert(
        "No cottages are available for booking! Please try another room or date."
      );
    } else if (!selectedCottages || selectedCottages > availableCottages) {
      errors.selectedCottages = "Invalid number of cottages selected.";
    }

    if (nonAvailability) {
      const formattedCheckInDate = new Date(checkInDate)
        .toISOString()
        .split("T")[0];
      const formattedCheckOutDate = new Date(checkOutDate)
        .toISOString()
        .split("T")[0];

      if (formattedCheckInDate === nonAvailability.date) {
        errors.checkInDate = "Selected check-in date is not available";
      }
    }

    let dayWiseBookingData = []; // Array to store day-wise data

    if (availabilityResponse && availabilityResponse.success === false) {
      const unavailableDates = availabilityResponse.unavailableDates;

      for (let date of unavailableDates) {
        const formattedDate = new Date(date.date).toISOString().split("T")[0];
        let available = date.available || 0;

        const pricePerCottage =
          selectedRoom.priceKey === "single_base_price"
            ? selectedRoom.single_base_price
            : selectedRoom.priceKey === "double_base_price"
            ? selectedRoom.double_base_price
            : selectedRoom.triple_base_price;

        console.log("prices", pricePerCottage);

        let priceForDay = available * selectedCottages * pricePerCottage; // Replace with your price calculation logic

        dayWiseBookingData.push({
          date: formattedDate,
          available,
          price: priceForDay,
        });
      }

      // Prompt user to proceed
      const warning = unavailableDates
        .map((d) => `Date: ${d.date}, Available: ${d.available}`)
        .join("\n");

      const proceed = window.confirm(
        `Some dates do not have enough cottages available:\n${warning}\n\nDo you still want to proceed?`
      );

      if (!proceed) {
        errors.availability = "Insufficient availability on selected dates.";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0 ? dayWiseBookingData : null;
  };

  const handleBookStay = async (roomId) => {
    setActiveRoomId(roomId);

    const dayWiseBookingData = await validateBooking(roomId);

    if (dayWiseBookingData) {
      const selectedRoomData = connectedPackages.find(
        (room) => room.id === roomId
      );

      console.log("selected room data", selectedRoomData);

      let selectedImage = null;
      if (selectedRoomData?.room_images) {
        const roomImages = JSON.parse(selectedRoomData.room_images);
        if (roomImages.length > 0) {
          selectedImage = roomImages[0]; // Get the first image
        }
      }
      console.log("room image", selectedImage);

      navigate("/review-booking", {
        state: {
          checkInDate,
          checkOutDate,
          selectedRoom: selectedRoomData,
          selectedOption,
          selectedPackage,
          totalPrice,
          selectedCottages,
          selectedRoomImage: selectedImage, // Pass image directly
          dayWiseBookingData,
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

  const sendDateToBackend = async (date) => {
    try {
      const response = await API.post("/rooms/roombydate", { date });
      console.log("Date sent successfully:", response.data);
      if (Array.isArray(response.data) && response.data.length === 0) {
        navigate("/");
      } else {
        setRoomData(response.data);
        const twinCottage = response.data.find(
          (room) => room.room_name === "Twin Cottage"
        );
        if (twinCottage) {
          setRoomType(twinCottage.room_name);
        }
      }
    } catch (error) {
      console.error("Error sending date:", error);
    }
  };

  return (
    <div className="padding-x">
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
                  <span
                    style={{
                      border: "black",
                      backgroundColor: "#ccf360",
                      padding: "5px 10px",
                      borderRadius: "12px",
                      border: "1px solid #000",
                    }}
                  >
                    {checkInDate
                      ? checkInDate.toLocaleDateString("en-US", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                        })
                      : "Not Selected"}
                  </span>
                </p>

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
                            sendDateToBackend(date);
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
                          className={`libox ${
                            isSelected ? "selected-date" : ""
                          }`}
                          key={index}
                          onClick={() => {
                            setCheckInDate(dateObj.date);
                            sendDateToBackend(dateObj.date);
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
                  <span
                    style={{
                      border: "black",
                      backgroundColor: "#ccf360",
                      padding: "5px 10px",
                      borderRadius: "12px",
                      border: "1px solid #000",
                    }}
                  >
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
                        className={`libox ${
                          dateObj.date.getTime() === checkOutDate?.getTime()
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
                {new Set(connectedPackages.map((room) => room.id)).size} Room
                Types:
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
                  className={`roombox ${
                    selectedRoomType === room.type ? "active" : ""
                  }`}
                  onClick={() => setSelectedRoomType(room.id)}
                >
                  <img
                    src={getRoomImage(room.room_name)}
                    alt={room.name}
                    className="room-icon"
                  />
                  {room.room_name}
                  <span className="room-type">{room.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredRooms.map((room, index) => {
          const options = [
            {
              id: 1,
              name:
                room.room_name === "Twin Cottage"
                  ? "Double Occupancy"
                  : "Single Occupancy",
              priceKey: "single_base_price",
              price: room.single_base_price,
              cottages: 1,
            },
            {
              id: 2,
              name:
                room.room_name === "Twin Cottage"
                  ? "Quadruple Occupancy"
                  : "Double Occupancy",
              priceKey: "double_base_price",
              price: room.double_base_price,
              cottages: 2,
            },
            {
              id: 3,
              name:
                room.room_name === "Twin Cottage"
                  ? "Sextuple Occupancy"
                  : "Triple Occupancy",
              priceKey: "triple_base_price",
              price: room.triple_base_price,
              cottages: 3,
            },
          ].filter((option) => option.price > 0); // <- Filter out 0-priced options

          return (
            <div
              className="bookstayboxMain"
              key={index}
              style={{
                backgroundColor: index % 2 === 0 ? "#f1f1e7" : "#fff",
              }}
            >
              <div className="row g-0">
                <div className="col-md-4 border-right">
                  <div className="leftBookstaybox border-0">
                    <div key={index} className="slider-container">
                      {/* Default index to 0 if not set */}
                      {(() => {
                        let images = [];

                        try {
                          const onceParsed = JSON.parse(room.room_images);
                          images =
                            typeof onceParsed === "string"
                              ? JSON.parse(onceParsed)
                              : onceParsed;
                        } catch (err) {
                          console.error(
                            "Error parsing room_images:",
                            room.room_images,
                            err
                          );
                        }

                        return images.length > 0 ? (
                          <>
                            <button
                              className="prev"
                              onClick={() =>
                                setCurrentIndexes((prev) => ({
                                  ...prev,
                                  [index]:
                                    prev[index] === 0
                                      ? images.length - 1
                                      : prev[index] - 1,
                                }))
                              }
                            >
                              &#10094;
                            </button>

                            <img
                              src={`${BASE_URL}/assets/images/${
                                images[currentIndexes[index] || 0]
                              }`}
                              alt="Room"
                              className="slider-image rounded-img"
                            />

                            <button
                              className="next"
                              onClick={() =>
                                setCurrentIndexes((prev) => ({
                                  ...prev,
                                  [index]:
                                    prev[index] === images.length - 1
                                      ? 0
                                      : (prev[index] || 0) + 1,
                                }))
                              }
                            >
                              &#10095;
                            </button>
                          </>
                        ) : null;
                      })()}
                    </div>

                    <h4 className="model-title">{room.room_name}</h4>

                    <ul>
                      {(() => {
                        let amenities = [];

                        try {
                          const parsed = JSON.parse(room.amenities);
                          if (Array.isArray(parsed)) {
                            amenities = parsed;
                          } else if (typeof parsed === "string") {
                            amenities = parsed.split(",");
                          }
                        } catch (err) {
                          // If parsing fails, fallback to splitting the plain string
                          if (typeof room.amenities === "string") {
                            amenities = room.amenities.split(",");
                          }
                        }

                        return amenities.map((a, idx) => (
                          <li key={idx}>{a.trim()}</li>
                        ));
                      })()}
                    </ul>

                    <div
                      onClick={() =>
                        handleModelOpen(room.room_name, room.description)
                      }
                      className="viewallbtn"
                    >
                      View all Room Amenities
                    </div>
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
                          Available:{" "}
                          <em>{room.availability?.available || 0}</em>
                        </span>
                        <span className="tickbg">
                          Booked: <em>{room.availability?.booked || 0}</em>
                        </span>
                      </div>

                      <div className="availablebox">
                        <div className="autoscroll">
                          <div className="availablebox">
                            <div className="autoscroll">
                              {/* Available Cottages */}
                              {Array.from({
                                length: room.availability?.available || 0,
                              }).map((_, index) => (
                                <div
                                  className={`bookdiv available ${
                                    index < selectedCottages &&
                                    selectedRoomId === room.id
                                      ? "selected_cottage"
                                      : ""
                                  } ${
                                    animatingCottages.includes(index)
                                      ? "animate-select"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleCottageChange(room.id, index)
                                  }
                                  key={`available-${index}`}
                                  style={{
                                    transition: "all 0.3s ease",
                                    transform: animatingCottages.includes(index)
                                      ? "scale(.9)"
                                      : "scale(1)",
                                    backgroundColor:
                                      index < selectedCottages &&
                                      selectedRoomId === room.id
                                        ? "#f7f7ca29"
                                        : "",
                                  }}
                                >
                                  <img src={available} alt="Available" />
                                  <p>Available</p>
                                </div>
                              ))}

                              {/* Booked Cottages */}
                              {Array.from({
                                length: room.availability?.booked || 0,
                              }).map((_, index) => (
                                <div
                                  className="bookdiv"
                                  key={`booked-${index}`}
                                >
                                  <img src={Groupimg} alt="Booked" />
                                  <p>Booked</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <div className="SecoundrightBook">
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
                                    ? "rgba(235, 214, 193, 0.34)"
                                    : "#fff",
                                border:
                                  selectedPackage?.id === pkg.id && selectedRoomId === room.id
                                    ? "2px solid #806a50"
                                    : "1px solid #ccc",
                                padding: "10px",
                                borderRadius: "8px",
                                marginBottom: "10px",
                              }}>

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
                    </div> */}
                    <div className="thirdrightBook">
                      <div className="mb-2">
                        <span className="numberselect">
                          2. Select type of occupancy
                        </span>
                      </div>
                      {validationErrors.selectedOption &&
                        activeRoomId === room.id && (
                          <p className="text-danger">
                            {validationErrors.selectedOption}
                          </p>
                        )}
                      <p className="text-muted">
                        The {room.room_name} Cost for Single Occupancy ₹{" "}
                        {room.single_base_price} and for Double Occupancy ₹{" "}
                        {room.double_base_price} . Kids upto 6 years
                        complimentary sharing bed with parents. 6 Years and
                        Above: INR 2000+18% GST.
                      </p>
                      <div className="row">
                        <div className="col-md-4 mb-1">
                          <div className="d-flex justify-content-start align-items-center gap-3">
                            {options.map((option) => (
                              <div
                                key={option.id}
                                className={`roomType-container d-flex align-items-center justify-center py-2 px-2 ${
                                  selectedOption === option.id &&
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
                                      : option.priceKey === "double_base_price"
                                      ? room.double_base_price
                                      : room.triple_base_price
                                  )
                                }
                                style={{
                                  cursor: "pointer",
                                  backgroundColor:
                                    selectedOption === option.id &&
                                    selectedRoomId === room.id
                                      ? "rgba(235, 214, 193, 0.34)"
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
                              3. Your booking price estimate is:{" "}
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
                          {validationErrors.checkOutDate &&
                            activeRoomId === room.id && (
                              <p className="text-danger text-center mt-2">
                                {validationErrors.checkOutDate}
                              </p>
                            )}
                          {validationErrors.checkInDate &&
                            activeRoomId === room.id && (
                              <p
                                className="text-danger"
                                style={{
                                  textAlign: "center",
                                }}
                              >
                                {validationErrors.checkInDate}
                              </p>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* <ReviewSlider /> */}
      </div>
      {/* <ContactSection /> */}
      <MainFooter />
    </div>
  );
};
export default BookYourStayPage;
