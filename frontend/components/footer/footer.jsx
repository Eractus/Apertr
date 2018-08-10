import React from 'react';
import { withRouter } from 'react-router-dom';

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <footer className="footer">
        <ul className="footer-items">
          <li><a href="https://github.com/Eractus">GitHub</a></li>
          <li><a href="https://www.linkedin.com/in/danny-peng-29515651/">LinkedIn</a></li>
        </ul>
      </footer>
    );
  }
}

export default Footer;
