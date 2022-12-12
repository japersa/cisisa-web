import React from "react";

const Footer = () => {
  const date = new Date();
  return (
    <footer className="sticky-footer bg-white">
      <div className="container my-auto">
        <div className="copyright text-center my-auto">
          <span>Copyright &copy; Cisisa {date.getFullYear}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
