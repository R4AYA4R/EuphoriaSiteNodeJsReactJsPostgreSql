import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__inner">
                    <div className="footer__topBlock">
                        <ul className="footer__topBlock-list">
                            <h1 className="footer__item-title">Need Help</h1>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">Contact Us</Link>
                            </li>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">FAQ's</Link>
                            </li>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">Career</Link>
                            </li>
                        </ul>
                        <ul>
                            <h1 className="footer__item-title">Company</h1>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">About Us</Link>
                            </li>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">Euphoria Blog</Link>
                            </li>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">Collaboration</Link>
                            </li>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">Media</Link>
                            </li>
                        </ul>
                        <ul>
                            <h1 className="footer__item-title">More Info</h1>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">Term and Conditions</Link>
                            </li>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">Privacy Policy</Link>
                            </li>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">Shipping Policy</Link>
                            </li>
                        </ul>
                        <ul>
                            <h1 className="footer__item-title">Location</h1>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">supporteuphoria@gmail.com</Link>
                            </li>
                            <li className="footer__list-item">
                                <p className="footer__item-text">Eklingpura Chouraha, Ahmedabad Main Road</p>
                            </li>
                            <li className="footer__list-item">
                                <p className="footer__item-text">(NH 8- Near Mahadev Hotel) Udaipur, India- 313002</p>
                            </li>
                        </ul>
                    </div>
                    <div className="footer__bottomBlock">
                        <p className="footer__bottomBlock-text">Copyright © 2023 Euphoria Folks Pvt Ltd. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;