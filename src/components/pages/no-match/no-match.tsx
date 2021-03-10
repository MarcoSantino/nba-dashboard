import React from 'react';
import './no-match.scss';

function NoMatch(): JSX.Element {
    return (
        <div className="page-404">
            <h2>404</h2>
            <p>Page not found</p>
        </div>
    );
}

export default NoMatch;
