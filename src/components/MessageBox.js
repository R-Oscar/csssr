import React from 'react';
import './styles/MessageBox.css';

const MessageBox = ({ message, closeHandler }) =>
	<div className="overlay" style={{ 'display': message === "" ? 'none' : 'block' }}>
		<div className="messageBox">
			{ message }
			<div className="button-container">
				<button onClick={closeHandler}>Закрыть</button>
			</div>
		</div>
	</div>

MessageBox.propTypes = {
	message: React.PropTypes.string.isRequired,
	closeHandler: React.PropTypes.func.isRequired
}

export default MessageBox;