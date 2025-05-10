import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  // Update state to display fallback UI
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Log the error and error info
  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>Please refresh the page or try again later.</p>
          <details style={{ whiteSpace: "pre-wrap" }}>
            <summary>Error Details</summary>
            <p>{this.state.error?.toString()}</p>
            <p>{this.state.errorInfo?.componentStack}</p>
          </details>
        </div>
      );
    }

    // Render children if no error
    return this.props.children;
  }
}

export default ErrorBoundary;