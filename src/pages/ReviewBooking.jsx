import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import reviewPack1 from "../assets/images/reviewPack1.png";
import { differenceInDays } from "date-fns";
import API, { BASE_URL } from "../api";
import PolicyTabs from "../components/PolicyTabs";

const ReviewBooking = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState(0);
  const userType = useMemo(() => localStorage.getItem("type"), []);

  const location = useLocation();

  useEffect(() => {
    if (!location.state) {
      navigate("/book-your-stay");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const response = await API.post("/auth/agent/agent-data");
        if (userType === "agent") {
          const agentOffer = response.data.offers
            ? Number(response.data.offers)
            : 0;
          setOffers(agentOffer);
          console.log("Agent Offer (Discount %):", agentOffer);
        }
      } catch (error) {
        console.error("Error fetching agent data:", error);
      }
    };

    if (userType === "agent") fetchAgentData();
  }, [userType]);

  if (!location.state) {
    return null;
  }

  const {
    checkInDate,
    checkOutDate,
    selectedRoom,
    selectedOption,
    selectedPackage,
    selectedCottages,
    selectedRoomImage,
    dayWiseBookingData,
  } = location.state;

  // Format the dates as needed (optional)
  const formattedCheckInDate = checkInDate
    ? new Date(checkInDate).toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      })
    : "Not Selected";

  const formattedCheckOutDate = checkOutDate
    ? new Date(checkOutDate).toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      })
    : "Not Selected";

  // Update these variables to use the full room data
  const roomName = selectedRoom?.room_name || "Not Selected";
  const occupancyType =
    selectedOption === 1 ? "Single Occupancy" : "Double Occupancy";
  const packageName = selectedPackage?.name || "No Package Selected";

  const roomId = selectedRoom?.id || "Not selected";

  const agentDiscountPercentage = userType === "agent" ? offers : 0; // Already converted to number

  const newPrice =
    selectedOption === 1
      ? selectedRoom?.single_new_price
      : selectedOption === 2
      ? selectedRoom?.double_new_price
      : selectedRoom?.triple_new_price;

  const basePrice =
    selectedOption === 1
      ? selectedRoom?.single_base_price
      : selectedRoom === 2
      ? selectedRoom?.double_base_price
      : selectedRoom?.triple_base_price;

  // const packagePrice = selectedPackage?.package_price || 0;
  const packagePrice = 0;

  const getAllDatesInRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dates.push(new Date(currentDate)); // Push the current date into the array
      currentDate.setDate(currentDate.getDate() + 1); // Increment the date by 1 day
    }

    return dates;
  };

  const insufficientCottageDates = dayWiseBookingData?.filter(
    (day) => day.available < selectedCottages
  );

  const totalNights = differenceInDays(
    new Date(checkOutDate),
    new Date(checkInDate)
  );

  const pricePerNight = basePrice + packagePrice;
  const newPricePerNight = newPrice + packagePrice;
  const grandTotal = pricePerNight * totalNights * selectedCottages;
  const newGrandTotal = pricePerNight * totalNights * selectedCottages;

  console.log("newGrandTotal: ", newGrandTotal, "grandTotal: ", grandTotal);

  const checkOutDateFormatted = checkOutDate
    ? new Date(checkOutDate).toISOString().split("T")[0]
    : null;

  const dateAvailability = getAllDatesInRange(checkInDate, checkOutDate)
    .filter((date) => {
      const dateStr = date.toISOString().split("T")[0];
      return dateStr !== checkOutDateFormatted; // ✅ compare with correctly formatted string
    })
    .map((date) => {
      const formatted = date.toISOString().split("T")[0];
      const found = dayWiseBookingData?.find((d) => d.date === formatted);
      const available = found ? found.available : selectedCottages;
      const pricePerNightForThisDate = available * pricePerNight;

      return {
        date,
        available,
        pricePerNightForThisDate,
      };
    });

  console.log("has dateavailbility:", dateAvailability);

  const effectiveDates = dateAvailability.filter(
    (d) => d.date.toISOString().split("T")[0] !== checkOutDate
  );

  console.log("has effective effective dates:", effectiveDates);

  const hasMismatch = effectiveDates.some(
    (d) => d.available !== selectedCottages
  );

  console.log("hasmismatched on reveiwbooking :", hasMismatch);

  // const discountPrice = newGrandTotal - grandTotal;
  // let discountPrice = Math.abs(newGrandTotal - grandTotal);
  let discountPrice = 0;
  if (newGrandTotal < grandTotal) discountPrice = 0;

  const discountPercentage =
    grandTotal && newGrandTotal && newGrandTotal > grandTotal
      ? ((newGrandTotal - grandTotal) / newGrandTotal) * 100
      : 0;

  // const agentDiscountAmount = (grandTotal * agentDiscountPercentage) / 100;
  const agentDiscountAmount = 0;

  // Calculate subtotal based on actual nightly availability
  const subtotal = hasMismatch
    ? effectiveDates.reduce(
        (acc, curr) => acc + curr.pricePerNightForThisDate,
        0
      )
    : pricePerNight * totalNights * selectedCottages;
  const finalTotalAfterAgentDiscount = subtotal; // if no discount, else apply your logic

  // Calculate GST based on amount
  const gstRate = finalTotalAfterAgentDiscount <= 7500 ? 0.12 : 0.18;
  const gstAmount = finalTotalAfterAgentDiscount * gstRate;
  const finalAmount = finalTotalAfterAgentDiscount + gstAmount;

  const handlePayAndBook = () => {
    console.log("hasMismatch before navigating:", hasMismatch);
    navigate("/checkout", {
      state: {
        checkInDate,
        checkOutDate,
        selectedRoom,
        selectedOption,
        selectedPackage,
        selectedCottages,
        roomName,
        roomId,
        occupancyType,
        packageName,
        basePrice,
        packagePrice,
        totalNights,
        pricePerNight,
        grandTotal,
        gstRate,
        gstAmount,
        newPricePerNight,
        newGrandTotal,
        finalAmount,
        discountPercentage,
        discountPrice,
        formattedCheckInDate,
        newPrice,
        formattedCheckOutDate,
        dateAvailability, // ✅ Send this for nightly breakdown
        hasMismatch, // ✅ To conditionally render breakdown
        effectiveDates, // ✅ Same filtered list used in ReviewBooking
        finalTotalAfterAgentDiscount, // ✅ Needed for correct GST recalculation if needed
      },
    });
  };

  return (
    <div className="padding-x">
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-md-8">
            <div className="bookstay">
              <h6>Book your Stay</h6>
              <h6 className="text-dark">Let's book your Vrruksh Eco Stay</h6>
              <div className="row align-items-center">
                <div className="col-md-4 mt-3 col-6">
                  <div className="daterange">
                    <div className="rangebox justify-content-start">
                      <div className="me-3">
                        <i className="bi bi-calendar-event"></i>
                      </div>
                      <div className="rightdate">
                        <span>Check In date:</span>
                        <br />
                        {formattedCheckInDate}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mt-3 col-6">
                  <div className="daterange">
                    <div className="rangebox justify-content-start">
                      <div className="me-3">
                        <i className="bi bi-calendar-event"></i>
                      </div>
                      <div className="rightdate">
                        <span>Check Out Date:</span>
                        <br />
                        {formattedCheckOutDate}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mt-3 text-right justify-content-end">
                  <div className="rightpackD">
                    <div className="d-flex justify-content-end">
                      <Link className="actionicon" to="/book-your-stay">
                        <i className="bi bi-pencil-fill"></i>{" "}
                        <em>Edit details</em>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="desktopView d-md-block d-none">
              <div className="mt-3 reviewbookigbox">
                <div className="d-flex w-100">
                  <div className="imgd">
                    <img
                      src={`${BASE_URL}/assets/images/${selectedRoomImage}`}
                      alt=""
                    />
                  </div>
                  <div className="packDetails">
                    <div>
                      <div className="d-flex justify-content-between w-100">
                        <div className="leftpackD ">
                          <div className="d-flex">
                            <h4>{roomName}</h4>
                            <div className="tagprim">Exclusive</div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between w-100">
                        <div className="leftpackD ">
                          <p>
                            Number of cottage(s):{" "}
                            <span>{selectedCottages}</span>
                          </p>
                          {/* <p>
                            Type of package: <span>{packageName}</span>
                          </p> */}
                          <p>
                            Type of occupancy: <span>{occupancyType}</span>
                          </p>
                          <p className="mt-2 mb-1 fw-bold">
                            Per Day Availability:
                          </p>
                          <ul className="mb-0">
                            {dateAvailability.map((d, idx) => (
                              <li key={idx}>
                                {d.date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  day: "2-digit",
                                  month: "short",
                                })}
                                :{" "}
                                <span
                                  style={{
                                    color: insufficientCottageDates.some(
                                      (insufficient) =>
                                        insufficient.date ===
                                        d.date.toISOString().split("T")[0]
                                    )
                                      ? "red"
                                      : "black",
                                  }}
                                >
                                  {d.available} cottage(s) available
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rightpackD">
                          <h6>
                            <span className="textdis">
                              ₹ {newPrice.toFixed(2)}
                            </span>{" "}
                            ₹ {basePrice.toFixed(2)}/room/per night
                          </h6>
                          {/* <h6>₹ {packagePrice.toFixed(2)}/package</h6> */}
                          <h6
                            style={{
                              paddingTop: "14px",
                            }}
                          >
                            Total Price : ₹ {pricePerNight.toFixed(2)} *{" "}
                            {selectedCottages} Cottage
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bookstay informbox mt-3">
              <div className="d-flex justify-content-between">
                <h6>Important information</h6>
                <div>
                  <div className="rightpackD">
                    <div className="d-flex">
                      <div className="actionicon">
                        <i className="bi bi-files"></i> <em>View all</em>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ul className="m-0 p-0 ps-4 mt-2">
                <li>
                  Members (Children) below 18 years of age are allowed at the
                  property, only if they are mentioned at the time of booking
                </li>
                <li>
                  {" "}
                  Passport, Aadhar and Driving License are accepted as ID
                  proof(s)
                </li>
                <li> Pets are not allowed</li>
                <li> Outside food is not allowed</li>
              </ul>
            </div>

            <PolicyTabs />
          </div>
          <div className="col-md-4">
            <div className="PriceBox w-100 position-sticky">
              <div className="SubPriceBox">
                <h3 className="text-color">Price Breakup</h3>
                <hr />

                {hasMismatch ? (
                  // Show day-wise breakdown if there's any mismatch in available cottages
                  effectiveDates.map((dateData, index) => {
                    const { date, available, pricePerNightForThisDate } =
                      dateData;

                    return (
                      <div key={index} className="roomcaldiv">
                        <div className="leftRoomPrice">
                          <h5>
                            {available} Cottage{available > 1 ? "s" : ""} X 1
                            Night
                          </h5>
                          <p style={{ textTransform: "capitalize" }}>
                            {date.toLocaleDateString("en-US", {
                              weekday: "short",
                              day: "2-digit",
                              month: "short",
                            })}
                          </p>
                        </div>
                        <div className="rightRoomPrice">
                          ₹ {pricePerNightForThisDate.toFixed(2)}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  // Show single summary line if availability matches selected cottages every night
                  <div className="roomcaldiv">
                    <div className="leftRoomPrice">
                      <h5>
                        {selectedCottages} Cottage
                        {selectedCottages > 1 ? "s" : ""} X{" "}
                        {effectiveDates.length} Night
                        {effectiveDates.length > 1 ? "s" : ""}
                      </h5>
                    </div>
                    <div className="rightRoomPrice">
                      ₹{" "}
                      {(
                        selectedCottages *
                        pricePerNight *
                        effectiveDates.length
                      ).toFixed(2)}
                    </div>
                  </div>
                )}

                {/* Existing Discount */}
                {/* <div className="TotalDiscountDiv">
                  <div className="leftTotalDiscount text-color">
                    <h5>
                      Total Discount <i className="bi bi-info-circle h6" onClick={() => alert(`${discountPercentage}% Off`)}
                        style={{ cursor: 'pointer' }}></i>
                    </h5>
                  </div>
                  <div className="rightTotalDiscount text-color">₹ {discountPrice.toFixed(2)}</div>
                </div> */}

                {/* Agent Discount (Only for Agents) */}
                {userType === "agent" && (
                  <div className="TotalDiscountDiv">
                    <div className="leftTotalDiscount text-color">
                      <h5>
                        Agent Discount{" "}
                        <i
                          className="bi bi-info-circle h6"
                          onClick={() =>
                            alert(`${agentDiscountPercentage}% Off`)
                          }
                          style={{ cursor: "pointer" }}
                        ></i>
                      </h5>
                    </div>
                    <div className="rightTotalDiscount text-color">
                      ₹ {agentDiscountAmount.toFixed(2)}
                    </div>
                  </div>
                )}

                <hr />
                {/* <div className="PriceafterDiv">
                  <div className="leftPriceafter">
                    <h5>Price after Discount</h5>
                  </div>
                  <div className="rightPriceafter">₹ {finalTotalAfterAgentDiscount.toFixed(2)}</div>
                </div> */}

                {/* <hr /> */}
                <div className="taxDiv">
                  <div className="lefttax">
                    <h5>
                      Taxes & Service Fees{" "}
                      <i
                        className="bi bi-info-circle h6"
                        onClick={() =>
                          alert(
                            `${
                              gstRate * 100
                            }% GST\nService Charges\nBooking Fees\nConvenience Fees`
                          )
                        }
                        style={{ cursor: "pointer" }}
                      ></i>
                    </h5>
                  </div>
                  <div className="righttax">₹ {gstAmount.toFixed(2)}</div>
                </div>

                <hr />
                <div className="finalamtDiv">
                  <div className="leftfinalamt text-color">
                    <h5>Total Amount to be paid</h5>
                  </div>
                  <div className="rightfinalamt text-color">
                    ₹ {finalAmount.toFixed(2)}
                  </div>
                </div>

                <div
                  className="bookcombtn booknowbtn w-100"
                  onClick={handlePayAndBook}
                >
                  Pay and book{" "}
                  <i className="bi bi-arrow-right-short h3 m-0"></i>
                </div>
              </div>

              <div className="qualitydiv mt-3 text-center ">
                <h6>
                  <i
                    className="bi bi-shield-fill-check "
                    style={{ color: "#579542" }}
                  ></i>{" "}
                  Quality You Can Trust
                </h6>
                <p className="w-75 m-auto d-table">
                  We are available 24/7/365 to answer your questions and help
                  you better understand your Booking.
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="copyright">© 2024. VIRYA WILDLIFE TOURS LLP.</p>
      </div>
    </div>
  );
};

export default ReviewBooking;
