import React from 'react';
import { Link } from 'react-router-dom';
const Footer = () => {
    return (
        <section>
            <footer className="footer p-10 bg-base-200 text-base-content ">
                {/* <aside className="mx-auto">
                    <img loading="lazy" className="w-1/2 drop-shadow-2xl" src="https://i.ibb.co/GMQPmpY/QEL.png" alt="" />
                </aside> */}
                <aside className="">
                    <span className="btn btn-ghost text-2xl font-bold">Quick Edu Live</span>
                </aside>
                <nav>
                    <h6 className="footer-title">Services</h6>
                    <Link className="link link-hover">Ai Classroom</Link>
                    <Link className="link link-hover">Ai Quiz Generator</Link>
                    <Link className="link link-hover">Ai Assignment Generator</Link>
                    <Link className="link link-hover">Ai Paper Checker</Link>
                </nav>
                <nav>
                    <h6 className="footer-title">Company</h6>
                    <Link className="link link-hover">About us</Link>
                    <Link className="link link-hover">Contact</Link>
                </nav>
                <nav>
                    <h6 className="footer-title">Legal</h6>
                    <Link className="link link-hover">Terms of use</Link>
                </nav>
            </footer>
        </section>
    );
};

export default Footer;