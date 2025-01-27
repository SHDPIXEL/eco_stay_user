import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
    
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, [pathname]);

  return (
    <>
      {/* Back to Top Button */}
      {isVisible && (
      <div><button
          onClick={scrollToTop}
          className="backtotopbtn"
        >
         <i className="bi bi-arrow-up-short"></i>
        </button>
        </div>
      )}
    </>
  );
};