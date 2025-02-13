import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import reviewPack1 from "../assets/images/reviewPack1.png";
import { differenceInDays } from "date-fns";
import API, { BASE_URL } from "../api";


const ReviewBooking = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState(0);
  const userType = useMemo(() => localStorage.getItem("type"), []);

  const location = useLocation();

  useEffect(() => {
    if (!location.state) {
      navigate("/book-your-stay");
    }
  }, [location.state, navigate])


  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const response = await API.post("/auth/agent/agent-data");
        if (userType === "agent") {
          const agentOffer = response.data.offers ? Number(response.data.offers) : 0;
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
      : selectedRoom?.double_new_price;

  const basePrice =
    selectedOption === 1
      ? selectedRoom?.single_base_price
      : selectedRoom?.double_base_price;

  const packagePrice = selectedPackage?.package_price || 0;

  const totalNights = differenceInDays(new Date(checkOutDate), new Date(checkInDate));


  const pricePerNight = basePrice + packagePrice;
  const newPricePerNight = newPrice + packagePrice;
  const grandTotal = pricePerNight * totalNights * selectedCottages;
  const newGrandTotal = newPricePerNight * totalNights * selectedCottages;

  console.log("newGrandTotal: ", newGrandTotal, "grandTotal: ", grandTotal);

  // const discountPrice = newGrandTotal - grandTotal;
  let discountPrice = Math.abs(newGrandTotal - grandTotal);
  if (newGrandTotal < grandTotal) discountPrice = 0;

  const discountPercentage = grandTotal && newGrandTotal && newGrandTotal > grandTotal
    ? ((newGrandTotal - grandTotal) / newGrandTotal) * 100
    : 0;


  const agentDiscountAmount = (grandTotal * agentDiscountPercentage) / 100;
  const finalTotalAfterAgentDiscount = grandTotal - agentDiscountAmount;


  // Calculate GST based on amount
  const gstRate = finalTotalAfterAgentDiscount <= 7500 ? 0.12 : 0.18;
  const gstAmount = finalTotalAfterAgentDiscount * gstRate;
  const finalAmount = finalTotalAfterAgentDiscount + gstAmount;




  const handlePayAndBook = () => {
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
        formattedCheckOutDate
      }
    });
  };

  return (
    <>
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
                    <img src={`${BASE_URL}/assets/images/${selectedRoomImage}`}
                      alt="" />
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
                          <p>
                            Type of package: <span>{packageName}</span>
                          </p>
                          <p>
                            Type of occupancy: <span>{occupancyType}</span>
                          </p>
                        </div>
                        <div className="rightpackD">
                          <h6><span className="textdis">₹ {(newPrice).toFixed(2)}</span> ₹ {basePrice.toFixed(2)}/room/per night</h6>
                          <h6>₹ {packagePrice.toFixed(2)}/package</h6>
                          <h6>Total Price : ₹ {pricePerNight.toFixed(2)} * {selectedCottages} Cottage</h6>

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

            <div className="bookstay informbox mt-3 mb-3">
              <div className="d-md-flex justify-content-between">
                <h6>Terms & Conditions</h6>
                <div>
                  <div className="rightpackD">
                    <div className="d-flex">
                      <div className="actionicon">Privacy Policy</div>
                      <div className="actionicon">
                        Cancellation & Refund Policy
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ul className="m-0 p-0 ps-4 mt-2">
                <li>
                  45 days before check-in : 10% on total invoice amount as
                  banking and administration fees.
                </li>
                <li> Between 45 - 30 days : 30% of total invoice amount.</li>
                <li> Between 30 - 15 days : 50% of total invoice amount.</li>
                <li>
                  {" "}
                  Bookings cancelled under 15 days before check-in or No Show :
                  100% of total invoice amount.
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-4">
            <div className="PriceBox w-100 position-sticky">

              <div className="SubPriceBox">
                <h3 className="text-color">Price Breakup</h3>
                <hr />

                <div className="roomcaldiv">
                  <div className="leftRoomPrice">
                    <h5>{selectedCottages} Cottage X {totalNights} Nights</h5>
                    <p style={{ textTransform: "capitalize" }}>({selectedRoom?.room_name} {selectedPackage?.name})</p>
                  </div>
                  <div className="rightRoomPrice">₹ {newGrandTotal.toFixed(2)}</div>
                </div>

                {/* Existing Discount */}
                <div className="TotalDiscountDiv">
                  <div className="leftTotalDiscount text-color">
                    <h5>
                      Total Discount <i className="bi bi-info-circle h6" onClick={() => alert(`${discountPercentage}% Off`)}
                        style={{ cursor: 'pointer' }}></i>
                    </h5>
                  </div>
                  <div className="rightTotalDiscount text-color">₹ {discountPrice.toFixed(2)}</div>
                </div>

                {/* Agent Discount (Only for Agents) */}
                {userType === "agent" && (
                  <div className="TotalDiscountDiv">
                    <div className="leftTotalDiscount text-color">
                      <h5>
                        Agent Discount <i className="bi bi-info-circle h6" onClick={() => alert(`${agentDiscountPercentage}% Off`)}
                          style={{ cursor: 'pointer' }}></i>
                      </h5>
                    </div>
                    <div className="rightTotalDiscount text-color">₹ {agentDiscountAmount.toFixed(2)}</div>
                  </div>
                )}

                <hr />
                <div className="PriceafterDiv">
                  <div className="leftPriceafter">
                    <h5>Price after Discount</h5>
                  </div>
                  <div className="rightPriceafter">₹ {finalTotalAfterAgentDiscount.toFixed(2)}</div>
                </div>

                <hr />
                <div className="taxDiv">
                  <div className="lefttax">
                    <h5>
                      Taxes & Service Fees{" "}
                      <i
                        className="bi bi-info-circle h6"
                        onClick={() => alert(`${gstRate * 100}% GST\nService Charges\nBooking Fees\nConvenience Fees`)}
                        style={{ cursor: 'pointer' }}
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
                  <div className="rightfinalamt text-color">₹ {finalAmount.toFixed(2)}</div>
                </div>

                <div className="bookcombtn booknowbtn w-100" onClick={handlePayAndBook}>
                  Pay and book <i className="bi bi-arrow-right-short h3 m-0"></i>
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
    </>
  );
};

export default ReviewBooking;
