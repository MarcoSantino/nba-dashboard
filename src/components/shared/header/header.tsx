import React from 'react';
import { Link } from 'react-router-dom';
import './header.scss';

function Header(): JSX.Element {

    return (
        <header className="header">
            <Link to="/">
                <h1 className="header--title">
                    NBA Stats
                </h1>
            </Link>
        </header>
    );
}

export default Header;
