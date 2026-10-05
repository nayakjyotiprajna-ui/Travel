import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[TravelTwin ErrorBoundary caught]', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-navy-950 flex items-center justify-center p-6 text-slate-100 font-sans">
          <div className="glass-card max-w-lg w-full p-8 rounded-2xl text-center border-red-500/20 shadow-glass">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-5">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2 font-display">Something went wrong</h2>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              TravelTwin encountered an unexpected client error. You can reload the page or return to the home screen.
            </p>

            {this.state.error && (
              <div className="bg-navy-900/80 p-3 rounded-lg text-left text-xs font-mono text-red-300 mb-6 overflow-auto max-h-32 border border-red-500/10">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-button-primary text-xs font-semibold"
              >
                <RotateCcw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-button-secondary text-xs font-semibold"
              >
                <Home className="w-4 h-4" />
                Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
