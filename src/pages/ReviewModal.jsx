import React from "react";
import reviewPack1 from "../assets/images/reviewPack1.png";

const ReviewModal = (props) => {
  const {
    ReviewModalshow,
    setReviewModalshow,
    checkInDate,
    checkOutDate,
    selectedRoom,
    selectedPackage,
    selectedCottages,
    basePrice,
    packagePrice,
    pricePerNight,
    occupancyType,
    newPrice,
  } = props;
  const closeReviewmodal = () => {
    setReviewModalshow(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <div
        className={
          ReviewModalshow ? "overlayLoginModal d-block" : "overlayLoginModal"
        }
      ></div>
      <div
        className={
          ReviewModalshow
            ? "rightAuthModal rightReviewModal show"
            : "rightAuthModal rightReviewModal"
        }
      >
        <div className="px-md-3 px-2 pt-1 reviewmodalscroll">
          <div className="authmodal">
            <div className="AuthcloseIcon" onClick={closeReviewmodal}>
              <i className="bi bi-x-circle-fill"></i>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-12">
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
                          {checkInDate}
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
                          {checkOutDate}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mt-3 text-right justify-content-end">
                    <div className="rightpackD">
                      <div className="d-flex justify-content-end">
                        {/* <Link className="actionicon" to="/book-your-stay">
                          <i className="bi bi-pencil-fill"></i>{" "}
                          <em>Edit details</em>
                        </Link> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="desktopView d-md-block d-none">
                <div className="mt-3 reviewbookigbox">
                  <div className="d-flex w-100">
                    <div className="imgd">
                      <img src={reviewPack1} alt="" />
                    </div>
                    <div className="packDetails">
                      <div>
                        <div className="d-flex justify-content-between w-100">
                          <div className="leftpackD ">
                            <div className="d-flex">
                              <h4>{selectedRoom?.room_name}</h4>
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
                              Type of package:{" "}
                              <span>{selectedPackage?.name}</span>
                            </p> */}
                            <p>
                              Type of occupancy: <span>{occupancyType}</span>
                            </p>
                          </div>
                          <div className="rightpackD">
                          <h6><span className="textdis">₹ {(newPrice).toFixed(2)}</span> ₹ {basePrice.toFixed(2)}/room/per night</h6>
                            {/* <h6>₹ {packagePrice?.toFixed(2)}/package</h6> */}
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
                    Bookings cancelled under 15 days before check-in or No Show
                    : 100% of total invoice amount.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ReviewModal;
