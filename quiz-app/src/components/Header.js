import { Link } from "react-router-dom";

function Header(props) {
  return (
    <>
      <div className="header">
        <div className="container-1">
          <Link className='white-color' to="/">Home</Link>
        
        </div>
      </div>
    </>
  );
}

export default Header;
