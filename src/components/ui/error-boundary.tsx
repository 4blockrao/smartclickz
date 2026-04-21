
import React, { Component, ReactNode, ErrorInfo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean; error: Error } {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    
    // Here you could send the error to a logging service
    // Example: logErrorToService(error, errorInfo);
  }

  handleResetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-md p-6">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <ShieldAlert className="text-red-500 w-8 h-8" />
              </div>
              
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold">Something went wrong</h2>
                <p className="text-sm text-muted-foreground">
                  An error occurred while rendering this component
                </p>
              </div>
              
              <div className="w-full">
                <details className="bg-muted p-3 rounded-md text-sm mb-4">
                  <summary className="cursor-pointer font-medium">Show error details</summary>
                  <div className="mt-2 p-2 bg-muted/80 rounded overflow-auto max-h-32">
                    <p className="font-mono text-xs text-red-500">
                      {this.state.error?.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="font-mono text-xs mt-2 text-muted-foreground whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="default" 
                  onClick={this.handleResetError}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                >
                  Go to Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
