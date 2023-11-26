import React, { Component } from 'react';
// Import your CSS file if needed

class SMSForm extends Component {
  render() {
    return (
      <form
        onSubmit={this.onSubmit}
        className={`${
          this.state.error ? 'border-red-500' : 'border-gray-300'
        } shadow-md rounded-md p-4 mx-auto max-w-md`}
      >
        <div className="mb-4">
          <label htmlFor="to" className="block text-sm font-medium text-gray-600">
            To:
          </label>
          <input
            type="tel"
            name="to"
            id="to"
            value={this.state.message.to}
            onChange={this.onHandleChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
          <p className="mt-2 text-xs text-gray-500">
            Enter the recipients phone number (including country code).
          </p>
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">
            Your Name:
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={this.state.message.name}
            onChange={this.onHandleChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="body" className="block text-sm font-medium text-gray-600">
            Enter Amount:
          </label>
          <textarea
            name="body"
            id="body"
            value={this.state.message.body}
            onChange={this.onHandleChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
          <p className="mt-2 text-xs text-gray-500">
            Include the currency in the amount (e.g., $50, €100).
          </p>
        </div>
        <div className="mb-4">
          <label htmlFor="messageType" className="block text-sm font-medium text-gray-600">
            Message Type:
          </label>
          <select
            name="messageType"
            id="messageType"
            value={this.state.message.messageType}
            onChange={this.onHandleChange}
            className="mt-1 p-2 w-full border rounded-md"
          >
            <option value="topUp">Top-Up</option>
            <option value="debtReminder">Debt Reminder</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={this.state.submitting}
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-700"
        >
          Send message
        </button>
        {this.state.success && (
          <div className="text-green-500 mt-2">Message sent successfully!</div>
        )}
        {this.state.error && (
          <div className="text-red-500 mt-2">Error sending message. Please try again.</div>
        )}
      </form>
  );
}

  onHandleChange(event) {
    const name = event.target.getAttribute('name');
    this.setState({
      message: { ...this.state.message, [name]: event.target.value },
      success: false,
    });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    if (
      !this.state.message.to ||
      !this.state.message.body ||
      !this.state.message.name
    ) {
      alert('Please fill in all fields before sending a message.');
      return;
    }
    this.setState({ submitting: true });
  
    let messageTypeText = `Please top me up with ${this.state.message.body} \nFrom: ${this.state.message.name}\n @ miniPay`;
  
    if (this.state.message.messageType === 'topUp') {
      messageTypeText = `Please top me up with ${this.state.message.body} \nFrom: ${this.state.message.name}\n @ minipay `;
    } else if (this.state.message.messageType === 'debtReminder') {
      messageTypeText = `Please be reminded to pay a debt of ${this.state.message.body} to ${this.state.message.name} \n@minipay`;
    }
  
    const finalMessage = `${messageTypeText} `;
  
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...this.state.message, body: finalMessage }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  
      if (data.success) {
        this.setState({
          error: false,
          submitting: false,
          success: true,
          message: {
            to: '',
            body: '',
          },
        });
      } else {
        this.setState({
          error: true,
          submitting: false,
          success: false,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      this.setState({
        error: true,
        submitting: false,
        success: false,
      });
    }
  };
  

  constructor(props) {
    super(props);
    this.state = {
      message: {
        to: '',
        body: '',
      },
      submitting: false,
      error: false,
      success: false,
    };
    this.onHandleChange = this.onHandleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
}

export default SMSForm;
